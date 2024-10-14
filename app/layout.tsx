import type { Metadata } from "next";

export const metadata: Metadata = {
  title : "Quizzr",
  description:"Quizzr Admin",
};
import "./global.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
