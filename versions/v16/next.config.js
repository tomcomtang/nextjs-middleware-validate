/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 指定 Turbopack 的工作区根目录，消除多 lockfiles 警告
  turbopack: {
    root: __dirname,
  },
}

module.exports = nextConfig
