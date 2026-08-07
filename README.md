# 🏠 Salão da Tia Loira

## 📋 Descrição
Aplicativo web para agendamento de serviços do Salão da Tia Loira.

## ✨ Funcionalidades
- 📝 Cadastro de cliente (nome e telefone)
- 📅 Escolha de data e horário
- ✂️ Seleção de serviços (cabelo, chapinha, unhas, etc.)
- 📱 Envio automático para WhatsApp
- 📋 Lista de agendamentos realizados
- 🗑️ Exclusão de agendamentos
- 🔒 Validação de horários (08:00 - 20:00)

## 🚀 Como usar
1. Abra o arquivo `index.html` no navegador
2. Preencha todos os campos do formulário
3. Clique em "Agendar e Enviar para WhatsApp"
4. Confirme o envio da mensagem


## 📂 Estrutura de Arquivos

```
salao-da-tia-loira/
│
├── index.html
│
├── css/
│   └── style.css
│
├── js/
│   └── script.js
│
└── README.md
```

## ⚙️ Configuração
### WhatsApp
No arquivo `js/script.js`, altere a constante:
```javascript
const WHATSAPP_NUMBER = '5511999999999'; // Seu número com DDD
