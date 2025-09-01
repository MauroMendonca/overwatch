import { apiRequest } from "./api";
import { getToken } from "./authService";

const USER_ID = 'user_id';

export async function getTags(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return await apiRequest(`/tags?${query}`, "GET", null, getToken());
}

export async function createTag(tagData) {
    const payload = { ...(tagData || {}), userId: getUserId() };
    return await apiRequest("/tags", "POST", payload, getToken());
}

export async function updateTag(tagId, tagData) {
    const payload = { ...(tagData || {}), userId: getUserId() };
    return await apiRequest(`/tags/${tagId}`, "PUT", payload, getToken());
}

export async function deleteTag(tagId) {
    return await apiRequest(`/tags/${tagId}`, "DELETE", null, getToken());
}

export function getUserId() {
    return localStorage.getItem(USER_ID);
}