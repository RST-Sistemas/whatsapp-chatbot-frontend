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

  const fetchQRCode = async (force: boolean = false) => {
    try {
      setLoading(true);
      const response = await axios.get<QRResponse>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/whatsapp/qr${force ? '?force=true' : ''}`, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.data.qr) {
        setQRCode(response.data.qr);
        setConnectionStatus(response.data.connectionStatus || 'connecting');
        setError(null);
      } else {
        setError(response.data.message || 'No se pudo generar el código QR');
      }
    } catch (err: any) {
      console.error('Error al obtener QR:', err);
      setError(err.response?.data?.message || 'Error al conectar con WhatsApp');
      setQRCode(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
