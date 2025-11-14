import React, { Suspense, lazy } from "react";
import Header from "./src/components/Header";
import Hero from "./src/components/Hero";

const About = lazy(() => import("./src/components/About"));
const Team = lazy(() => import("./src/components/Team"));
const Services = lazy(() => import("./src/components/Services"));
const Process = lazy(() => import("./src/components/Process"));
const Gallery = lazy(() => import("./src/components/Gallery"));
const FAQ = lazy(() => import("./src/components/FAQ"));
const Contact = lazy(() => import("./src/components/Contact"));
const Footer = lazy(() => import("./src/components/Footer"));

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
        <Suspense fallback={<div>Yükleniyor...</div>}>
          <About />
          <Team />
          <Services />
          <Process />
          <Gallery />
          <FAQ />
          <Contact />
        </Suspense>
      </main>
      <Suspense fallback={<div></div>}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default App;
