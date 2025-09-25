import axios from "axios";

const API_URL = "http://localhost:3000/api/auth";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export const login = async (data: LoginRequest): Promise<TokenResponse> => {
  const res = await axios.post(`${API_URL}/login`, data);
  return res.data;
};
