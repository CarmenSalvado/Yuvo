import "./globals.css";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-howitwent",
});

export const metadata = {
  title: "Yuvo — Big idea. Better story.",
  description: "A creative workspace for storytellers: research your idea, find a direction, and improve your next draft.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={manrope.variable}>
      <body>{children}</body>
    </html>
  );
}
