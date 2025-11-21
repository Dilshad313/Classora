const API_BASE = 'http://localhost:5000/api/students';

export async function listStudentsByClass(classId) {
  const params = new URLSearchParams({ classId });
  const res = await fetch(`${API_BASE}?${params.toString()}`);
  const data = await res.json().catch(() => []);
  return Array.isArray(data) ? data : [];
}

export async function createStudent(payload) {
  const res = await fetch(`${API_BASE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Failed to create student');
  return data;
}