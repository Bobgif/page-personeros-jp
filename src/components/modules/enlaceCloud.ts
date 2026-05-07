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
    // Limpiamos la URL para evitar errores de doble barra //
    const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    const response = await fetch(`${baseUrl}${path}`, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
        'X-Custom-Auth-Key': AUTH_KEY
      },
      body: cuerpo ? JSON.stringify(cuerpo) : null
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          error: `Error del servidor: ${response.status} - ${errorData.error || 'Sin detalles'}` 
        };
    }

    return await response.json();
  } catch (err) {
    // Ahora sí sabrás si es un error de CORS, de red o de URL
    console.error("Error en la conexión:", err);
    return { success: false, error: "Error de conexión (CORS o Red)" };
  }
};


