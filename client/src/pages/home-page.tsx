import HeroSection from "@/components/home/hero-section";
import ServicesSection from "@/components/home/services-section";
import FeatureSection from "@/components/home/feature-section";
import ArticlesSection from "@/components/home/articles-section";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <ServicesSection />
      <FeatureSection />
      <ArticlesSection />
    </div>
  );
}
