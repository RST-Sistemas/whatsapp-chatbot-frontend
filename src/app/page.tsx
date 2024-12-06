'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import WhatsappQRComponent from '../components/WhatsappQRComponent';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4 text-whatsapp-dark">
          WhatsApp Chatbot
        </h1>
        <WhatsappQRComponent />
      </div>
    </main>
  );
}
