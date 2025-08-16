"use client";

import { Button } from "./button";
import { HamburgerMenu } from "./hamburger-menu";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export function Header() {
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="bg-purple-600 text-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <HamburgerMenu />
          <Link href="/" className="text-xl font-bold hover:text-purple-100 transition-colors">
            AI College Essay Reviewer
          </Link>
        </div>
        <nav className="flex items-center gap-4">
          {status === "loading" ? (
            <div className="text-sm text-purple-200">Loading...</div>
          ) : session ? (
            <>
              <Link href="/essays">
                <Button variant="ghost" className="text-white hover:bg-purple-700 hover:text-white">
                  Essays
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-sm text-purple-200">
                  {session.user?.name || session.user?.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-white border-white hover:bg-white hover:text-purple-600"
                >
                  Sign Out
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" className="bg-blue-700 text-white border-white hover:bg-white hover:text-purple-600">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
} 