import React, { useState } from 'react';
import { login } from './services/api';
import Vehicles from './features/vehicles/Vehicles';
import Drivers from './features/drivers/Drivers';
import './index.css';
import logo from './assets/FROTCOM-Logo-RGB-White.png';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState(null); // 'vehicles', 'drivers' etc.

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    setLoading(true);
    setError(null);
    try {
      const token = await login(username, password);
      localStorage.setItem('frotcom_api_key', token);
      setIsLoggedIn(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (view === 'vehicles') {
      return <Vehicles />;
    }
    if (view === 'drivers') {
      return <Drivers />;
    }
    return null;
  };

  return (
    <div className="container">
      <div className="top-bar">
      <img src={logo} alt="Logo da Empresa" className="logo" />
    </div>
      <header>
        <h1>API Interface</h1>
      </header>

      {!isLoggedIn ? (
        <form onSubmit={handleLogin} className="login-form">
          <h2>Login</h2>
          <input type="text" name="username" placeholder="Utilizador" required />
          <input type="password" name="password" placeholder="Senha" required />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
      ) : (
        <>
          <div className="button-group">
            <button onClick={() => setView('vehicles')} disabled={loading}>
              Obter Veículos
            </button>
            <button onClick={() => setView('drivers')} disabled={loading}>
              Obter Condutores
            </button>
            {/* Adicione mais botões aqui */}
          </div>
          {renderContent()}
        </>
      )}
    </div>
  );
};

export default App;