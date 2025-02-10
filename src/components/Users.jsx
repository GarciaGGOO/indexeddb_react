import { useState } from "react";
import useIndexedDB from "../hooks/useIndexedDB";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import "./Users.css";

function Users() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const {
    data: users,
    isLoading,
    isUpdating,
    isChanged,
    refetch,
    limparTabela,
  } = useIndexedDB(
    "https://localhost:7289/api/v1/user/get-users",
    "users"
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  return (
    <div className="container">
      <h1>Usuários</h1>

      <div className="icons">
        {isUpdating ? (
          <FaCheckCircle style={{ color: "green" }} />
        ) : (
          <FaTimesCircle style={{ color: "red" }} />
        )}
        {isChanged ? (
          <FaExclamationCircle style={{ color: "green" }} />
        ) : (
          <FaExclamationCircle style={{ color: "red" }} />
        )}
      </div>

      <div className="buttons">
        <button onClick={refetch} disabled={isLoading}>
          {isLoading ? "Carregando..." : "Atualizar Usuários"}
        </button>
        <button onClick={limparTabela}>Limpar Tabela</button>
      </div>

      {currentUsers.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: "center", color: "#666" }}>Nenhum usuário encontrado.</p>
      )}

      <div className="pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span>{`Página ${currentPage} de ${totalPages}`}</span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Próxima
        </button>
      </div>
    </div>
  );
}

export default Users;