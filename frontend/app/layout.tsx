import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import FloatingChatbot from "@/components/chatbot/floating-chatbot";

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
          {children}
          <FloatingChatbot />
        </ThemeProvider>
      </body>
    </html>
  );
}
