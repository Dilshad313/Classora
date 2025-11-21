const API_BASE = 'http://localhost:5000/api/attendance';

export async function getStudentAttendance(date, classId) {
  const params = new URLSearchParams({ date, classId });
  const res = await fetch(`${API_BASE}/students?${params.toString()}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Failed to load student attendance');
  return data;
}

export async function setStudentAttendance({ date, classId, records }) {
  const res = await fetch(`${API_BASE}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date, classId, records })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Failed to save student attendance');
  return data;
}

export async function getEmployeeAttendance(date) {
  const params = new URLSearchParams({ date });
  const res = await fetch(`${API_BASE}/employees?${params.toString()}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Failed to load employee attendance');
  return data;
}

export async function setEmployeeAttendance({ date, records }) {
  const res = await fetch(`${API_BASE}/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date, records })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Failed to save employee attendance');
  return data;
}