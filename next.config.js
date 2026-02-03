/** @type {import('next').NextConfig} */
const isGHPages = process.env.GITHUB_PAGES === 'true' || process.env.NODE_ENV === 'production';

// Determinar el basePath basado en el repositorio
// Si el repositorio es employees_manager_form.github.io, basePath debe estar vacío
// Si está en un subdirectorio (ej: FDSA-FlowOps.github.io/employees_manager_form), usa: basePath: '/employees_manager_form'
const basePath = isGHPages ? '' : '';
const assetPrefix = isGHPages ? '' : '';

const nextConfig = {
  reactStrictMode: true,
  
  // Configuración para GitHub Pages
  basePath,
  assetPrefix,
  
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
  
  // Asegurar que los assets se generen con rutas correctas
  distDir: 'out',
  
  // Configuración de webpack para asegurar que los assets se generen correctamente
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Asegurar que los assets se resuelvan correctamente
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;

