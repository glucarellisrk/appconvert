import React, { useState } from 'react';

const ConvertidorMoneda = () => {
    const [cantidad, setCantidad] = useState(0);
    const [cantidadConvertida, setCantidadConvertida] = useState(0);
    const [monedaOrigen, setMonedaOrigen] = useState('BRL'); // 'BRL' o 'USD'
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    const manejarCambioCantidad = (e) => {
        setCantidad(e.target.value);
    };

    const manejarCambioMonedaOrigen = (e) => {
        setMonedaOrigen(e.target.value);
    };

    const convertirMoneda = async () => {
        setCargando(true);
        setError(null);
        try {
            // Llama a una API de tasas de cambio
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/ARS');
            if (!response.ok) throw new Error('Error al obtener las tasas de cambio');
            const data = await response.json();

            // Obtiene la tasa según la moneda seleccionada
            const tasa = data.rates[monedaOrigen]; // Tasa de ARS -> BRL o USD
            if (!tasa) throw new Error('Moneda no soportada');

            // Convierte de BRL/USD a ARS
            setCantidadConvertida((cantidad / tasa).toFixed(2)); // Divide porque el API da tasas inversas
        } catch (error) {
            setError(error.message);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="app">
            <div className="currency-converter">
                <h2>Convertidor de Moneda</h2>
                <label>
                    Cantidad:
                    <input
                        type="number"
                        value={cantidad}
                        onChange={manejarCambioCantidad}
                        placeholder="Ingrese la cantidad"
                    />
                </label>
                <label>
                    Moneda Origen:
                    <select value={monedaOrigen} onChange={manejarCambioMonedaOrigen}>
                        <option value="BRL">Reales (BRL)</option>
                        <option value="USD">Dólares (USD)</option>
                    </select>
                </label>
                <button onClick={convertirMoneda} disabled={cargando}>
                    {cargando ? 'Convirtiendo...' : 'Convertir'}
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <h3>Cantidad Convertida: {cantidadConvertida} ARS</h3>
            </div>
        </div>
    );
};

export default ConvertidorMoneda;
