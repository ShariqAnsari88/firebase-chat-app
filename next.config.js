/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ["firebasestorage.googleapis.com"],
    },
};

module.exports = nextConfig;
