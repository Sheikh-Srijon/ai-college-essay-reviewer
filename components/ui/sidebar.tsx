"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./sheet";
import { Button } from "./button";
import { Menu, User, FileText } from "lucide-react";
import Link from "next/link";

export function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 bg-purple-600 text-white hover:bg-purple-700 hover:text-white border-0"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 bg-purple-50 border-r border-purple-100">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-8 p-4">
              <h2 className="text-lg font-semibold text-purple-900">Menu</h2>
            </div>

            <nav className="flex-1 space-y-2 px-4">
              <Link href="/profile" onClick={() => setOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-3 text-purple-800 hover:bg-purple-100 hover:text-purple-900">
                  <User className="h-5 w-5" />
                  Profile
                </Button>
              </Link>

              <Link href="/essays" onClick={() => setOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-3 text-purple-800 hover:bg-purple-100 hover:text-purple-900">
                  <FileText className="h-5 w-5" />
                  Essays
                </Button>
              </Link>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
} 