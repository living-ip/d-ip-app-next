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
    LIP_API_BASE: process.env.LIP_API_BASE,
    LIP_AI_API_BASE: process.env.LIP_AI_API_BASE,
    REDIRECT_URL: process.env.REDIRECT_URL,
    GCP_PROJECT_ID: process.env.GCP_PROJECT_ID,
    GCP_SERVICE_ACCOUNT_EMAIL: process.env.GCP_SERVICE_ACCOUNT_EMAIL,
    GCP_PRIVATE_KEY: process.env.GCP_PRIVATE_KEY,
    STYTCH_PROJECT_ID: process.env.STYTCH_PROJECT_ID,
    STYTCH_SECRET: process.env.STYTCH_SECRET,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    DYNAMIC_ENV: process.env.DYNAMIC_ENV,
  },
  images: {
    domains: [
      "pbs.twimg.com",
      "storage.googleapis.com",
    ],
  }
}

module.exports = nextConfig
