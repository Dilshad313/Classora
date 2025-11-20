const API_BASE = 'http://localhost:5000/api/admin/settings';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(res) {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = data?.message || 'Request failed';
    throw new Error(message);
  }
  return data;
}

// Institute Profile
export async function getInstituteProfile() {
  const res = await fetch(`${API_BASE}/institute-profile`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  return handleResponse(res);
}

export async function updateInstituteProfile(payload) {
  const res = await fetch(`${API_BASE}/institute-profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
}

// Fees Particulars
export async function getFeesParticulars() {
  const res = await fetch(`${API_BASE}/fees-particulars`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  return handleResponse(res);
}

export async function updateFeesParticulars(data) {
  const res = await fetch(`${API_BASE}/fees-particulars`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

// Fee Structure
export async function getFeeStructure() {
  const res = await fetch(`${API_BASE}/fee-structure`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  return handleResponse(res);
}

export async function updateFeeStructure(items) {
  const res = await fetch(`${API_BASE}/fee-structure`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ items })
  });
  return handleResponse(res);
}

// Account Invoices (bank settings)
export async function getAccountInvoices() {
  const res = await fetch(`${API_BASE}/account-invoices`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  return handleResponse(res);
}

export async function updateAccountInvoices(banks) {
  const res = await fetch(`${API_BASE}/account-invoices`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ banks })
  });
  return handleResponse(res);
}

// Rules & Regulations
export async function getRules() {
  const res = await fetch(`${API_BASE}/rules`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  return handleResponse(res);
}

export async function updateRules(rules) {
  const res = await fetch(`${API_BASE}/rules`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ rules })
  });
  return handleResponse(res);
}

// Marks Grading
export async function getMarksGrading() {
  const res = await fetch(`${API_BASE}/marks-grading`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  return handleResponse(res);
}

export async function updateMarksGrading(grades) {
  const res = await fetch(`${API_BASE}/marks-grading`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ grades })
  });
  return handleResponse(res);
}

// Account Settings
export async function getAccountSettings() {
  const res = await fetch(`${API_BASE}/account-settings`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  return handleResponse(res);
}

export async function updateAccountSettings(payload) {
  const res = await fetch(`${API_BASE}/account-settings`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
}
