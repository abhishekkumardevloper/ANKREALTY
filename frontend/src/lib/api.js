import axios from 'axios';

const FALLBACK_API_BASE = 'https://ankrealty.onrender.com/api';

export const API_BASE = process.env.REACT_APP_API_BASE || FALLBACK_API_BASE;
export const WHATSAPP_NUMBER = '919732300007';
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createPropertySearch = ({ city = '', property_type = '', category = '', max_price = '' } = {}) => {
  const params = new URLSearchParams();
  if (city) params.set('city', city);
  if (property_type) params.set('property_type', property_type);
  if (category) params.set('category', category);
  if (max_price) params.set('max_price', max_price);
  const query = params.toString();
  return query ? `/properties?${query}` : '/properties';
};
