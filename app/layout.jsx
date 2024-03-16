import { Inter } from "next/font/google";
import "./globals.css";
import Authprovider from "@/components/Authprovider/Authprovider";
import "react-toastify/dist/ReactToastify.css";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextTopLoader />
        <Authprovider>{children}</Authprovider>
      </body>
    </html>
  );
}
