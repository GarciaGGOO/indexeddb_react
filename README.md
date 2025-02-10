# 🚀 Projeto: IndexedDB com React e Hooks

## 📌 Descrição
Este projeto foi desenvolvido para estudar e aplicar o uso do IndexedDB em conjunto com React e Hooks. O objetivo é armazenar e gerenciar dados localmente para possibilitar o uso offline, melhorando a experiência do usuário.

## 🛠 Tecnologias Utilizadas
- React.js com Vite
- IndexedDB para armazenamento local
- Axios para requisições HTTP
- Hooks personalizados para interagir com o IndexedDB
- Icons do FontAwesome

## 📂 Estrutura do Projeto
```
├── src
│   ├── components
│   │   ├── Users.jsx  # Componente para exibir e manipular usuários
│   │   ├── Users.css  # Estilos do componente Users
│   ├── hooks
│   │   ├── useIndexedDB.js  # Hook personalizado para interagir com IndexedDB
│   ├── App.jsx  # Componente principal
│   ├── main.jsx  # Ponto de entrada do React
│   ├── index.css  # Estilo base
└── ...
```

## ⚡ Como Executar o Projeto
1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   ```
2. Acesse a pasta do projeto:
   ```bash
   cd nome-do-projeto
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Acesse a aplicação no navegador pelo link indicado no terminal.

## 🔥 Principais Funcionalidades
- 📥 **Armazenamento local**: Os dados são salvos no IndexedDB para acesso offline.
- 🔄 **Sincronização com API**: Busca e atualiza os dados armazenados localmente.
- 🗑 **Limpeza do IndexedDB**: Permite excluir os dados armazenados.
- 📊 **Paginação de usuários**: Exibe os dados de forma organizada.

## 🎨 Comportamento dos Ícones
No componente de usuários, há dois ícones principais que indicam o status da comunicação com a API:
- ✅ **FaCheckCircle (Verde)**: Indica que a comunicação com a API foi bem-sucedida.
- ❌ **FaCheckCircle (Vermelho)**: Indica erro na comunicação com a API.
- ✅ **FaExclamationCircle (Verde)**: Indica que houve comunicação e os dados foram atualizados.
- ❌ **FaExclamationCircle (Vermelho)**: Indica que houve comunicação, mas os dados não tiveram alterações.

## 📌 Exemplo de Uso do Hook `useIndexedDB`
```jsx
const {
  data: users,
  isLoading,
  isUpdating,
  isChanged,
  refetch,
  limparTabela,
} = useIndexedDB("https://localhost:7289/api/v1/user/get-users", "users");
```

## 📜 Licença
Este projeto é de uso livre para fins de aprendizado.

---

Caso tenha dúvidas ou sugestões, fique à vontade para abrir uma issue ou contribuir! 😊

