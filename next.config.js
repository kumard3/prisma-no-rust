/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";
import path from 'path';
import fs from 'fs';

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

  // Enhanced webpack configuration for Prisma
  webpack: (config, { isServer, webpack }) => {
    if (isServer) {
      // Prevent server-side bundle from including node_modules packages unnecessarily
      config.externals = ['@prisma/client/runtime', ...config.externals];

      // Add a rule to handle Prisma engine binaries
      config.module.rules.push({
        test: /\.node$/,
        use: [{ loader: 'file-loader', options: { name: '[name].[ext]' } }],
      });

      // Copy Prisma engines to output directory
      const engineSourcePath = path.join(process.cwd(), 'generated/prisma/libquery_engine-rhel-openssl-3.0.x.so.node');
      if (fs.existsSync(engineSourcePath)) {
        console.log('Prisma engine file exists at:', engineSourcePath);
      } else {
        console.log('Prisma engine file NOT found at:', engineSourcePath);
      }
    }

    return config;
  },
};

export default config;
