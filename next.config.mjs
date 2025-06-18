/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Remove deprecated options that cause warnings
  poweredByHeader: false,
  compress: true,
  // Replit-specific configuration
  // Disable static optimization for dynamic Replit URLs
  trailingSlash: false,
  // Reduce rebuild frequency in development
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  // Configure Monaco editor and reduce console warnings
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Monaco editor configuration
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      }
    }
    return config
  },
}

export default nextConfig