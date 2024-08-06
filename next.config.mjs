/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        //TODO still get error on middleware: Module build failed: UnhandledSchemeError: Reading from "node:crypto" is not handled by plugins (Unhandled scheme).
        config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");
        return config;
    }
};

export default nextConfig;
