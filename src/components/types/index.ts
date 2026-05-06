//types
export interface Provincia {
  id: string;
  nombre: string;
}

export interface Distrito {
  id: string;
  nombre: string;
}

export interface DatosPersonero {
  dni: string;
  nombres: string;
  apellidos: string;
  provincia: string;
  distrito: string;
  centro: string;
  telefono: string;
  correo: string;
  invitado: string;
}
