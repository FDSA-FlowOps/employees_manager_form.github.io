/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Configuración para GitHub Pages
  // El repositorio es: employees_manager_form.github.io
  // Si el repositorio está en la raíz del dominio (employees_manager_form.github.io), basePath debe estar vacío
  // Si está en un subdirectorio (ej: FDSA-FlowOps.github.io/employees_manager_form), usa: basePath: '/employees_manager_form'
  basePath: process.env.NODE_ENV === 'production' ? '' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  
  // Generar build estática para GitHub Pages
  output: 'export',
  
  // GitHub Pages no soporta optimización de imágenes de Next.js
  images: {
    unoptimized: true,
  },
  
  // Usar trailing slash para mejor compatibilidad con GitHub Pages
  trailingSlash: true,
  
  // Deshabilitar funciones que no funcionan en builds estáticas
  // Nota: Las API routes, middleware y SSR no funcionarán en GitHub Pages
};

module.exports = nextConfig;

