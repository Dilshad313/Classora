const API_BASE = 'http://localhost:5000/api/accounts';

export async function listStatements({ start, end, search } = {}) {
  const params = new URLSearchParams();
  if (start) params.set('start', start);
  if (end) params.set('end', end);
  if (search) params.set('search', search);
  const res = await fetch(`${API_BASE}/statements?${params.toString()}`);
  const data = await res.json().catch(() => []);
  return Array.isArray(data) ? data : [];
}

export async function createStatement(payload) {
  const res = await fetch(`${API_BASE}/statements`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Failed to create statement');
  return data;
}

export async function deleteStatement(id) {
  const res = await fetch(`${API_BASE}/statements/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Failed to delete statement');
  return data;
}