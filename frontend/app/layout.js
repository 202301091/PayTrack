import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "PayTrack - Modern Payment Management System",
  description: "PayTrack helps you track transactions, manage payments, and monitor financial activity in a secure and user-friendly interface."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`min-h-screen bg-gradient-to-br from-blue-200 via-indigo-200 to-sky-300 ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID} >
          {children}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            draggable
            theme="light"
            toastClassName="custom-toast"
            bodyClassName="custom-toast-body"
            progressClassName="custom-toast-progress"
          />
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
