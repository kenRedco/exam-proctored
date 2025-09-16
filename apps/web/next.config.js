/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
  },
  // App Router is default in Next 13/14; no need for experimental.appDir
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': __dirname,
      '@/components': `${__dirname}/components`,
      '@/lib': `${__dirname}/lib`,
      '@/types': `${__dirname}/types`,
    };
    return config;
  },
};

module.exports = nextConfig;
