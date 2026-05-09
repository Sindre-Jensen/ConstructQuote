"use client";

import { motion } from "framer-motion";
import { UserPlus, ArrowRight, CheckCircle } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Add Your Items",
      description: "Set up common work like labour, materials, and installation once — reuse them forever.",
      icon: UserPlus,
      color: "from-cyan-400 to-blue-500"
    },
    {
      number: "02",
      title: "Build your quote",
      description: "Select items, adjust quantities, and get an instant total.",
      icon: ArrowRight,
      color: "from-amber-400 to-orange-500"
    },
    {
      number: "03",
      title: "Send it",
      description: "Download a clean PDF and send it to your client in seconds.",
      icon: CheckCircle,
      color: "from-green-400 to-emerald-500"
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 px-4">
              Create quotes in minutes
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto px-4">
              No training. No complicated setup. Just a faster way to quote.
            </p>
          </motion.div>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1">
            <div className="max-w-4xl mx-auto h-full bg-gradient-to-r from-cyan-200 via-amber-200 to-green-200 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                {/* Step Card */}
                <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border-2 border-slate-200 hover:border-slate-300 transition-all duration-300">
                  {/* Step Number */}
                  <div className="text-5xl sm:text-6xl font-bold text-slate-200 mb-4">{step.number}</div>
                  
                  {/* Icon */}
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center mb-6 relative z-10`}>
                    <step.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}