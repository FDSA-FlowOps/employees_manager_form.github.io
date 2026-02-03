/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Para sitio de organización (*.github.io) NO usar basePath
  basePath: '',
  assetPrefix: '',
  images: {
    unoptimized: true,
  },
  // Asegurar que Tailwind se compile correctamente
  trailingSlash: true,
}

module.exports = nextConfig