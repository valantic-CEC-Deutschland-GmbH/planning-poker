/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false, //Prevent multi rendering enable for debugging
    webpack: (config) => {
        config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");
        return config;
    }
};

export default nextConfig;
