/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";
import path from 'path';

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  // i18n: {
  //   locales: ["en"],
  //   defaultLocale: "en",
  // },
  images: {
    remotePatterns: [
      {
        hostname: "source.unsplash.com",
      }, {
        hostname: "prd.place",
      },
    ],
  },
  transpilePackages: ["geist"],

  // Add this webpack configuration for Prisma
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Copy Prisma engine files to the output directory
      config.externals = [...config.externals, 'prisma/generated/client'];
    }
    return config;
  },
};

export default config;
