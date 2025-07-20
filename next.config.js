/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

const config = {
  reactStrictMode: true,
  outputFileTracingIncludes: {
    "/**/*": ["./prisma/generated/prisma/**/*"],
  },
};

export default config;
