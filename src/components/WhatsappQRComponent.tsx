'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';

interface QRResponse {
  qr: string;
  source?: string;
  connectionStatus?: string;
  message?: string;
}

export default function WhatsappQRComponent() {
  const [qrCode, setQRCode] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('disconnected');

  // URL de backend fija
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URLS || 'https://chatbot-funcional.vercel.app';

  const fetchQRCode = async (force: boolean = false) => {
    try {
      setLoading(true);
      console.log(`🌐 Probando URL: ${backendUrl}`);
      
      const url = `${backendUrl}/api/whatsapp/qr${force ? '?force=true' : ''}`;
      console.log(`🔗 URL completa: ${url}`);

      // Configurar axios para manejar CORS
      const response = await axios.get<QRResponse>(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        withCredentials: false,
        timeout: 15000 // 15 segundos
      });

      console.log('📦 Respuesta del backend:', response.data);

      if (response.data.qr) {
        console.log('✅ QR recibido con éxito');
        setQRCode(response.data.qr);
        setConnectionStatus(response.data.connectionStatus || 'connecting');
        setError(null);
      } else {
        console.warn('⚠️ Respuesta sin QR');
        setError(response.data.message || 'No se pudo generar el código QR');
      }
    } catch (err: any) {
      console.error('❌ Error al obtener QR:', err);
      
      // Manejar específicamente errores de CORS
      if (err.response) {
        console.error('🚨 Datos de error del servidor:', err.response.data);
        console.error('🔢 Código de estado:', err.response.status);
        
        if (err.response.status === 403 || err.response.status === 401) {
          setError('Acceso denegado. Verifica la configuración de CORS.');
        } else {
          setError(err.response.data.message || `Error ${err.response.status}`);
        }
      } else if (err.request) {
        console.error('🌐 Sin respuesta del servidor:', err.request);
        
        // Distinguir entre error de red y CORS
        if (err.message === 'Network Error') {
          setError('Error de red. Verifica tu conexión y configuración de CORS.');
        } else {
          setError('Sin respuesta del servidor');
        }
      } else {
        console.error('⚙️ Error de configuración:', err.message);
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🚀 Iniciando búsqueda de QR');
    fetchQRCode();
  }, []);

  const handleForceRegenerate = () => {
    fetchQRCode(true);
  };

  return (
    <div className="whatsapp-qr-container text-center">
      {loading && (
        <div className="animate-pulse">
          <p className="text-gray-600">Generando código QR...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <p>{error}</p>
          <button 
            onClick={handleForceRegenerate} 
            className="mt-2 bg-whatsapp-green text-white px-4 py-2 rounded hover:bg-whatsapp-dark transition"
          >
            Reintentar
          </button>
        </div>
      )}
      
      {qrCode && (
        <div className="qr-section">
          <div className="flex justify-center mb-4">
            <Image 
              src={qrCode} 
              alt="WhatsApp QR Code" 
              width={300} 
              height={300} 
              className="rounded-lg shadow-md"
            />
          </div>
          <p className="text-gray-700 mb-2">
            Estado de conexión: 
            <span className={`ml-2 font-bold ${
              connectionStatus === 'connected' ? 'text-green-600' : 
              connectionStatus === 'connecting' ? 'text-yellow-600' : 
              'text-red-600'
            }`}>
              {connectionStatus}
            </span>
          </p>
          <button 
            onClick={handleForceRegenerate} 
            className="bg-whatsapp-green text-white px-4 py-2 rounded hover:bg-whatsapp-dark transition"
          >
            Regenerar QR
          </button>
        </div>
      )}
    </div>
  );
}
