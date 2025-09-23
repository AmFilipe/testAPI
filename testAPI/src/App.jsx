import { useState } from 'react';
import './index.css';

const API_ENDPOINTS = {
  login: 'https://v2api.frotcom.com/v2/authorize',
  vehicles: 'https://v2api.frotcom.com/v2/vehicles',
  drivers: 'https://v2api.frotcom.com/v2/drivers',
  // Adicione outros endpoints aqui
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataType, setDataType] = useState(null); // 'vehicles', 'drivers', 'locations' etc.
  
  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'thirdparty', username, password }),
      });
      const result = await response.json();
      if (response.ok && result.token) {
        localStorage.setItem('frotcom_api_key', result.token);
        setIsLoggedIn(true);
      } else {
        throw new Error(result.message || 'Login failed.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (type) => {
    setLoading(true);
    setError(null);
    setData([]);
    setDataType(null);

    const token = localStorage.getItem('frotcom_api_key');
    if (!token) {
      setError('Not authenticated.');
      setLoading(false);
      return;
    }

    try {
      const url = `${API_ENDPOINTS[type]}?api_key=${token}`;
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      const result = await response.json();
      setData(result);
      setDataType(type);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditItem(item);
  };

  const handleSave = () => {
    // Lógica para salvar os dados editados
    console.log("Saving data:", editItem);
    setIsEditing(false);
    setEditItem(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditItem(null);
  };

  const renderTable = () => {
    if (data.length === 0) return null;

    const columns = Object.keys(data[0]);

    return (
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index}>{col}</th>
              ))}
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex}>
                    {dataType === 'vehicles' && col === 'Terminals' && Array.isArray(row[col]) && row[col].length > 0
                      ? row[col][0].Id
                      : JSON.stringify(row[col]) === '[object Object]'
                      ? 'Object'
                      : String(row[col])}
                  </td>
                ))}
                <td>
                  {dataType === 'vehicles' && (
                    <button onClick={() => handleEdit(row)}>Editar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container">
      <header>
        <h1>Frotcom API Interface</h1>
      </header>

      {!isLoggedIn ? (
        <form onSubmit={handleLogin} className="login-form">
          <h2>Login</h2>
          <input type="text" name="username" placeholder="Usuário" required />
          <input type="password" name="password" placeholder="Senha" required />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
      ) : (
        <>
          <div className="button-group">
            <button onClick={() => fetchData('vehicles')} disabled={loading}>
              Obter Veículos
            </button>
            <button onClick={() => fetchData('drivers')} disabled={loading}>
              Obter Condutores
            </button>
            {/* Adicione mais botões aqui */}
          </div>

          {loading && <p>Loading data...</p>}
          {error && <p className="error-message">{error}</p>}
          
          {isEditing ? (
            <div className="edit-form">
              <h3>Editando Veículo</h3>
              {Object.keys(editItem).map(key => (
                <div key={key}>
                  <label>{key}:</label>
                  <input
                    type="text"
                    value={String(editItem[key])}
                    onChange={(e) => setEditItem({ ...editItem, [key]: e.target.value })}
                  />
                </div>
              ))}
              <button onClick={handleSave}>Salvar</button>
              <button onClick={handleCancel}>Cancelar</button>
            </div>
          ) : (
            renderTable()
          )}
        </>
      )}
    </div>
  );
}

export default App;
