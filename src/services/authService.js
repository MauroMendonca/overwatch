import { apiRequest } from "./api";

const TOKEN_KEY = 'jwt_token';
const USER_ID = 'user_id';

export async function login(email, password) {
    const data = await apiRequest('/auth/login', 'POST', { email, password });
    if (data.token) localStorage.setItem(TOKEN_KEY, data.token);

    const user = await fetchUser();
    if (user._id) localStorage.setItem(USER_ID, user._id);

    return data;
}

export async function register(userData) {
    return await apiRequest('/auth/register', 'POST', userData);
}

export async function fetchUser() {
    return await apiRequest('/auth/me', 'GET', null, getToken());
}

export function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID);
}

export function getToken() {   
    return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated() {
    return !!getToken();
}