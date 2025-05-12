import "@mantine/core/styles.css";
import { GeistSans } from "geist/font/sans";
import type { AppType } from "next/app";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { api } from "@/utils/api";
import Script from "next/script";

import "@/styles/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { type Session } from "next-auth";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <MantineProvider>
        <ModalsProvider>
          <Script
            strategy="beforeInteractive"
            type="text/javascript"
            src="//script.crazyegg.com/pages/scripts/0129/2035.js"
          />
          <div className={GeistSans.className}>
            <Component {...pageProps} />
            <Toaster position="top-right" />
          </div>
        </ModalsProvider>
      </MantineProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
