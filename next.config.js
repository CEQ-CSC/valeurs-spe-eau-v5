/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol:'https', hostname:'www.g3e-ewag.ca' }],
  },
}
module.exports = nextConfig
