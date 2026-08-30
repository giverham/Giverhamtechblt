import { Suspense, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ErrorBoundary from '@/components/ErrorBoundary';
import AmbientBackground from '@/components/AmbientBackground';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import ServicesSection from '@/components/sections/ServicesSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import TechStackSection from '@/components/sections/TechStackSection';
import WhyUsSection from '@/components/sections/WhyUsSection';
import FounderSection from '@/components/sections/FounderSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import BlogSection from '@/components/sections/BlogSection';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/Footer';

const SECTION_IDS = ['services', 'projects', 'tech', 'about', 'testimonials', 'blog', 'contact'];

export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && SECTION_IDS.includes(hash)) {
      navigate(`/${hash}`, { replace: true });
      return;
    }

    const route = location.pathname.replace(/^\//, '');
    if (route && SECTION_IDS.includes(route)) {
      const timer = window.setTimeout(() => {
        document.getElementById(route)?.scrollIntoView({ behavior: 'smooth' });
      }, 120);
      return () => window.clearTimeout(timer);
    }

    if (!route) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden">
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
