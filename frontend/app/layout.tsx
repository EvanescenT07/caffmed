import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import FloatingChatbot from "@/components/chatbot/floating-chatbot";
import Navbar from "@/components/navbar/main-nav";

const PoppinsFont = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Caffmed",
  description:
    "CaffMed is a platform for detecting brain tumors using machine learning on brain X-ray.",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/favicon.png",
        type: "image/png",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/d_favicon.png",
        type: "image/png",
      },
    ],
  },
  creator: "Zulfikar Ahmad Aliansyah",
  publisher: "vercel",
  robots: "index , follow",
  category: "technology",
  keywords: ["machine learning", "cnn", "brain tumor", "image classification"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${PoppinsFont.variable} antialiased`}>
        <Toaster />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* Fixed Navbar */}
          <Navbar />

          {/* Main Content with proper spacing */}
          <main className="pt-20">{children}</main>

          {/* Global Components */}
          <FloatingChatbot />
        </ThemeProvider>
      </body>
    </html>
  );
}
