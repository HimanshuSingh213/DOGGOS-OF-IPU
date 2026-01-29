
import { Poppins, Inter } from "next/font/google";

import "./globals.css";



const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Doggos of IPU 🐶",
  description: "Official website for Doggos of IPU",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">


      <body className={`${poppins.className} ${inter.variable}`}>

        {children}
      </body>
    </html>
  );
}
