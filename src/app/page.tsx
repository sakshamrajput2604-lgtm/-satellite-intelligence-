import { HeroSection } from "@/components/sections/HeroSection";
import { GlobePreviewSection } from "@/components/sections/GlobePreviewSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { AIPredictionSection } from "@/components/sections/AIPredictionSection";
import { DebrisMonitoringSection } from "@/components/sections/DebrisMonitoringSection";
import { AnalyticsDashboardSection } from "@/components/sections/AnalyticsDashboardSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-background">
      <HeroSection />
      <GlobePreviewSection />
      <FeaturesSection />
      <AIPredictionSection />
      <DebrisMonitoringSection />
      <AnalyticsDashboardSection />
      <PricingSection />
      <Footer />
    </main>
  );
}
