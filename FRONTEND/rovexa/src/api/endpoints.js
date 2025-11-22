// src/api/endpoints.js
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

// --- function implementations ---
export async function healthCheck() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function login(credentials) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function getPortfolio() {
  const res = await fetch(`${API_BASE}/portfolio`);
  if (!res.ok) throw new Error('Failed to fetch portfolio');
  return res.json();
}

export async function getPortfolioItem(id) {
  const res = await fetch(`${API_BASE}/portfolio/${id}`);
  if (!res.ok) throw new Error('Failed to fetch portfolio item');
  return res.json();
}

export async function createPortfolioItem(payload) {
  const isForm = payload instanceof FormData;
  const res = await fetch(`${API_BASE}/portfolio`, {
    method: 'POST',
    body: isForm ? payload : JSON.stringify(payload),
    headers: isForm ? undefined : { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to create portfolio item');
  return res.json();
}

export async function updatePortfolioItem(id, payload) {
  const isForm = payload instanceof FormData;
  const res = await fetch(`${API_BASE}/portfolio/${id}`, {
    method: 'PUT',
    body: isForm ? payload : JSON.stringify(payload),
    headers: isForm ? undefined : { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to update portfolio item');
  return res.json();
}

export async function deletePortfolioItem(id) {
  const res = await fetch(`${API_BASE}/portfolio/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete portfolio item');
  return res.json();
}

export async function uploadImage(formData) {
  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Image upload failed');
  return res.json();
}

export async function submitContact(contact) {
  const res = await fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contact),
  });
  if (!res.ok) throw new Error('Contact submit failed');
  return res.json();
}

// --- backward-compatible aliases (single export set) ---
export const createPortfolio = createPortfolioItem;
export const updatePortfolio = updatePortfolioItem;
export const deletePortfolio = deletePortfolioItem;
