/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  agentRules: false,
  images: {
    remotePatterns: [{ protocol:'https', hostname:'www.g3e-ewag.ca' }],
  },
}
module.exports = nextConfig
