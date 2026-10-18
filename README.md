# Farda Nova — Gestão de Fardamento Corporativo

Projeto acadêmico de desenvolvimento Front-End para simulação de cadastro de colaboradores, requisição de kits de fardamento e Portal do Colaborador.

## Tecnologias

- HTML5 semântico
- CSS3
- Flexbox
- JavaScript Vanilla
- LocalStorage
- Git/GitHub
- GitHub Pages

Não foram utilizados frameworks de Front-End.

## Funcionalidades

1. **Login inicial**
   - Usuário de demonstração: `admin`
   - Senha de demonstração: `1234`
   - Sessão simulada com `localStorage`.

2. **Cadastro de colaborador**
   - Formulário com validação.
   - Dados salvos no `localStorage`.

3. **Requisição de fardamento**
   - Seleção de kit.
   - Geração de protocolo.
   - Status da requisição salvo no navegador.

4. **Portal do Colaborador**
   - Acompanhar requisição, exibindo o kit escolhido e seus itens.
   - Consultar protocolo da requisição.
   - Lista de peças disponíveis para troca, com seleção de uma ou mais peças, quantidade e motivo.
   - Manual de uso.
   - Termo de responsabilidade.
   - Cada botão apresenta uma mensagem específica e manipula dados dinamicamente.

## Estrutura

```text
FardaNova/
├── index.html
├── dashboard.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── pages/
│   ├── cadastro.html
│   ├── alistamento.html
│   └── servicos.html
└── README.md
```

## Observação

O login e o armazenamento local são apenas uma simulação acadêmica. Não devem ser usados para proteger dados reais ou credenciais reais.

## Requisitos da atividade

- HTML5 semântico
- CSS3 com Flexbox
- JavaScript puro (Vanilla)
- Sem frameworks
- Dados dinâmicos: com JavaScript e `localStorage`.
- Responsividade: com Flexbox e Media Queries.
- Versionamento/Deploy: configurado no GitHub e GitHub Pages pelo aluno.

## Funções da Página Inicial

- **01 — Controle de Estoque:** consulta os kits registrados, lista de aquisição e status da requisição.
- **02 — Segurança no Trabalho:** apresenta orientações sobre uso e conservação dos EPIs e acesso ao Portal do Colaborador.
- **03 — Agilidade de RH:** apresenta dados do colaborador e protocolo, com acesso ao cadastro.


## Atualização — Troca de Peça e Protocolos
- A solicitação de troca gera protocolo `TR-XXXXXX`, data, status, motivo, observação, peças e quantidades.
- A tela de registro exibe confirmação de sucesso com protocolo e data e oferece acesso direto ao Status da Troca.
- O Status da Troca recupera os dados salvos em `localStorage`.
- A consulta de protocolo aceita tanto `FN-XXXXXX` (requisição de fardamento) quanto `TR-XXXXXX` (troca de peça).
- A consulta `FN` apresenta também os materiais solicitados e suas quantidades.
- O protocolo `FN` só é criado quando a requisição de kits é efetivamente finalizada.


# Farda Nova

Sistema de Gestão de Fardamentos e Requisições.


## Links do Projeto

- **Repositório GitHub:** https://github.com/Sergio9315/Projeto_Farda_Nova_1
- **Sistema publicado (GitHub Pages - HTTPS):** https://sergio9315.github.io/Projeto_Farda_Nova_1/

---
