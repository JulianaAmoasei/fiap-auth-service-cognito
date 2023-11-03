# FIAP Pós Tech - Arquitetura de Software 

Repositório de código e infraestrutura do **serviço de autenticação de usuários** do sistema de gerenciamento de totems para restaurantes.

## Stack e ferramentas utilizadas

* TypeScript
* Serverless Framework
* Serviços AWS
  * Lambda
  * Cognito

## Descrição

Este serviço expõe dois endpoints HTTP para autenticação de usuários únicos na plataforma de pedidos.

* endpoint `/api/signup` para autenticação de clientes finais com base em CPF únicos e válidos;
* endpoint `/api/admin` para autenticação de usuários do tipo admin do sistema, com base em email e senha.

### Autenticação clientes finais (pedido)

A inclusão e autenticação dos clientes é feita através do Cognito.

```
POST https://<endpoint-prod>.execute-api.us-east-1.amazonaws.com/api/signup
payload: 
  { "cpf": "<cpf válido no formato XXXXXXXXXXX>" }
response:
  200 OK
  "<string token JWT da sessão>"
```

CPFs válidos serão adicionados ao diretório de clientes caso não existam, em seguida autenticados no sistema. CPFs de clientes já existente serão autenticados. Ambos os casos seguem o mesmo padrão para `request` e `response`.

### Autenticação usuários admin do sistema

A inclusão e autenticação dos clientes é feita através do Cognito.

```
POST https://<endpoint-prod>.execute-api.us-east-1.amazonaws.com/api/admin
payload: 
  { "email": "<email>", "password": "<mínimo 6 dígitos>" }
response:
  200 OK
  "<string token JWT da sessão>"
```

os dados serão adicionados ao diretório de clientes caso não existam, em seguida autenticados no sistema. CPFs de clientes já existente serão autenticados. Ambos os casos seguem o mesmo padrão para `request` e `response`.

## Instalação

Para instalar e executar o projeto, é necessário:
- Node.js v18.16.0
- Serverless Framework instalado globalmente
- Credenciais válidas da AWS com as permissões necessárias armazenadas em `~/.aws/credentials`


Para instalar o Serverless e integrar credenciais AWS, siga a [documentação](https://www.serverless.com/framework/docs/getting-started/).

### executar localmente

Para executar o projeto de forma local, siga os passos:

1. baixe o projeto
2. instale as dependências necessárias com `npm i`
3. execute localmente com `sls offline`

A infraestrutura do projeto, incluindo a criação dos recursos necessários da AWS Lambda e Cognito, é implantada automaticamente através do Terraform.
**********TODO: instruções para executar o tf**********

Uma vez implantado, o serviço expõe os mesmos endpoints da seção [descrição](#descrição) do projeto.
