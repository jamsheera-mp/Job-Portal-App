import axios from 'axios';
import { type User } from '../../domain/models/user';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchUserProfile = async (id: string): Promise<User> => {
  const response = await axios.get(`${API_URL}/users/${id}`);
  return response.data;
};

export const updateUserProfile = async (id: string, userData: Partial<User>): Promise<User> => {
  const response = await axios.patch(`${API_URL}/users/${id}`, userData);
  return response.data;
};