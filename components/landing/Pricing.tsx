import React from "react";

const Pricing = () => {
  return (
    <div className="w-full h-full">
      <div>
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold tracking text-center mt-2">
          Pricing
        </h2>
      </div>
      <div className="mt-8 sm:mt-12 mx-auto max-w-6xl rounded-3xl px-4 sm:px-0">
      <div className="space-y-8 sm:space-y-12 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
        <div className="relative w-full p-6 sm:p-8 mt-5 border border-slate-700/70 rounded-2xl shadow-sm flex flex-col bg-slate-900/70 text-slate-100">
          <div className="flex-1">
            <h3 className="text-xl sm:text-2xl font-semibold ">Free Tier</h3>
            <p className="mt-4 flex items-baseline ">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">Free</span>
              <span className="ml-1 text-lg sm:text-xl font-semibold"></span>
            </p>
            <p className="mt-6 text-sm sm:text-base text-slate-300">For trying things out.</p>
            <ul role="list" className="mt-6 space-y-6">
              <li className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-shrink-0 w-6 h-6 text-emerald-500"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span className="ml-3 ">Create up to 5 quotes a month</span>
              </li>
              <li className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-shrink-0 w-6 h-6 text-emerald-500"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span className="ml-3 ">Basic line item library</span>
              </li>
              <li className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-shrink-0 w-6 h-6 text-emerald-500"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span className="ml-3 ">Add custom items</span>
              </li>
              <li className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-shrink-0 w-6 h-6 text-emerald-500"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span className="ml-3 ">Download PDF quotes</span>
              </li>
            </ul>
          </div>
          <a
            className="bg-emerald-100/10 text-emerald-300 hover:bg-emerald-100/20 mt-8 block w-full py-3 px-6 border border-emerald-400/20 rounded-md text-center font-medium"
            href="/login"
          >
            Try it free
          </a>
        </div>
        <div className="relative p-6 sm:p-8 w-full lg:h-auto mt-2 shadow-xl/90 border border-[#fd2b92] bg-white text-black rounded-2xl shadow-lg/10 flex flex-col">
          <div className="flex-1">
            <h3 className="text-xl sm:text-2xl font-semibold ">Pro</h3>
            <p className="absolute top-0 py-1.5 px-4 rounded-full text-xs font-semibold uppercase tracking-wide transform -translate-y-1/2 text-white bg-gradient-to-r from-pink-500 to-fuchsia-500">
              Most popular
            </p>
            <p className="mt-4 flex items-baseline ">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                $19
              </span>
              <span className="ml-1 text-lg sm:text-xl font-semibold">/month</span>
            </p>
            <p className="mt-6 text-sm sm:text-base">
            For growing businesses that need more
            </p>
            <ul role="list" className="mt-6 space-y-6">
              <li className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-shrink-0 w-6 h-6 text-emerald-500"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span className="ml-3 ">Unlimited quotes</span>
              </li>
              <li className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-shrink-0 w-6 h-6 text-emerald-500"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span className="ml-3 ">Unlimited line items</span>
              </li>
              <li className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-shrink-0 w-6 h-6 text-emerald-500"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span className="ml-3 ">Save and reuse past quotes</span>
              </li>
              <li className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-shrink-0 w-6 h-6 text-emerald-500"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span className="ml-3 ">Faster workflow</span>
              </li>
              <li className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-shrink-0 w-6 h-6 text-emerald-500"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span className="ml-3 ">Priority support</span>
              </li>
            </ul>
          </div>
          <a
            className="mt-8 block w-full py-3 px-6 border border-[#fd2b92] text-[#fd2b92] hover:bg-[#fd2b92] hover:text-white rounded-md text-center font-medium transition-colors"
            href="/coming-soon"
          >
            Upgrade to pro
          </a>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Pricing;