import { useState, useEffect, useCallback } from "react";
import axios from "axios";

// Função para abrir o banco de dados IndexedDB e criar as tabelas necessárias
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("MeuBanco", 2); // Nome do banco e versão

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("users")) {
        db.createObjectStore("users", { keyPath: "id" }); // Cria a tabela de usuários
      }
      if (!db.objectStoreNames.contains("products")) {
        db.createObjectStore("products", { keyPath: "id" }); // Cria a tabela de produtos
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

// Função para salvar dados no IndexedDB
async function salvarDados(tabela, dados) {
  if (dados.length === 0) return;

  const db = await openDatabase();
  const transaction = db.transaction(tabela, "readwrite");
  const store = transaction.objectStore(tabela);

  dados.forEach((item) => store.put(item)); // Insere ou atualiza cada item
}

// Função para comparar e atualizar os dados no IndexedDB
async function atualizarTabela(tabela, novosDados) {
  if (novosDados.length === 0) return false;

  const dadosAntigos = await buscarDados(tabela);

  // Verifica se os dados são diferentes antes de atualizar
  const mudou = JSON.stringify(dadosAntigos) !== JSON.stringify(novosDados);

  if (mudou) {
    const db = await openDatabase();
    const transaction = db.transaction(tabela, "readwrite");
    const store = transaction.objectStore(tabela);
    await store.clear(); // Limpa a tabela antes de inserir novos dados
    await salvarDados(tabela, novosDados); // Salva os novos dados
  }

  return mudou;
}

// Função para buscar dados do IndexedDB
async function buscarDados(tabela) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(tabela, "readonly");
    const store = transaction.objectStore(tabela);
    const request = store.getAll(); // Busca todos os dados da tabela

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Hook para gerenciar o uso do IndexedDB
const useIndexedDB = (apiUrl, tabela, setAlert) => {
  const [data, setData] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Função para limpar a tabela no IndexedDB
  async function limparTabela() {
    try {
      const db = await openDatabase();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(tabela, "readwrite");
        const store = transaction.objectStore(tabela);
        const request = store.clear(); // Limpa a tabela

        request.onsuccess = () => {
          setData([]); // Atualiza o estado após limpar
          setAlert && setAlert("success", `Tabela ${tabela} limpa!`);
          resolve();
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      setAlert && setAlert("error", "Erro ao limpar a tabela.");
      console.error("Erro ao limpar tabela:", error);
    }
  }

  // Função para carregar os dados do IndexedDB
  const loadFromIndexedDB = useCallback(async () => {
    const storedData = await buscarDados(tabela);
    setData(storedData);
  }, [tabela]);

  // Função para buscar os dados da API e atualizar o IndexedDB
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setAlert && setAlert("info", "Aguardando resposta do servidor");

    try {
      const resp = await axios.get(apiUrl);
      if (resp.status === 200) {
        const dataArray = Array.isArray(resp.data)
          ? resp.data
          : resp.data[tabela] || [];

        setIsUpdating(true);
        if (dataArray.length > 0) {
          const atualizado = await atualizarTabela(tabela, dataArray);
          if (atualizado) {
            setIsChanged(true);
            setAlert && setAlert("success", "Dados atualizados no IndexedDB!");
          } else {
            setIsChanged(false);
            setAlert && setAlert("info", "Nenhuma mudança detectada.");
          }
        }

        setData(dataArray);
      }
    } catch (err) {
      setIsUpdating(false);
      setAlert && setAlert("error", "Erro de conexão com a API");
      console.error("Erro de API:", err);
    } finally {
      setIsLoading(false);
      loadFromIndexedDB();
    }
  }, [apiUrl, tabela, setAlert, loadFromIndexedDB]);

  // Carrega os dados do IndexedDB ao montar o componente
  // useEffect(() => {
  //   loadFromIndexedDB();
  // }, [loadFromIndexedDB]);

  return {
    data,
    isLoading,
    isUpdating,
    isChanged,
    refetch: fetchData,
    limparTabela,
  };
};

export default useIndexedDB;
