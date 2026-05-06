//enlaceCloud.ts
import type { Provincia, Distrito } from '../types';
export interface RespuestaBunker {
  success: boolean;
  nombres?: string;
  apellidos?: string;
  error?: string;
  datos?: Provincia[] | Distrito[] | any;
}

const API_URL = import.meta.env.VITE_API_BASE_URL;
const AUTH_KEY = import.meta.env.VITE_API_AUTH_KEY;

export const llamarAlBunker = async (
  endpoint: string, metodo: string, cuerpo?: any
): Promise<RespuestaBunker> => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
        'X-Custom-Auth-Key': AUTH_KEY
      },
      body: cuerpo ? JSON.stringify(cuerpo) : null
    });
    return await response.json();
  } catch {
    return { success: false, error: "El búnker no responde" };
  }
};
