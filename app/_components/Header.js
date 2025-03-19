'use client'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import LanguageSwitcher from './LanguageSwitcher'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 gap-4 h-16 bg-gray-50 dark:bg-gray-800 backdrop-filter backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
    <div className="flex gap-4">
      <Link href="/" className="flex items-center gap-2 h-10 px-4 text-gray-800 dark:text-gray-100 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors shadow-sm">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h2a1 1 0 001-1v-7m-6 0a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1"></path>
        </svg>
        <span className="font-medium">PromptGenius</span>
      </Link>

    </div>
    <div className="flex gap-4">
      <LanguageSwitcher />
      
      <SignedOut>
        <SignInButton mode="modal" className="h-10 px-4 text-gray-800 dark:text-gray-100 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors shadow-sm whitespace-nowrap" />
        <SignUpButton mode="modal" className="h-10 px-4 text-gray-800 dark:text-gray-100 bg-teal-100 dark:bg-teal-900 hover:bg-teal-200 dark:hover:bg-teal-800 rounded-md transition-colors shadow-sm border border-teal-200 dark:border-teal-700 whitespace-nowrap" />
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </div>
  </header>
  )
} 