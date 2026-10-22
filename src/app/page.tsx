import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { PartnersMarquee, Ticker } from "@/components/Marquees";
import Intro from "@/components/Intro";
import Works from "@/components/Works";
import Services from "@/components/Services";
import Pricing from "@/components/Pricing";
import Approach from "@/components/Approach";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      {/* Content sits above the footer; scrolling past it reveals the sticky footer underneath. */}
      <main className="relative z-10 rounded-b-[28px] bg-bg shadow-[var(--fn-section-shadow)] sm:rounded-b-[40px]">
        <Hero />
        <PartnersMarquee />
        <Intro />
        <Works />
        <Services />
        <Ticker />
        <Pricing />
        <Approach />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
