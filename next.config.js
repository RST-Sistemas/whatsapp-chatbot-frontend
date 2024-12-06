/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['chatbot-funcional.vercel.app'], // Permitir imágenes desde el backend
  },
  env: {
    NEXT_PUBLIC_BACKEND_URLS: process.env.NEXT_PUBLIC_BACKEND_URLS || 'https://chatbot-funcional.vercel.app',
  },
  // Configuraciones adicionales si son necesarias
};

module.exports = nextConfig;
