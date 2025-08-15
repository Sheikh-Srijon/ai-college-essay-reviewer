import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              College Essay Review
              <span className="block text-2xl md:text-3xl font-normal mt-4 opacity-90">
                Perfect your college essays with AI-powered feedback, line-by-line editing & admissions-style scoring
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto opacity-90">
              Scored using the same criteria real admissions officers use. Get brutally honest feedback and in-depth analysis instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4">
                <Link href="/essays">Get Started For Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-600 text-lg px-8 py-4">
                <Link href="/essays">Review Your Essay Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Professional-Grade Essay Analysis
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered system provides the same level of feedback that professional college counselors charge thousands for.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <CardTitle className="text-xl">Detailed Feedback</CardTitle>
                <CardDescription className="text-base">Line-by-line editing with specific improvement suggestions</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  See what&apos;s working, what&apos;s not, and what&apos;s missing in your essay. Get clear guidance on weak points, vague phrasing, and red flags.
                </p>
                <Button asChild className="w-full">
                  <Link href="/essays">Review Your Essay Now</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <CardTitle className="text-xl">Exact Criteria</CardTitle>
                <CardDescription className="text-base">Admissions rubric scoring using real evaluation standards</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  Find out how your essay would perform in a real admissions review — scored using the exact same factors that top admissions offices use.
                </p>
                <Button asChild className="w-full">
                  <Link href="/essays">Review Your Essay Now</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <CardTitle className="text-xl">Holistic Review</CardTitle>
                <CardDescription className="text-base">In-depth analysis of your essay&apos;s overall impact</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-6">
                  Get a full-picture analysis of how your essay is working as a whole — helping you understand the impression you&apos;re leaving.
                </p>
                <Button asChild className="w-full">
                  <Link href="/essays">Review Your Essay Now</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Serious Applicants Choose Our Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We built this platform to give serious applicants an advantage. If you&apos;re not using it, you&apos;re already behind.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-blue-600">4.6x</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">More Likely to Get In</h3>
              <p className="text-gray-600">
                Students who used our platform were 4.6x more likely to get accepted to their top choice — Stanford, Harvard, and other elite institutions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">You Only Get One Shot</h3>
              <p className="text-gray-600">
                Essays can make or break your application — and there are no do-overs. Smart applicants make sure theirs hit the mark.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Avoid &ldquo;What If?&rdquo;</h3>
              <p className="text-gray-600">
                The worst part isn&apos;t getting rejected — it&apos;s wondering if one better draft could&apos;ve changed everything. Don&apos;t leave it to chance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            You already know how important your essays are.
          </h2>
          <p className="text-xl mb-8 opacity-90">
            If you don&apos;t know what&apos;s wrong, you can&apos;t fix it. Our review shows you exactly what to improve — instantly.
          </p>
          <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4">
            <Link href="/essays">Submit Your Essay Now</Link>
          </Button>
        </div>
      </section>

      {/* Essay Types Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Supports Every College Essay Type
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our college essay reviewer provides expert feedback on every type of essay you&apos;ll write in your application.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border border-gray-200 hover:border-purple-300 transition-colors duration-200">
              <CardHeader>
                <CardTitle className="text-lg">Common App Essay</CardTitle>
                <CardDescription>
                  In-depth review of your personal statement and main Common Application essay
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border border-gray-200 hover:border-purple-300 transition-colors duration-200">
              <CardHeader>
                <CardTitle className="text-lg">&ldquo;Why Us?&rdquo; Essays</CardTitle>
                <CardDescription>
                  Expert feedback on demonstrating fit and genuine interest in specific colleges
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border border-gray-200 hover:border-purple-300 transition-colors duration-200">
              <CardHeader>
                <CardTitle className="text-lg">&ldquo;Why Major?&rdquo; Essays</CardTitle>
                <CardDescription>
                  Review and feedback on articulating your academic passion and intellectual curiosity
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border border-gray-200 hover:border-purple-300 transition-colors duration-200">
              <CardHeader>
                <CardTitle className="text-lg">Community Essays</CardTitle>
                <CardDescription>
                  Essays about how you&apos;ll fit into and contribute to the campus community
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border border-gray-200 hover:border-purple-300 transition-colors duration-200">
              <CardHeader>
                <CardTitle className="text-lg">Activity &amp; Extracurricular</CardTitle>
                <CardDescription>
                  Essays about your extracurricular activities, demonstrated impact, and achievements
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border border-gray-200 hover:border-purple-300 transition-colors duration-200">
              <CardHeader>
                <CardTitle className="text-lg">Diversity &amp; Identity</CardTitle>
                <CardDescription>
                  Essays about identity, diversity, personal values, and unique perspectives
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Have any more questions? Contact our support team to get what you need.
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What if I think my essays are already good?
              </h3>
              <p className="text-gray-600">
                Being a good writer isn&apos;t the same as writing a successful college essay. Admissions officers aren&apos;t grading your grammar, they&apos;re scanning for specific signals, patterns, and story elements that show you&apos;re exactly what their school wants. Most students, even strong writers, miss the mark because they don&apos;t know what to aim for.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Are my college essays really that important?
              </h3>
              <p className="text-gray-600">
                Absolutely. In today&apos;s competitive admissions landscape, essays are often the deciding factor between acceptance and rejection. They&apos;re your chance to show admissions officers who you are beyond grades and test scores.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How is this different from asking a friend or teacher for help?
              </h3>
              <p className="text-gray-600">
                While friends and teachers can provide general writing feedback, our platform uses the exact same evaluation criteria that admissions officers use. We&apos;ve analyzed thousands of accepted essays to identify the patterns that lead to success.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Contact us at:</p>
            <a href="mailto:support@example.com" className="text-purple-600 hover:text-purple-700 font-medium">
              support@example.com
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Where students go to get ahead.</h3>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              From crushing your exams to college essays, we help you stay ahead and stand out. The all-in-one platform to help you get into your dream school.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <Link href="/essays" className="hover:text-white transition-colors">Essay Review</Link>
              <Link href="/essays" className="hover:text-white transition-colors">College Essay Grader</Link>
              <Link href="/essays" className="hover:text-white transition-colors">Application Evaluation</Link>
              <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800">
              <p className="text-gray-400 text-sm">
                © 2025 College Essay Reviewer. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 