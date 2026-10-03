import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist } from "next/font/google";
import { Cursor } from "@/components/Cursor";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { Providers } from "@/components/Providers";
import { TransitionProvider } from "@/components/TransitionProvider";
import { isPlaceholder } from "@/lib/utils";
import { site } from "@/data/site";
import "./globals.css";

const body = Geist({ variable: "--font-body", subsets: ["latin"] });
const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const pageTitle = `${site.name} — Software Engineer | Full Stack Developer`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: pageTitle,
  description: site.description,
  authors: [{ name: site.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: `${site.name} — Portfolio`,
    title: pageTitle,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title: pageTitle, description: site.description },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f1ea" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f0d" },
  ],
};

// Runs before first paint so there is no flash of the wrong theme. Defaults to dark.
const themeScript = `(function(){var d=document.documentElement,t;try{t=localStorage.getItem("theme")}catch(e){}
if(t!=="light"&&t!=="dark")t="dark";d.dataset.theme=t})();`;

const sameAs = [site.github, site.linkedin].filter((u) => !isPlaceholder(u));
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  worksFor: { "@type": "Organization", name: site.company },
  url: site.url,
  description: site.description,
  ...(sameAs.length ? { sameAs } : {}),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${body.variable} ${display.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only z-[60] rounded-md bg-fg px-4 py-2 text-sm text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Providers>
          <TransitionProvider>
            <Nav />
            <main id="main">{children}</main>
            <Footer />
            <Cursor />
          </TransitionProvider>
        </Providers>
        {/* Film grain: a little texture so flat colour doesn't feel sterile. */}
        <div aria-hidden className="grain pointer-events-none fixed inset-0 z-[85]" />
      </body>
    </html>
  );
}
