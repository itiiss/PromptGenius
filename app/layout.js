import { Geist, Geist_Mono } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import Link from 'next/link';

import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {



  return (
    <ClerkProvider>
    <html lang="zh" className="dark:bg-gray-900">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-gray-900 transition-colors duration-200`}
      >
        <header className="flex justify-between items-center p-4 gap-4 h-16 bg-gray-50 dark:bg-gray-800 backdrop-filter backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-4">
            <Link href="/" className="flex items-center gap-2 px-4 py-2 text-gray-800 dark:text-gray-100 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h2a1 1 0 001-1v-7m-6 0a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1"></path>
              </svg>
              <span className="font-medium">PromptGenius</span>
            </Link>
            <Link href="/prompts/new" className="flex items-center gap-2 px-4 py-2 text-gray-800 dark:text-gray-100 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-md transition-colors shadow-sm border border-blue-200 dark:border-blue-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span className="font-medium">新建</span>
            </Link>
            <Link href="/prompts" className="flex items-center gap-2 px-4 py-2 text-gray-800 dark:text-gray-100 bg-purple-100 dark:bg-purple-900 hover:bg-purple-200 dark:hover:bg-purple-800 rounded-md transition-colors shadow-sm border border-purple-200 dark:border-purple-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
              </svg>
              <span className="font-medium">管理</span>
            </Link>
          </div>
          <div className="flex gap-4">
            <SignedOut>
              <SignInButton mode="modal" className="px-4 py-2 text-gray-800 dark:text-gray-100 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors shadow-sm" />
              <SignUpButton mode="modal" className="px-4 py-2 text-gray-800 dark:text-gray-100 bg-teal-100 dark:bg-teal-900 hover:bg-teal-200 dark:hover:bg-teal-800 rounded-md transition-colors shadow-sm border border-teal-200 dark:border-teal-700" />
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </header>
        {children}
      </body>
    </html>
    </ClerkProvider>
  );
}
