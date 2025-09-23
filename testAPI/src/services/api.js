const API_ENDPOINTS = {
  login: 'https://v2api.frotcom.com/v2/authorize',
  vehicles: 'https://v2api.frotcom.com/v2/vehicles',
  drivers: 'https://v2api.frotcom.com/v2/drivers',
  // Adicione outros endpoints aqui
};

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