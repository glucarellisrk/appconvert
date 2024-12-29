import React, { useState } from 'react';

const ConvertidorMoneda = () => {
    const [cantidad, setCantidad] = useState(0);
    const [cantidadConvertida, setCantidadConvertida] = useState(0);
    const [monedaOrigen, setMonedaOrigen] = useState('USD');
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
            let tasaUSD = 1;
            if (monedaOrigen === 'BRL') {
                const responseBRL = await fetch(`https://api.exchangerate-api.com/v4/latest/BRL`);
                if (!responseBRL.ok) throw new Error('Error al obtener la tasa de cambio BRL a USD');
                const dataBRL = await responseBRL.json();
                tasaUSD = dataBRL.rates['USD']; // Tasa de BRL a USD
            }

            const responseBlue = await fetch(`https://api.bluelytics.com.ar/v2/latest`);
            if (!responseBlue.ok) throw new Error('Error al obtener la tasa del dólar blue');
            const dataBlue = await responseBlue.json();
            const tasaBlue = dataBlue.blue.value_sell; // Tasa de venta del dólar blue

            if (!tasaUSD || !tasaBlue) throw new Error('Moneda no soportada');
            const cantidadEnUSD = cantidad * tasaUSD;
            setCantidadConvertida((cantidadEnUSD * tasaBlue).toFixed(2));
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
                        <option value="USD">Dólares (USD)</option>
                        <option value="BRL">Reales (BRL)</option>
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