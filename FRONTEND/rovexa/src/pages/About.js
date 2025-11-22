import React, { useEffect } from 'react';
import SEO from '../components/SEO';
import Hero from '../components/Hero';
import { motion } from 'framer-motion';

const About = () => {
  useEffect(() => {
    document.title = 'About — WebStudio';
  }, []);

  return (
    <>
      <SEO title="About — WebStudio" description="About WebStudio — a small digital studio crafting web experiences." />
      <main className="bg-white min-vh-100">
        <section className="pt-5 pb-4">
          <div className="container" style={{ maxWidth: '960px' }}>
            <Hero
              title="We build beautiful, reliable web experiences"
              subtitle="A small web-studio focused on product-minded design and fast frontend engineering."
            />
          </div>
        </section>

        <section className="py-5">
          <div className="container" style={{ maxWidth: '800px' }}>
            <div className="content">
              <motion.h2
                className="h2 fw-bold mb-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Our Story
              </motion.h2>

              <p className="mb-4">
                WebStudio is a compact team of designers and engineers who believe in shipping delightful and performant
                websites. We help startups and small businesses take their ideas to market quickly with accessible,
                responsive, and maintainable frontends.
              </p>

              <h3 className="h3 fw-bold mt-5 mb-3">What we do</h3>
              <ul className="mb-4">
                <li className="mb-2">Marketing websites & landing pages</li>
                <li className="mb-2">Portfolio & case study sites</li>
                <li className="mb-2">Design systems & UI implementations</li>
                <li className="mb-2">Performance & accessibility audits</li>
              </ul>

              <h3 className="h3 fw-bold mt-5 mb-3">Approach</h3>
              <p className="mb-4">
                We emphasize simplicity and craftsmanship: small teams, clear scopes, and pragmatic engineering. Our
                frontends are built using modern JS, Bootstrap CSS, and accessible markup.
              </p>

              <h3 className="h3 fw-bold mt-5 mb-3">Contact</h3>
              <p className="mb-4">
                Interested in working together? <a href="/contact" className="text-decoration-underline">Reach out</a> and we'll get back
                with a short, actionable plan.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default About;