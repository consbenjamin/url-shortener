import "./globals.css";

export const metadata = {
  title: "LinkBrief - URL Shortener",
  description: "Shorten your URLs quickly and easily with LinkBrief",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
