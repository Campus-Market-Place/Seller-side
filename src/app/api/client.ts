const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL;
//const TOKEN = (import.meta as any).env.VITE_USER_TOKEN; // read token from .env
//const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzYmQwMTJmNi03M2I0LTRkZmEtOGMzMS00MzI0OGRiNzJmNDQiLCJyb2xlIjoiVVNFUiIsInVzZXJuYW1lIjoibWFtYV9taWEiLCJpYXQiOjE3NzEzMDc1OTksImV4cCI6MTc3MTkxMjM5OX0.VE69smayVwaqt9ecTmMI2EjFM3QqaPh9X1huRXtzHgc"; // dev only
//const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxYzA1MGVmMS00MTFiLTQ2OTAtYjU1Mi0zNmJmN2UyZjA3NDUiLCJyb2xlIjoiU0VMTEVSIiwidXNlcm5hbWUiOiJxYW50YTEwIiwiaWF0IjoxNzcwOTk5NTQ1LCJleHAiOjE3NzE2MDQzNDV9.ZSVdL-qqCM-r6ANaeraWzxhAPhMDObiTlvweVGodEjw"
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzYmQwMTJmNi03M2I0LTRkZmEtOGMzMS00MzI0OGRiNzJmNDQiLCJyb2xlIjoiU0VMTEVSIiwidXNlcm5hbWUiOiJtYW1hX21pYSIsImlhdCI6MTc3MTc3MTI4NywiZXhwIjoxNzcyMzc2MDg3fQ.CR5Xh1S81kKdtI3A4-2n4nGUMMljpKkhqtt6xYcCRNs"


export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token") || TOKEN; // use localStorage token if exists, otherwise .env token

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error("Request failed");
  }

  return response.json();
}
