import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const register = async (userData: {
  email: string;
  password: string;
  role: string;
  name: string;
}): Promise<any> => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};