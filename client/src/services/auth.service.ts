interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

const BASE_URL = "http://localhost:3000/auth";

export async function loginService(data: LoginData) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Erro ao logar");
  }

  localStorage.setItem("token", result.access_token);

  return result;
}

export async function register(data: RegisterData) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Erro ao cadastrar");
  }

  return result;
}

export async function forgotPassword(email: string) {
  // Chamada ao backend para recuperar senha
  // Exemplo:
  // await fetch(`${BASE_URL}/forgot`, ...)
  return true;
}
