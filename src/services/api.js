const API_URL = import.meta.env.VITE_API_URL;
console.log('API URL:', API_URL);

export async function apiRequest(endpoint, method = 'GET', body = null, token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = { method, headers };

  if (body) config.body = JSON.stringify(body);

  try {
    console.log(`Making API request: ${method} ${API_URL}${endpoint}`, { body, token });
    const response = await fetch(`${API_URL}${endpoint}`, config);

    let data = null;

    console.log('Response status:', response.status);
    if (response.status !== 204) {
      console.log('Response:', response);
      const text = await response.text();
      data = text ? JSON.parse(text) : {};
    }

    if (!response.ok) {
      throw new Error(`API request error: ${data.message || 'Unknown error'}`);
    }

    return data;
  } catch (error) {
    console.error('❌ API request failed:', error.message);
    throw error;
  }
}