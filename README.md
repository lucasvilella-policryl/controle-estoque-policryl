# Sistema de Gestão de Estoque Policryl

Sistema completo para gestão de estoque desenvolvido com HTML, CSS, JavaScript e Firebase.

## Funcionalidades

- ✅ Dashboard com resumo do estoque
- ✅ Consulta de produtos por SKU
- ✅ Estoque geral com fotos e filtros
- ✅ Registro de movimentações
- ✅ Cadastro de produtos com upload de foto
- ✅ Cadastro de responsáveis
- ✅ Cadastro de linhas de produtos
- ✅ Status de produtos (ativo/inativo)
- ✅ Notificações de estoque baixo
- ✅ Interface responsiva para celular
- ✅ Dados compartilhados entre usuários

## Tecnologias Utilizadas

- HTML5
- CSS3 com Bootstrap 5
- JavaScript ES6+
- Firebase Firestore (banco de dados)
- Firebase Storage (armazenamento de imagens)

## Como Usar

### 1. Configuração do Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Adicione um aplicativo web ao projeto
3. Copie as credenciais do Firebase para o arquivo `js/firebase-config.js`
4. Habilite o Firestore Database no modo de teste
5. Habilite o Firebase Storage para armazenamento de imagens

### 2. Hospedagem no GitHub Pages

1. Crie um repositório no GitHub
2. Faça upload dos arquivos do projeto
3. Vá para as configurações do repositório > Pages
4. Selecione a branch main e a pasta /docs
5. Clique em Save

### 3. Estrutura do Banco de Dados (Firestore)

#### Coleção `produtos`