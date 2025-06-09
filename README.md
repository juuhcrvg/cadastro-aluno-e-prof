# 📚 Sistema de Cadastro de Alunos

Este é um sistema completo de cadastro de alunos, desenvolvido como uma aplicação web full-stack. Ele utiliza **⚛️ React** com **Vite** para o frontend, **Node.js** com **Express** para o backend, e **SQLite** para a persistência de dados.

## ✨ Funcionalidades

* **Cadastro de Alunos:** Permite adicionar novos alunos com `nome`, `email` e `curso` (opcional) através de um formulário intuitivo.
* **Listagem de Alunos:** Exibe todos os alunos cadastrados de forma clara.
* **Remoção de Alunos:** Permite deletar registros de alunos existentes.

## 🛠️ Tecnologias Utilizadas

* **Frontend:**
    * **⚛️ React:** Biblioteca JavaScript para construção de interfaces de utilizador.
    * **Vite:** Ferramenta de build rápida para projetos web modernos.
    * **CSS:** Estilização responsiva e moderna para uma melhor experiência do utilizador.
* **Backend:**
    * **Node.js:** Ambiente de execução JavaScript no lado do servidor.
    * **Express:** Framework web para Node.js, utilizado para construir a API RESTful.
* **Banco de Dados:**
    * **SQLite:** Banco de dados relacional leve e sem servidor, ideal para projetos pequenos e médios.

## 🚀 Como Rodar o Projeto

### Pré-requisitos

Certifique-se de ter o Node.js e o npm (ou yarn) instalados em sua máquina.

### 1. Backend

1.  Clone este repositório:
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd <nome-do-seu-repositorio> # Navegue até a pasta raiz do projeto
    ```
2.  Navegue até a pasta do backend (ex: `cd backend` se você tiver uma pasta separada para ele).
3.  Instale as dependências:
    ```bash
    npm install
    # ou
    yarn install
    ```
4.  Inicie o servidor backend:
    ```bash
    npm start # Ou o comando definido no seu package.json para iniciar o servidor
    # Geralmente rodará em http://localhost:3000
    ```

### 2. Frontend

1.  Navegue até a pasta do frontend (ex: `cd frontend` ou se for na raiz `cd .`).
2.  Instale as dependências:
    ```bash
    npm install
    # ou
    yarn install
    ```
3.  Inicie a aplicação frontend:
    ```bash
    npm run dev
    # ou
    yarn dev
    # Geralmente rodará em http://localhost:5173
    ```

## ⚙️ Notas de Desenvolvimento (Frontend)

Este projeto frontend foi configurado utilizando o template **React + Vite**, que oferece uma configuração mínima para iniciar um projeto React com Hot Module Replacement (HMR) e algumas regras ESLint.

Plugins oficiais utilizados com Vite:

* [`@vitejs/plugin-react`](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react): Utiliza [Babel](https://babeljs.io/) para Fast Refresh.
* [`@vitejs/plugin-react-swc`](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc): Utiliza [SWC](https://swc.rs/) para Fast Refresh.

### ➕ Expandindo a Configuração ESLint

Se você estiver desenvolvendo uma aplicação para produção, é recomendável usar TypeScript com regras de linting que levam em conta os tipos. Consulte o [template TS](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) para informações sobre como integrar TypeScript e [`typescript-eslint`](https://typescript-eslint.io) em seu projeto.

---

**Observações:**

* Substitua `<URL_DO_SEU_REPOSITORIO>` e `<nome-do-seu-repositorio>` pelos dados corretos do seu projeto.
* Ajuste os comandos `npm start` e `npm run dev` se forem diferentes no seu `package.json`.
* Se você tiver pastas separadas para "frontend" e "backend" no seu projeto, adapte os comandos `cd` para navegar entre elas.
