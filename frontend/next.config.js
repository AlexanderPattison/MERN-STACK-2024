/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['localhost'], // Add any other domains you're loading images from
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://localhost:5000/api/:path*', // Adjust this to your backend URL
            },
        ];
    },
    webpack: (config) => {
        config.resolve.fallback = { fs: false, path: false };
        return config;
    },
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    },
    serverRuntimeConfig: {
        // Will only be available on the server side
        mySecret: 'secret',
        secondSecret: process.env.SECOND_SECRET, // Pass through env variables
    },
    publicRuntimeConfig: {
        // Will be available on both server and client
        staticFolder: '/static',
    },
};

module.exports = nextConfig;