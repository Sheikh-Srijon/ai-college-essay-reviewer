import { Button } from "./button";
import { HamburgerMenu } from "./hamburger-menu";

export function Header() {
  return (
    <header className="bg-purple-600 text-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <HamburgerMenu />
          <h1 className="text-xl font-bold">AI College Essay Reviewer</h1>
        </div>
        <nav className="flex gap-4">
          <Button variant="ghost" className="text-white hover:bg-purple-700 hover:text-white">
            Essays
          </Button>
          <Button variant="ghost" className="text-white hover:bg-purple-700 hover:text-white">
            Dashboard
          </Button>
        </nav>
      </div>
    </header>
  );
} 