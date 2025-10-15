const API_ENDPOINTS = {
  login: 'https://v2api.frotcom.com/v2/authorize',
  vehicles: 'https://v2api.frotcom.com/v2/vehicles',
  drivers: 'https://v2api.frotcom.com/v2/drivers',
  // Adicione outros endpoints aqui
  loginIntranet: 'https://intranetapi.frotcom.com/v2/authorize',
  intranetBase: 'https://intranetapi.frotcom.com/v2',
};


// =========================================================
// Lógica para API CLIENTES (V2)
// =========================================================
export const login = async (username, password) => {
  const response = await fetch(API_ENDPOINTS.login, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider: 'frotcom', username, password }),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Login failed.');
  }
  return result.token;
};

export const fetchData = async (endpointType) => {
  const token = localStorage.getItem('frotcom_api_key');
  if (!token) {
    throw new Error('Not authenticated.');
  }

  const url = `${API_ENDPOINTS[endpointType]}?api_key=${token}`;
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return await response.json();
};

// =========================================================
// Lógica para API INTRANET
// =========================================================

export const loginIntranet = async (username, password) => {
  // **Atenção:** Assumimos que o corpo de autenticação é o mesmo do V2.
  const response = await fetch(API_ENDPOINTS.loginIntranet, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Login API Intranet falhou.');
  }
  return result.token;
};

export const fetchDataIntranet = async (resourcePath) => {
    const token = localStorage.getItem('token_intranet');
    if (!token) {
        throw new Error('Não autenticado na API Intranet.');
    }

    // O Swagger indica que este é o path base. O 'resourcePath' deve ser o endpoint exato.
    const url = `${API_ENDPOINTS.intranetBase}/${resourcePath}?api_key=${token}`; 
    
    const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
        throw new Error(`Erro na API Intranet: ${response.statusText}`);
    }
    return await response.json();
};