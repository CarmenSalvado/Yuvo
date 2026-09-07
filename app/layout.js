import "./globals.css";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-storyfield",
});

export const metadata = {
  title: "Storyfield — Creative territory, mapped",
  description: "Live web research for filmmakers and storytellers looking for creative whitespace.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={manrope.variable}>
      <body>{children}</body>
    </html>
  );
}
