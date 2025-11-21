const API_BASE = 'http://localhost:5000/api/classes';

export async function listClasses() {
  const res = await fetch(`${API_BASE}`);
  return res.json();
}