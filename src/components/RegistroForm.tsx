//registroForm.tsx
import { useState } from "react";
import { llamarAlBunker } from "./modules/enlaceCloud";
import type { DatosPersonero } from './types';

const RegistroForm = () => {
  const [datos, setDatos] = useState<DatosPersonero>({
    dni: "",
    nombres: "",
    apellidos: "",
    provincia: "",
    distrito: "",
    centro: "",
    telefono: "",
    correo: "",
    invitado: ""
  });

  const [mensaje, setMensaje] = useState("");
  const [verificado, setVerificado] = useState(false);

  // --- Lógica de verificación de DNI ---
  const verificarDni = async () => {
    setMensaje("Consultando búnker...");
    const res = await llamarAlBunker(`/api/consultar-dni?dni=${datos.dni}`, "GET");
    if (res.nombres) {
      setDatos({ ...datos, nombres: res.nombres, apellidos: res.apellidos || "" });
      setVerificado(true);
      setMensaje("Identidad confirmada.");
    } else {
      setMensaje(res.error || "Error al verificar DNI");
      setVerificado(false);
    }
  };

  // --- Lógica de envío final ---
  const enviarRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await llamarAlBunker("/api/registrar", "POST", datos);
    if (res.success) {
      setMensaje("¡Registro exitoso!");
      setVerificado(false);
      setDatos({
        dni: "",
        nombres: "",
        apellidos: "",
        provincia: "",
        distrito: "",
        centro: "",
        telefono: "",
        correo: "",
        invitado: ""
      });
    } else {
      setMensaje(res.error || "Error al registrar.");
    }
  };

  return (
    <form onSubmit={enviarRegistro} className="bg-white p-6 rounded shadow-md w-full max-w-md">
      <h1 className="text-xl font-bold mb-4">Registro de Personeros 2026</h1>

      <div className="flex mb-2">
        <input
          type="text"
          placeholder="DNI"
          maxLength={8}
          value={datos.dni}
          onChange={(e) => setDatos({ ...datos, dni: e.target.value })}
          className="border rounded p-2 flex-grow"
        />
        <button type="button" onClick={verificarDni} className="ml-2 bg-blue-600 text-white px-4 py-2 rounded">
          Verificar DNI
        </button>
      </div>

      <input type="text" placeholder="Nombres" value={datos.nombres} readOnly className="border rounded p-2 w-full mb-2" />
      <input type="text" placeholder="Apellidos" value={datos.apellidos} readOnly className="border rounded p-2 w-full mb-2" />

      <select value={datos.provincia} onChange={(e) => setDatos({ ...datos, provincia: e.target.value })} className="border rounded p-2 w-full mb-2">
        <option value="">Seleccione Provincia</option>
        <option value="CORONEL PORTILLO">CORONEL PORTILLO</option>
        <option value="PADRE ABAD">PADRE ABAD</option>
        <option value="ATALAYA">ATALAYA</option>
        <option value="PURUS">PURÚS</option>
      </select>

      <select value={datos.distrito} onChange={(e) => setDatos({ ...datos, distrito: e.target.value })} className="border rounded p-2 w-full mb-2" disabled={!datos.provincia}>
        <option value="">Seleccione Distrito</option>
      </select>

      <select value={datos.centro} onChange={(e) => setDatos({ ...datos, centro: e.target.value })} className="border rounded p-2 w-full mb-2" disabled={!datos.distrito}>
        <option value="">Seleccione Centro de Votación</option>
      </select>

      <input type="text" placeholder="Celular" value={datos.telefono} onChange={(e) => setDatos({ ...datos, telefono: e.target.value })} className="border rounded p-2 w-full mb-2" />
      <input type="email" placeholder="Correo Electrónico" value={datos.correo} onChange={(e) => setDatos({ ...datos, correo: e.target.value })} className="border rounded p-2 w-full mb-2" />
      <input type="text" placeholder="¿Alguien te invitó?" value={datos.invitado} onChange={(e) => setDatos({ ...datos, invitado: e.target.value })} className="border rounded p-2 w-full mb-2" />

      <button type="submit" disabled={!verificado} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full">
        Registrarse
      </button>

      {mensaje && <p className="mt-2 text-center text-sm text-red-600">{mensaje}</p>}
    </form>
  );
};

export default RegistroForm;
