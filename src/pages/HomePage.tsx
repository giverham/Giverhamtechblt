import { Suspense } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import CustomCursor from '@/components/CustomCursor';
import AmbientBackground from '@/components/AmbientBackground';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import TrustSection from '@/components/sections/TrustSection';
import ServicesSection from '@/components/sections/ServicesSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import TechStackSection from '@/components/sections/TechStackSection';
import WhyUsSection from '@/components/sections/WhyUsSection';
import FounderSection from '@/components/sections/FounderSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import BlogSection from '@/components/sections/BlogSection';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden">
      <ErrorBoundary fallback={null}>
        <CustomCursor />
      </ErrorBoundary>

      <ErrorBoundary fallback={null}>
        <AmbientBackground />
      </ErrorBoundary>

      <div className="relative z-[1]">
        <Navbar />

        <ErrorBoundary fallback={<div className="h-screen bg-black" />}>
          <Suspense fallback={<div className="h-screen bg-black" />}>
            <HeroSection />
          </Suspense>
        </ErrorBoundary>

        <TrustSection />
        <ServicesSection />
        <ProjectsSection />
        <TechStackSection />
        <WhyUsSection />
        <FounderSection />
        <TestimonialsSection />
        <BlogSection />
        <ContactSection />
        <Footer />
      </div>
    </div>
  );
}
