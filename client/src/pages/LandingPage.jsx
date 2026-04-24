import React from 'react';
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Services from "../components/Services";
import Poster from "../components/Poster";
import About from "../components/About";
import Testimonials from "../components/Testimonials"; // Named CustomerStories in our previous logic
import FAQ from "../components/FAQ";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Poster />
        <About />
        < Testimonials/>
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}