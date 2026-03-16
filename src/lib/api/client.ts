import axios from 'axios';

const API_BASE_URL = 'https://665de6d7e88051d60408c32d.mockapi.io';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
