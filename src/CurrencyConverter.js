import React, { useState, useEffect } from 'react';
import './styles.scss';

const ConvertidorMoneda = () => {
    const [cantidad, setCantidad] = useState('');
    const [cantidadConvertida, setCantidadConvertida] = useState(0);
    const [monedaOrigen, setMonedaOrigen] = useState('BRL');
    const [error, setError] = useState(null);
    const [tasaBlue, setTasaBlue] = useState(null);
    const [tasaBRLUSD, setTasaBRLUSD] = useState(null);
    const [tasaUSDGS] = useState(7500);
    const [cargando, setCargando] = useState(false);
    const [mostrarPopup, setMostrarPopup] = useState(false);

    useEffect(() => {
        const cargarTasas = async () => {
            try {
                const responseBlue = await fetch(`https://api.bluelytics.com.ar/v2/latest`);
                if (!responseBlue.ok) throw new Error('Error al obtener la tasa del dólar blue');
                const dataBlue = await responseBlue.json();
                setTasaBlue(dataBlue.blue.value_sell);

                const responseBRL = await fetch(`https://api.exchangerate-api.com/v4/latest/BRL`);
                if (!responseBRL.ok) throw new Error('Error al obtener la tasa de cambio BRL a USD');
                const dataBRL = await responseBRL.json();
                setTasaBRLUSD(dataBRL.rates['USD']);
            } catch (error) {
                setError(error.message);
            }
        };

        cargarTasas();
    }, []);

    const manejarCambioCantidad = (e) => {
        const valor = e.target.value;
        setCantidad(valor === '' ? '' : parseFloat(valor) || '');
    };

    const manejarCambioMonedaOrigen = (e) => {
        setMonedaOrigen(e.target.value);
    };

    const convertirMoneda = () => {
        if (!cantidad || isNaN(cantidad)) {
            setError('Por favor, ingrese un monto válido');
            return;
        }

        if (!tasaBlue || (monedaOrigen === 'BRL' && !tasaBRLUSD) || (monedaOrigen === 'GS' && !tasaUSDGS)) {
            setError('No se pudieron obtener las tasas de cambio');
            return;
        }

        setError(null);
        setCargando(true);

        setTimeout(() => {
            let cantidadEnUSD = parseFloat(cantidad);

            if (monedaOrigen === 'BRL') {
                cantidadEnUSD = cantidadEnUSD * tasaBRLUSD;
            } else if (monedaOrigen === 'GS') {
                cantidadEnUSD = cantidadEnUSD / tasaUSDGS;
            }

            const cantidadEnARS = cantidadEnUSD * tasaBlue;
            setCantidadConvertida(cantidadEnARS.toFixed(2));
            setCargando(false);
            setMostrarPopup(true);
        }, 1000);
    };

    const obtenerBandera = (moneda) => {
        switch (moneda) {
            case 'USD':
                return 'https://wise.com/web-art/assets/flags/usd.svg';
            case 'BRL':
                return 'https://wise.com/web-art/assets/flags/brl.svg';
            case 'GS':
                return 'https://wise.com/web-art/assets/flags/py.svg';
            default:
                return '';
        }
    };

    return (
        <div className="app">
            <div className="currency-converter">
                <h2>Convertidor de Moneda</h2>
                <label>
                    Importe:
                    <div className="input-group">
                        <input
                            type="text"
                            value={cantidad}
                            onChange={manejarCambioCantidad}
                            placeholder="Ingrese el importe"
                            className="form-control"
                            inputMode="decimal"
                            style={{
                                backgroundImage: `url(${obtenerBandera(monedaOrigen)})`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 10px center',
                                backgroundSize: '24px 24px',
                            }}
                        />
                    </div>
                </label>
                <label>
                    Moneda Origen:
                    <select value={monedaOrigen} onChange={manejarCambioMonedaOrigen}>
                        <option value="BRL">Reales (BRL)</option>
                        <option value="USD">Dólares (USD)</option>
                        <option value="GS">Guaraníes (GS)</option>
                    </select>
                </label>
                <button onClick={convertirMoneda} className={`convert-btn ${cargando ? 'loading' : ''}`}>
  {cargando ? <div className="spinner"></div> : 'Convertir'}
</button>

                {error && <p style={{ color: 'red' }}>{error}</p>}
                <h3>Cantidad Convertida:</h3>
                <div className="result-box">
                    <span>{cantidadConvertida} ARS</span>
                </div>
                <h4>Tipo de cambio:</h4>
                <ul>
                    <li>USD a ARS (Blue): {tasaBlue ? `${tasaBlue} ARS` : 'Cargando...'}</li>
                    <li>BRL a USD: {tasaBRLUSD ? `${tasaBRLUSD} USD` : 'Cargando...'}</li>
                    <li>GS a USD: {tasaUSDGS ? `${tasaUSDGS} GS` : 'Cargando...'}</li>
                </ul>
            </div>

            {mostrarPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Resultado de la Conversión</h3>
                        <p>{cantidadConvertida} ARS</p>
                        <button onClick={() => setMostrarPopup(false)}>Cerrar</button>
                    </div>
                </div>
            )}

   
        </div>
    );
};

export default ConvertidorMoneda;
