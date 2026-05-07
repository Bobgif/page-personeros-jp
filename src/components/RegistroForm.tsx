import { useState } from "react";
import { llamarAlBunker } from "./modules/enlaceCloud";
import { UbigeoSelects } from "./ubigeoSelects"; 
import type { DatosPersonero } from './types';

// Definimos el tipo de alerta para que TS no se queje
type TipoAlerta = "info" | "error" | "success";

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
  const [tipoMensaje, setTipoMensaje] = useState<TipoAlerta>("info");
  const [verificado, setVerificado] = useState(false);

  const verificarDni = async () => {
    if (datos.dni.length < 8) {
      setTipoMensaje("error");
      setMensaje("¡Oye! El DNI debe tener 8 números.");
      return;
    }

    setTipoMensaje("info");
    setMensaje("Consultando búnker...");
    
    const res = await llamarAlBunker(`/api/consultar-dni?dni=${datos.dni}`, "GET");
    
    if (res.nombres) {
      setDatos({ ...datos, nombres: res.nombres, apellidos: res.apellidos || "" });
      setVerificado(true);
      setTipoMensaje("success");
      setMensaje("✅ Identidad confirmada.");
    } else {
      setVerificado(false);
      setTipoMensaje("error");
      setMensaje("🚫 Fujibot detectado. Vuelve mañana.");
    }
  };

  const enviarRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Transformamos a mayúsculas para que la DB en Pucallpa esté impecable
    const finalData = {
      ...datos,
      nombres: datos.nombres.toUpperCase(),
      apellidos: datos.apellidos.toUpperCase(),
      provincia: datos.provincia.toUpperCase(),
      distrito: datos.distrito.toUpperCase(),
      centro: datos.centro.toUpperCase(),
      invitado: (datos.invitado || "").toUpperCase()
    };

    const res = await llamarAlBunker("/api/registrar", "POST", finalData);
    if (res.success) {
      setTipoMensaje("success");
      setMensaje("¡Registro exitoso! Gracias por sumarte.");
      setVerificado(false);
      setDatos({ dni: "", nombres: "", apellidos: "", provincia: "", distrito: "", centro: "", telefono: "", correo: "", invitado: "" });
    } else {
      setTipoMensaje("error");
      setMensaje(res.error || "Error al registrar.");
    }
  };

  return (
    
    <form onSubmit={enviarRegistro} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-100">
      <h1 className="text-2xl font-black mb-6 text-slate-800 text-center uppercase tracking-tighter">
        Personeros Ucayali 2026
      </h1>
 {!verificado && !mensaje && (
        <p className="text-[10px] text-center text-slate-400 mt-6 font-bold uppercase tracking-widest animate-pulse">
          🔒 Valida tu DNI para habilitar el resto
        </p>
      )} 
      {/* Sección DNI */}
      <div className="flex flex-row items-center gap-2 mb-4 w-full">
        <input
          type="text"
          inputMode="numeric"
          placeholder="DNI"
          maxLength={8}
          value={datos.dni}
          onChange={(e) => setDatos({ ...datos, dni: e.target.value.replace(/\D/g, "") })}
          className="flex-1 w-0 border-2 border-slate-200 rounded-xl p-3 focus:border-blue-500 outline-none transition-all font-bold text-lg min-w-0"
        />
        <button 
          type="button" 
          onClick={verificarDni} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-bold transition-transform active:scale-95 shadow-lg shadow-blue-200 whitespace-nowrap text-sm sm:text-base"
  
        >
          Validar
        </button>
      </div>

      {/* Alerta Animada */}
      {mensaje && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-bold border-2 transition-all duration-300 ${
          tipoMensaje === "error" ? "bg-red-50 text-red-600 border-red-200 animate-shake" : 
          tipoMensaje === "success" ? "bg-green-50 text-green-600 border-green-200 animate-bounce-short" : 
          "bg-blue-50 text-blue-600 border-blue-200"
        }`}>
          {mensaje}
        </div>
      )}

      {/* Contenedor bloqueado hasta verificar DNI */}
      <div className={`space-y-4 transition-all duration-500 ${!verificado ? "opacity-30 grayscale pointer-events-none" : "opacity-100"}`}>
        <div className="space-y-2">
          <input type="text" placeholder="Nombres" value={datos.nombres} readOnly className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-slate-500 font-semibold" />
          <input type="text" placeholder="Apellidos" value={datos.apellidos} readOnly className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-slate-500 font-semibold" />
        </div>

        <UbigeoSelects 
          verificado={verificado} 
          datos={datos} 
          setDatos={setDatos} 
        />

        <input 
          type="text" 
          required
          inputMode="numeric" 
          placeholder="Celular" 
          maxLength={9} 
          value={datos.telefono} 
          onChange={(e) => setDatos({ ...datos, telefono: e.target.value.replace(/\D/g, "") })} 
          className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none font-medium" 
        />
        
        <input 
          type="email"
          required 
          placeholder="Correo Electrónico" 
          value={datos.correo} 
          onChange={(e) => setDatos({ ...datos, correo: e.target.value })} 
          className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none font-medium" 
        />
        
        <input 
          type="text" 
          placeholder="¿Alguien te invitó?" 
          value={datos.invitado} 
          onChange={(e) => setDatos({ ...datos, invitado: e.target.value })} 
          className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none font-medium" 
        />

        <button 
          type="submit" 
          disabled={!verificado} 
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-white font-black py-4 rounded-xl shadow-xl shadow-emerald-100 transition-all active:scale-95 uppercase tracking-widest mt-4"
        >
          ¡Registrarme Ahora!
        </button>
      </div>

     
    </form>
  );
};

export default RegistroForm;