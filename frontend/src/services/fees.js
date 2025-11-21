const API_BASE = 'http://localhost:5000/api/fees';

export async function listReceipts(studentId, studentRegNo) {
  const params = new URLSearchParams();
  if (studentId) params.set('studentId', studentId);
  if (studentRegNo) params.set('studentRegNo', studentRegNo);
  const res = await fetch(`${API_BASE}/receipts?${params.toString()}`);
  const data = await res.json().catch(() => []);
  return Array.isArray(data) ? data : [];
}

export async function createReceipt(payload) {
  const res = await fetch(`${API_BASE}/receipts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Failed to create receipt');
  return data;
}