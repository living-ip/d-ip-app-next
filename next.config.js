/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@mdxeditor/editor', 'react-diff-view'],
  reactStrictMode: true,
  webpack: (config) => {
    // this will override the experiments
    config.experiments = {...config.experiments, topLevelAwait: true};
    // this will just update topLevelAwait property of config.experiments
    // config.experiments.topLevelAwait = true
    return config;
  },
  env: {
    REDIRECT_URL: process.env.REDIRECT_URL
  },
  images: {
    domains: [
      "pbs.twimg.com"
    ],
  }
}

module.exports = nextConfig
