// Configurações
const HORARIO_ABERTURA = 8; // 08:00
const HORARIO_FECHAMENTO = 20; // 20:00
const WHATSAPP_NUMBER = '5511999999999'; // Substitua pelo número real

// Gerar horários disponíveis
function gerarHorarios() {
    const horarios = [];
    for (let hora = HORARIO_ABERTURA; hora < HORARIO_FECHAMENTO; hora++) {
        horarios.push(`${hora.toString().padStart(2, '0')}:00`);
        horarios.push(`${hora.toString().padStart(2, '0')}:30`);
    }
    return horarios;
}

// Preencher select de horários
function preencherHorarios() {
    const selectHorario = document.getElementById('horario');
    const horarios = gerarHorarios();
    
    selectHorario.innerHTML = '<option value="">Selecione um horário disponível</option>';
    
    horarios.forEach(horario => {
        const option = document.createElement('option');
        option.value = horario;
        option.textContent = horario;
        selectHorario.appendChild(option);
    });
}

// Definir data mínima para agendamento (próximo dia útil)
function definirDataMinima() {
    const inputData = document.getElementById('data');
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);
    
    // Se amanhã for sábado ou domingo, vai para segunda
    while (amanha.getDay() === 0 || amanha.getDay() === 6) {
        amanha.setDate(amanha.getDate() + 1);
    }
    
    const dataFormatada = amanha.toISOString().split('T')[0];
    inputData.setAttribute('min', dataFormatada);
}

// Validar horário de funcionamento
function validarHorario(horario) {
    const hora = parseInt(horario.split(':')[0]);
    return hora >= HORARIO_ABERTURA && hora < HORARIO_FECHAMENTO;
}

// Salvar agendamento no localStorage
function salvarAgendamento(agendamento) {
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    agendamento.id = Date.now();
    agendamentos.push(agendamento);
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
}

// Listar agendamentos
function listarAgendamentos() {
    const container = document.getElementById('listaAgendamentos');
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
    
    if (agendamentos.length === 0) {
        container.innerHTML = '<p class="empty-message">Nenhum agendamento realizado ainda.</p>';
        return;
    }
    
    container.innerHTML = '';
    agendamentos.forEach((agendamento, index) => {
        const div = document.createElement('div');
        div.className = 'agendamento-item';
        div.innerHTML = `
            <div class="info">
                <strong>${agendamento.nome}</strong>
                <span>📞 ${agendamento.telefone}</span>
                <span>✂️ ${agendamento.servico}</span>
                <span>📅 ${agendamento.data} às ${agendamento.horario}</span>
                ${agendamento.observacoes ? `<span>📝 ${agendamento.observacoes}</span>` : ''}
            </div>
            <button class="btn-excluir" data-index="${index}">
                <i class="fas fa-trash"></i> Excluir
            </button>
        `;
        container.appendChild(div);
    });
    
    // Adicionar evento de exclusão
    document.querySelectorAll('.btn-excluir').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            excluirAgendamento(index);
        });
    });
}

// Excluir agendamento
function excluirAgendamento(index) {
    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
        const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
        agendamentos.splice(index, 1);
        localStorage.setItem('agendamentos', JSON.stringify(agendamentos));
        listarAgendamentos();
    }
}

// Enviar para WhatsApp
function enviarWhatsApp(dados) {
    const mensagem = `
*🗓️ NOVO AGENDAMENTO - SALÃO DA TIA LOIRA*

👤 *Nome:* ${dados.nome}
📞 *Telefone:* ${dados.telefone}
✂️ *Serviço:* ${dados.servico}
📅 *Data:* ${dados.data}
⏰ *Horário:* ${dados.horario}
${dados.observacoes ? `📝 *Observações:* ${dados.observacoes}` : ''}

✅ *Agendamento confirmado!*
    `.trim();

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}

// Validar telefone
function validarTelefone(telefone) {
    const regex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return regex.test(telefone);
}

// Formatar telefone
function formatarTelefone(input) {
    let valor = input.value.replace(/\D/g, '');
    if (valor.length <= 10) {
        valor = valor.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    } else {
        valor = valor.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    }
    input.value = valor;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Preencher horários
    preencherHorarios();
    
    // Definir data mínima
    definirDataMinima();
    
    // Listar agendamentos
    listarAgendamentos();
    
    // Formatar telefone
    document.getElementById('telefone').addEventListener('input', function() {
        formatarTelefone(this);
    });
    
    // Submeter formulário
    document.getElementById('agendamentoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nome = document.getElementById('nome').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const servico = document.getElementById('servico').value;
        const data = document.getElementById('data').value;
        const horario = document.getElementById('horario').value;
        const observacoes = document.getElementById('observacoes').value.trim();
        
        // Validações
        if (!nome || !telefone || !servico || !data || !horario) {
            alert('Por favor, preencha todos os campos obrigatórios!');
            return;
        }
        
        if (!validarTelefone(telefone)) {
            alert('Por favor, insira um telefone válido! Formato: (00) 00000-0000');
            return;
        }
        
        if (!validarHorario(horario)) {
            alert('Horário inválido! O salão funciona das 08:00 às 20:00.');
            return;
        }
        
        // Verificar se horário já está ocupado
        const agendamentos = JSON.parse(localStorage.getItem('agendamentos') || '[]');
        const horarioOcupado = agendamentos.some(a => a.data === data && a.horario === horario);
        
        if (horarioOcupado) {
            alert('Este horário já está ocupado! Por favor, escolha outro horário.');
            return;
        }
        
        // Criar objeto do agendamento
        const agendamento = {
            nome,
            telefone,
            servico,
            data,
            horario,
            observacoes
        };
        
        // Salvar
        salvarAgendamento(agendamento);
        
        // Atualizar lista
        listarAgendamentos();
        
        // Enviar WhatsApp
        enviarWhatsApp(agendamento);
        
        // Limpar formulário
        this.reset();
        definirDataMinima();
        
        alert('✅ Agendamento realizado com sucesso!');
    });
});