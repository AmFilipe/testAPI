import React, { useState } from 'react';
import { login, loginIntranet } from './services/api';
import Vehicles from './features/vehicles/Vehicles';
import Drivers from './features/drivers/Drivers';
import './index.css';
import logo from './assets/FROTCOM-Logo-RGB-White.png';

const App = () => {
  // 1. GESTÃO DE ESTADO SEPARADA PARA CADA API
  const [isLoggedInClientes, setIsLoggedInClientes] = useState(
    !!localStorage.getItem('token_clientes') // Verifica se o token já existe no localStorage
  );
  const [isLoggedInIntranet, setIsLoggedInIntranet] = useState(
    !!localStorage.getItem('token_intranet') // Verifica se o token já existe no localStorage
  );
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState(null); // 'vehicles', 'drivers', 'intranet_recursos' etc.

  // 2. FUNÇÃO DE LOGIN MODIFICADA PARA GERIR AS DUAS APIS
  const handleLogin = async (e, apiType) => {
    e.preventDefault();
    
    // Para simplificar, vamos assumir que os campos de utilizador e senha são os que geraram o evento.
    // Usamos o FormData para obter os valores do formulário.
    const form = e.currentTarget.closest('form');
    const username = form.elements.username.value;
    const password = form.elements.password.value;
    
    setLoading(true);
    setError(null);
    try {
      let token;
      
      if (apiType === 'clientes') {
        token = await login(username, password);
        localStorage.setItem('token_clientes', token);
        setIsLoggedInClientes(true);
      } else if (apiType === 'intranet') {
        token = await loginIntranet(username, password);
        localStorage.setItem('token_intranet', token);
        setIsLoggedInIntranet(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    // Renderiza o componente da API Clientes
    if (view === 'vehicles') return <Vehicles />;
    if (view === 'drivers') return <Drivers />;
    
    // Renderiza o componente da API Intranet
    // if (view === 'intranet_recursos') return <IntranetRecursos />;
    
    return null;
  };

  const isAnyLoggedIn = isLoggedInClientes || isLoggedInIntranet;

  return (
    <div className="container">
      <div className="top-bar">
        <img src={logo} alt="Logo da Empresa" className="logo" />
      </div>
      
      <header>
        <h1>API Interface</h1>
      </header>

      {!isAnyLoggedIn ? (
        // 3. FORMULÁRIO COM DOIS BOTÕES DE LOGIN
        <form className="login-form">
          <h2>Login na API</h2>
          <input type="text" name="username" placeholder="Utilizador" required />
          <input type="password" name="password" placeholder="Senha" required />
          
          <button 
            type="submit" 
            onClick={(e) => handleLogin(e, 'clientes')} 
            disabled={loading}
          >
            {loading ? 'A autenticar...' : 'Login API Clientes'}
          </button>
          
          <button 
            type="submit" 
            onClick={(e) => handleLogin(e, 'intranet')} 
            disabled={loading}
            style={{ marginTop: '10px', backgroundColor: '#e74c3c' }} 
          >
            {loading ? 'A autenticar...' : 'Login API Intranet'}
          </button>
          
          {error && <p className="error-message">{error}</p>}
        </form>
      ) : (
        // 4. BOTÕES DE RECURSOS PARA AS APIS AUTENTICADAS
        <>
          <div className="button-group">
            {isLoggedInClientes && (
              <>
                <button onClick={() => setView('vehicles')} disabled={loading}>Obter Veículos</button>
                <button onClick={() => setView('drivers')} disabled={loading}>Obter Condutores</button>
              </>
            )}
            
            {isLoggedInIntranet && (
              <>
                <button onClick={() => setView('intranet_recursos')} disabled={loading}>Obter Recursos Intranet</button>
              </>
            )}
            
          </div>
          {renderContent()}
        </>
      )}
    </div>
  );
};

export default App;