import "./globals.css";

export const metadata = {
  title: "Storyfield — Creative territory, mapped",
  description: "Live web research for filmmakers and storytellers looking for creative whitespace.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
