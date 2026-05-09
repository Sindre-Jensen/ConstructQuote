import Image from "next/image";
import List from "@/components/landing/List";
import Pricing from "@/components/landing/Pricing";
import Card from "@/components/landing/Card";
import HowItWorks from "@/components/landing/HowItWorks";
import JoinWaitlist from "@/components/landing/JoinWaitlist";
import TrustedBy from "@/components/landing/TrustedBy";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-[#0f172a]">
      {/* Header */}
      <header className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-9 py-4 flex items-center justify-between">
          <Image
            src="/ConstruQuote_Logo.png"
            alt="ConstruQuote logo"
            width={65}
            height={55}
            priority
            className="object-contain"
          />
          <a
            href="#pricing"
            className="text-[#0f172a] hover:text-[#475569] font-medium transition-colors"
          >
            Pricing
          </a>
          <a
            href="/login"
            className="px-4 py-2 rounded-md font-medium text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:from-pink-600 hover:to-fuchsia-600 transition-colors"
          >
            Login
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-9 py-8 sm:py-12 lg:py-16 w-full">
          <section className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            <div className="max-w-3xl flex-1 w-full">
              {/* Hero Text */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
                Create quotes in
              </h1>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-extratight tracking-tight">
                <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-extratight tracking-tight bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">2 minutes</span>, not 15
              </h1>
              <h3 className="text-base sm:text-lg mt-4 px-1 font-medium">
                Create professional quotes in minutes. Select items, get instant totals, and win more jobs.
                <span className="block">No more Excel nightmares or pricing errors.</span>
              </h3>
              <div className="mt-4">
                <JoinWaitlist className="inline-block w-auto px-8" />
              </div>
              <TrustedBy />
            </div>

            <div className="flex flex-col w-full lg:w-auto gap-4 lg:max-w-md">
              <div className="w-full">
                <List />
              </div>
            </div>
          </section>
        </main>
      </section>

      <section className="bg-[#0f172a] px-4 sm:px-6 lg:px-9 py-12 sm:py-16 lg:py-24">
        <div className="text-white text-center max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-3">
            Quoting shouldn't be this hard
          </h2>
          <h3 className="text-[#94a3b8] text-base sm:text-lg md:text-lg lg:text-xl font-medium leading-tight tracking-tight px-4">
            Contractors waste countless hours on quote chaos.
            <span className="block mt-1">Sound familiar?</span>
          </h3>
        </div>
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 mt-8 max-w-7xl mx-auto">
          <Card
            title="Excel Nightmares"
            description="Endless spreadsheets, broken formulas, and versions floating around on different computers."
          />
          <Card
            title="Time Wasted"
            description="Hours spent manually calculating totals, rewriting the same line items, and fixing pricing errors."
          />
          <Card
            title="Lost Jobs"
            description="Slow turnaround means losing bids to competitors who respond faster with professional quotes."
          />
        </div>
      </section>

      <section>
        <HowItWorks />
      </section>

      <section id="pricing" className="relative flex items-center justify-center px-4 sm:px-6 lg:px-9 py-12 sm:py-16 lg:py-24 text-white overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-[48rem] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.25),transparent_60%)] blur-3xl"></div>
          <div className="absolute bottom-0 right-1/3 h-80 w-80 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.18),transparent_60%)] blur-3xl"></div>
        </div>
        <div className="relative">
          <Pricing />
        </div>
      </section>
    </div>
  );
}
