import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NotaryNode | Decentralized Evidence",
  description: "The Immutable Truth for Your Digital Assets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col relative bg-[#0a0a0a] text-[#33ff00]">
        {/* Grid Background */}
        <div className="grid-bg"></div>
        {/* CRT Scanline Overlay */}
        <div className="crt-overlay"></div>
        {/* Glowing Side Borders */}
        <div className="side-glow-left"></div>
        <div className="side-glow-right"></div>
        {children}
      </body>
    </html>
  );
}
