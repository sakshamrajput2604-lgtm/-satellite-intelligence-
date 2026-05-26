"use client";

import React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowingButton } from "@/components/ui/GlowingButton";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Observer",
    price: "$999",
    period: "/mo",
    description: "For small fleets and university programs.",
    features: ["Track up to 10 assets", "Daily AI decay predictions", "Basic collision alerts", "Standard API access"],
    buttonText: "Start Trial",
    href: "/signup",
    variant: "secondary" as const
  },
  {
    name: "Enterprise",
    price: "$4,999",
    period: "/mo",
    description: "For commercial satellite operators.",
    features: ["Track up to 500 assets", "Real-time AI predictions", "Immediate collision alerts", "Full telemetry API", "Dedicated support"],
    buttonText: "Get Enterprise",
    href: "/signup",
    variant: "primary" as const,
    highlight: true
  },
  {
    name: "Agency",
    price: "Custom",
    period: "",
    description: "For governmental and defense agencies.",
    features: ["Unlimited asset tracking", "On-premise deployment", "Military-grade encryption", "Custom neural models", "24/7 direct channel"],
    buttonText: "Contact Sales",
    href: "/contact",
    variant: "secondary" as const
  }
];

export function PricingSection() {
  return (
    <section className="relative py-32 bg-slate-900 border-t border-slate-800">
      <div className="container mx-auto px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-foreground">
            Scale your <span className="text-primary">Operations</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Choose the plan that fits your mission requirements. All plans include our core AI engine and world-class reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={`relative ${plan.highlight ? 'md:-translate-y-4' : ''}`}
            >
              {plan.highlight && (
                <div className="absolute -inset-0.5 bg-primary/30 rounded-xl blur opacity-50" />
              )}
              <GlassCard className={`h-full flex flex-col p-10 ${plan.highlight ? 'border-primary/50 bg-slate-900 z-10 shadow-xl' : 'bg-slate-950/50'}`}>
                {plan.highlight && (
                  <div className="absolute top-0 right-8 transform -translate-y-1/2">
                    <span className="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <h3 className="text-2xl font-semibold mb-3 text-foreground">{plan.name}</h3>
                <p className="text-slate-400 text-sm mb-8 h-10">{plan.description}</p>
                
                <div className="mb-10">
                  <span className="text-5xl font-bold text-foreground tracking-tight">{plan.price}</span>
                  <span className="text-slate-500 font-medium">{plan.period}</span>
                </div>
                
                <ul className="space-y-5 mb-10 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-slate-300 text-sm leading-tight font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <GlowingButton variant={plan.variant} href={plan.href} className="w-full py-3 flex-none">
                  {plan.buttonText}
                </GlowingButton>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
