/// <reference types="vite/client" />

export const API_BASE_URL = import.meta.env.PROD 
  ? 'https://sic.daibul.com' 
  : 'http://127.0.0.1:8000';