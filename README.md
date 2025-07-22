# Coop-farm (web)

**Coop-farm** é um aplicativo web de uma cooperativa de fazendas, desenvolvido em **React** com **Next.js**. O objetivo é permitir que os usuários registrem e acompanhem os produtos em produção, colheita e estoque para venda. O foco está na **simplicidade** e nas funcionalidades essenciais para o gerenciamento de produtos agrícolas.

## Funcionalidades

O sistema possui uma estrutura de login/logout que garante a segurança dos dados do usuário. Além disso:

- **Cadastro de produtos:** permite registrar novos produtos.
- **Lista de produtos:** o usuário pode consultar todos os produtos cadastrados.
- **Dashboard de vendas:** visualização gráfica das vendas com possibilidade de ordenação.
- **Cadastro de vendas:** permite registrar a venda de um produto.
- **Gestão de produção:** possibilita cadastrar o estágio atual de um produto (ex: colheita).
- **Dashboard de produção:** visualiza todos os itens da produção em uma tabela simples e informativa.
- **Cadastro de metas:** registrar metas de venda ou produção.
- **Listagem de metas:** lista metas cadastradas e seus status.
- **Notificações de metas:** alerta quando metas forem atingidas ou expiradas.
- **Lazy loading:** paginação implementada para melhor desempenho em listas longas.

## Tecnologias Utilizadas

- **Framework:** Next.js (React)
- **Linguagem de programação:** TypeScript
- **Gerenciamento de estado:** MobX e Zustand
- **Autenticação:** Firebase Auth (login/logout)
- **Gráficos e dashboards:** [react-google-charts](https://www.npmjs.com/package/react-google-charts)
- **Módulos remotos:** Module Federation via [`@module-federation/nextjs-mf`](https://www.npmjs.com/package/@module-federation/nextjs-mf)
- **Programação reativa:** Utilização do conceito reativo com MobX, garantindo que a UI reaja automaticamente às mudanças de estado.

## Pré-requisitos

Antes de rodar o projeto, é necessário ter **Node.js** e **npm** instalados.  
Você pode baixá-los em: [https://nodejs.org/](https://nodejs.org/)

## Instalação

Clone o repositório do projeto:

```bash
git clone https://github.com/eduardasneves18/farm-coop-host.git
```
Navegue até a pasta do projeto:

```bash
cd coop-farm-host
```
Instale as dependências:

```bash
npm ci
```
Execute o aplicativo:

```bash
npm run start
```
O app será iniciado em um navegador web.

## Licença
Este projeto é de livre uso para fins de estudo e demonstração.
