"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "./sheet";
import { Button } from "./button";
import { Menu, User, FileText } from "lucide-react";
import Link from "next/link";

export function HamburgerMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white hover:bg-purple-700 hover:text-white border-0">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 bg-purple-50 border-r border-purple-100">
        <SheetTitle className="text-lg font-semibold text-purple-900 mb-6">Menu</SheetTitle>
        <div className="flex flex-col h-full">
          <nav className="flex-1 space-y-2 px-4">
            <Link href="/profile">
              <Button variant="ghost" className="w-full justify-start gap-3 text-purple-800 hover:bg-purple-100 hover:text-purple-900">
                <User className="h-5 w-5" />
                Profile
              </Button>
            </Link>

            <Link href="/essays">
              <Button variant="ghost" className="w-full justify-start gap-3 text-purple-800 hover:bg-purple-100 hover:text-purple-900">
                <FileText className="h-5 w-5" />
                Essays
              </Button>
            </Link>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
} 