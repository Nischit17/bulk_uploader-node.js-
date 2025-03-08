"use client";

import { ReactNode } from "react";
import Link from "next/link";

interface AppLayoutProps {
  children: ReactNode;
}

/**
 * Main application layout component
 * Provides consistent layout structure with header, navigation, and footer
 *
 * @param {AppLayoutProps} props - Component props
 * @returns {JSX.Element} The layout component
 */
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h1 className="text-xs lg:text-xl font-bold">Bulk Upload</h1>
          </div>

          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/upload"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Upload
                </Link>
              </li>
              <li>
                <Link
                  href="/history"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  History
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>Bulk Upload Application &copy; {new Date().getFullYear()}</p>
          <p className="mt-1">A powerful tool for managing bulk data uploads</p>
        </div>
      </footer>
    </div>
  );
}
