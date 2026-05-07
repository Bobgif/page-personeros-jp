import { useState, useEffect } from 'react';
import { llamarAlBunker } from './modules/enlaceCloud';

interface UbigeoProps {
  verificado: boolean;
  datos: any;     // Usamos any para evitar conflictos de tipos con el padre
  setDatos: any;
}

export const UbigeoSelects = ({ verificado, datos, setDatos }: UbigeoProps) => {
  const [distritos, setDistritos] = useState<string[]>([]);
  const [centros, setCentros] = useState<string[]>([]);

  // Función para cargar datos de la DB
  const cargarUbigeo = async (params: { provincia?: string; distrito?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    const res = await llamarAlBunker(`/api/locales?${query}`, 'GET');
    return res.success ? res.datos : [];
  };

  // Efecto cuando cambia la provincia
  useEffect(() => {
    if (datos.provincia && verificado) {
      cargarUbigeo({ provincia: datos.provincia }).then(data => 
        setDistritos(data.map((d: any) => d.distrito))
      );
      setDatos((prev: any) => ({ ...prev, distrito: '', centro: '' })); 
    } else {
      setDistritos([]);
    }
  }, [datos.provincia, verificado]);

  // Efecto cuando cambia el distrito
  useEffect(() => {
    if (datos.distrito && verificado) {
      cargarUbigeo({ provincia: datos.provincia, distrito: datos.distrito }).then(data => 
        setCentros(data.map((c: any) => c.centro))
      );
      setDatos((prev: any) => ({ ...prev, centro: '' }));
    } else {
      setCentros([]);
    }
  }, [datos.distrito, verificado]);

  return (
    <>
      <select 
        disabled={!verificado} 
        value={datos.provincia}
        onChange={(e) => setDatos({...datos, provincia: e.target.value})}
        className="border rounded p-2 w-full mb-2 uppercase disabled:bg-gray-100"
      >
        <option value="">Seleccione Provincia</option>
        <option value="CORONEL PORTILLOs">CORONEL PORTILLO</option>
        <option value="PADRE ABAD">PADRE ABAD</option>
        <option value="ATALAYA">ATALAYA</option>
        <option value="PURUS">PURÚS</option>
      </select>

      <select 
        disabled={!datos.provincia || !verificado} 
        value={datos.distrito}
        onChange={(e) => setDatos({...datos, distrito: e.target.value})}
        className="border rounded p-2 w-full mb-2 uppercase disabled:bg-gray-100"
      >
        <option value="">Seleccione Distrito</option>
        {distritos.map(d => <option key={d} value={d}>{d}</option>)}
      </select>

      <select 
        disabled={!datos.distrito || !verificado} 
        value={datos.centro}
        onChange={(e) => setDatos({...datos, centro: e.target.value})}
        className="border rounded p-2 w-full mb-2 uppercase disabled:bg-gray-100"
      >
        <option value="">Seleccione Centro de Votación</option>
        {centros.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
    </>
  );
};