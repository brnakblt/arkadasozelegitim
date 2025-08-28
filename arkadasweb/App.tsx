import React from 'react';
import Header from './src/components/Header';
import Hero from './src/components/Hero';
import About from './src/components/About';
import Services from './src/components/Services';
import Process from './src/components/Process';
import Gallery from './src/components/Gallery';
import FAQ from './src/components/FAQ';
import Contact from './src/components/Contact';
import Footer from './src/components/Footer';

const App: React.FC = () => {
  return (
    <div className="smooth-scroll">
      {/* Skip to main content for accessibility */}
      <a href="#main-content" className="skip-link">
        Ana içeriğe geç
      </a>
      
      <Header />
      <main id="main-content" role="main" className="pt-16">
        <Hero />
        <About />
        <Services />
        <Process />
        <Gallery />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default App;