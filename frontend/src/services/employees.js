const API_BASE = 'http://localhost:5000/api/employees';

export async function listEmployees() {
  const res = await fetch(`${API_BASE}`);
  const data = await res.json().catch(() => []);
  return Array.isArray(data) ? data : [];
}

export async function createEmployee(payload) {
  const res = await fetch(`${API_BASE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Failed to create employee');
  return data;
}