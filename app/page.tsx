import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Header /> */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            AI College Essay Reviewer
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get AI-powered suggestions to improve your college essays. Our intelligent editor
            provides grammar corrections, style improvements, and content suggestions to help
            you craft compelling personal statements.
          </p>

          <div className="flex gap-4 justify-center">
            <Link href="/essay/adv-001">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                Start Reviewing Essays
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 