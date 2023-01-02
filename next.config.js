/* eslint @typescript-eslint/no-var-requires: "off" */
const { resolve } = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias['~'] = resolve(__dirname, 'src')
    return config
  },
}

module.exports = nextConfig
