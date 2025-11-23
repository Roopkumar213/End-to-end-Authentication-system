import React, { useEffect } from 'react';

// Mock components for demo
const SEO = ({ title, description }) => null;

const Hero = ({ title, subtitle }) => (
  <div className="hero-wrapper">
    <div className="hero-badge">About Us</div>
    <h1 className="hero-title">{title}</h1>
    <p className="hero-subtitle">{subtitle}</p>
    <div className="hero-decoration">
      <span className="decoration-dot"></span>
      <span className="decoration-dot"></span>
      <span className="decoration-dot"></span>
    </div>
  </div>
);

const About = () => {
  useEffect(() => {
    document.title = 'About — WebStudio';
  }, []);

  return (
    <>
      <SEO title="About — WebStudio" description="About WebStudio — a small digital studio crafting web experiences." />
      <main className="about-page">
        {/* Animated Background Elements */}
        <div className="bg-orb orb-purple"></div>
        <div className="bg-orb orb-blue"></div>
        <div className="bg-orb orb-pink"></div>
        <div className="bg-grid"></div>

        {/* Hero Section */}
        <section className="about-hero-section">
          <div className="about-container hero-container">
            <Hero
              title="We build beautiful, reliable web experiences"
              subtitle="A small web-studio focused on product-minded design and fast frontend engineering."
            />
          </div>
        </section>

        {/* Content Section */}
        <section className="about-content-section">
          <div className="about-container content-container">
            <div className="content-wrapper">
              
              {/* Our Story */}
              <div className="content-block story-block">
                <div className="section-number">01</div>
                <h2 className="section-heading">Our Story</h2>
                <div className="content-text">
                  <p className="text-paragraph">
                    WebStudio is a compact team of designers and engineers who believe in shipping delightful and performant
                    websites. We help startups and small businesses take their ideas to market quickly with accessible,
                    responsive, and maintainable frontends.
                  </p>
                </div>
              </div>

              {/* What We Do */}
              <div className="content-block services-block">
                <div className="section-number">02</div>
                <h3 className="section-heading">What we do</h3>
                <div className="services-grid">
                  <div className="service-item">
                    <div className="service-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3 9h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="service-text">Marketing websites & landing pages</span>
                  </div>
                  <div className="service-item">
                    <div className="service-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="service-text">Portfolio & case study sites</span>
                  </div>
                  <div className="service-item">
                    <div className="service-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="3" y="3" width="7" height="7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <rect x="14" y="3" width="7" height="7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <rect x="14" y="14" width="7" height="7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <rect x="3" y="14" width="7" height="7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="service-text">Design systems & UI implementations</span>
                  </div>
                  <div className="service-item">
                    <div className="service-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="service-text">Performance & accessibility audits</span>
                  </div>
                </div>
              </div>

              {/* Approach */}
              <div className="content-block approach-block">
                <div className="section-number">03</div>
                <h3 className="section-heading">Approach</h3>
                <div className="approach-card">
                  <div className="approach-content">
                    <p className="text-paragraph">
                      We emphasize simplicity and craftsmanship: small teams, clear scopes, and pragmatic engineering. Our
                      frontends are built using modern JS, Bootstrap CSS, and accessible markup.
                    </p>
                  </div>
                  <div className="approach-pillars">
                    <div className="pillar">
                      <div className="pillar-icon">⚡</div>
                      <div className="pillar-label">Speed</div>
                    </div>
                    <div className="pillar">
                      <div className="pillar-icon">🎨</div>
                      <div className="pillar-label">Design</div>
                    </div>
                    <div className="pillar">
                      <div className="pillar-icon">♿</div>
                      <div className="pillar-label">Access</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact CTA */}
              <div className="content-block contact-block">
                <div className="section-number">04</div>
                <h3 className="section-heading">Contact</h3>
                <div className="contact-card">
                  <p className="text-paragraph contact-text">
                    Interested in working together? <a href="/contact" className="contact-link">Reach out</a> and we'll get back
                    with a short, actionable plan.
                  </p>
                  <div className="contact-arrow">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <line x1="5" y1="12" x2="19" y2="12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="12 5 19 12 12 19" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <style>{`
        /* Reset and Base */
        * {
          box-sizing: border-box;
        }

        /* Page Container */
        .about-page {
          min-height: 100vh;
          background: linear-gradient(to bottom, #fafbfc 0%, #f4f5f7 100%);
          position: relative;
          overflow-x: hidden;
        }

        /* Animated Background Orbs */
        .bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.3;
          pointer-events: none;
          z-index: 0;
          animation: floatOrb 25s ease-in-out infinite;
        }

        .orb-purple {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.4), transparent);
          top: -100px;
          right: -100px;
          animation-delay: 0s;
        }

        .orb-blue {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.3), transparent);
          bottom: -200px;
          left: -200px;
          animation-delay: 8s;
        }

        .orb-pink {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(236, 72, 153, 0.25), transparent);
          top: 40%;
          right: 10%;
          animation-delay: 16s;
        }

        @keyframes floatOrb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -40px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
        }

        /* Background Grid Pattern */
        .bg-grid {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          z-index: 0;
          pointer-events: none;
        }

        /* Container */
        .about-container {
          max-width: 960px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
          z-index: 1;
        }

        .hero-container {
          max-width: 960px;
        }

        .content-container {
          max-width: 800px;
        }

        /* Hero Section */
        .about-hero-section {
          padding: 120px 0 80px;
          position: relative;
        }

        .hero-wrapper {
          text-align: center;
          animation: fadeSlideUp 0.8s ease-out;
        }

        .hero-badge {
          display: inline-block;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #8b5cf6;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1));
          padding: 8px 18px;
          border-radius: 50px;
          margin-bottom: 32px;
          border: 1px solid rgba(139, 92, 246, 0.2);
          animation: fadeSlideUp 0.8s ease-out 0.1s backwards;
        }

        .hero-title {
          font-size: clamp(2.25rem, 5vw, 3.5rem);
          font-weight: 800;
          color: #0f172a;
          line-height: 1.15;
          letter-spacing: -0.03em;
          margin: 0 0 24px;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
          animation: fadeSlideUp 0.8s ease-out 0.2s backwards;
        }

        .hero-subtitle {
          font-size: clamp(1.125rem, 2vw, 1.375rem);
          color: #64748b;
          line-height: 1.7;
          margin: 0 0 32px;
          max-width: 650px;
          margin-left: auto;
          margin-right: auto;
          animation: fadeSlideUp 0.8s ease-out 0.3s backwards;
        }

        .hero-decoration {
          display: flex;
          justify-content: center;
          gap: 8px;
          animation: fadeSlideUp 0.8s ease-out 0.4s backwards;
        }

        .decoration-dot {
          width: 8px;
          height: 8px;
          background: linear-gradient(135deg, #8b5cf6, #3b82f6);
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        .decoration-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .decoration-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        /* Content Section */
        .about-content-section {
          padding: 40px 0 120px;
          position: relative;
        }

        .content-wrapper {
          display: flex;
          flex-direction: column;
          gap: 80px;
        }

        /* Content Block */
        .content-block {
          position: relative;
          animation: fadeSlideUp 0.8s ease-out backwards;
        }

        .story-block { animation-delay: 0.1s; }
        .services-block { animation-delay: 0.2s; }
        .approach-block { animation-delay: 0.3s; }
        .contact-block { animation-delay: 0.4s; }

        .section-number {
          position: absolute;
          left: -60px;
          top: 0;
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(135deg, #8b5cf6, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          opacity: 0.15;
          line-height: 1;
        }

        @media (max-width: 768px) {
          .section-number {
            position: static;
            font-size: 2rem;
            margin-bottom: 12px;
          }
        }

        .section-heading {
          font-size: clamp(1.75rem, 3vw, 2.25rem);
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 24px;
          letter-spacing: -0.02em;
          position: relative;
        }

        .section-heading::after {
          content: '';
          position: absolute;
          bottom: -12px;
          left: 0;
          width: 60px;
          height: 4px;
          background: linear-gradient(90deg, #8b5cf6, #3b82f6);
          border-radius: 2px;
        }

        .content-text {
          margin-top: 32px;
        }

        .text-paragraph {
          font-size: 1.125rem;
          color: #475569;
          line-height: 1.8;
          margin: 0 0 20px;
        }

        .text-paragraph:last-child {
          margin-bottom: 0;
        }

        /* Services Grid */
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-top: 32px;
        }

        .service-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 24px;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .service-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #8b5cf6, #3b82f6);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }

        .service-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(139, 92, 246, 0.15);
          border-color: rgba(139, 92, 246, 0.3);
        }

        .service-item:hover::before {
          transform: scaleX(1);
        }

        .service-icon {
          flex-shrink: 0;
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1));
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8b5cf6;
          transition: all 0.3s ease;
        }

        .service-item:hover .service-icon {
          background: linear-gradient(135deg, #8b5cf6, #3b82f6);
          color: white;
          transform: scale(1.1) rotate(5deg);
        }

        .service-text {
          font-size: 1rem;
          font-weight: 500;
          color: #334155;
          line-height: 1.6;
        }

        /* Approach Card */
        .approach-card {
          margin-top: 32px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .approach-card:hover {
          box-shadow: 0 12px 32px rgba(139, 92, 246, 0.1);
          border-color: rgba(139, 92, 246, 0.2);
        }

        .approach-content {
          margin-bottom: 32px;
        }

        .approach-pillars {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 24px;
          padding-top: 32px;
          border-top: 1px solid rgba(226, 232, 240, 0.6);
        }

        .pillar {
          text-align: center;
          transition: transform 0.3s ease;
        }

        .pillar:hover {
          transform: translateY(-4px);
        }

        .pillar-icon {
          font-size: 2.5rem;
          margin-bottom: 12px;
          filter: grayscale(0.3);
          transition: filter 0.3s ease;
        }

        .pillar:hover .pillar-icon {
          filter: grayscale(0);
        }

        .pillar-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Contact Card */
        .contact-card {
          margin-top: 32px;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(59, 130, 246, 0.05));
          border: 2px solid rgba(139, 92, 246, 0.2);
          border-radius: 24px;
          padding: 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .contact-card::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(139, 92, 246, 0.1), transparent);
          transform: rotate(45deg);
          animation: shimmer 3s linear infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }

        .contact-card:hover {
          border-color: rgba(139, 92, 246, 0.4);
          box-shadow: 0 12px 32px rgba(139, 92, 246, 0.15);
          transform: translateY(-2px);
        }

        .contact-text {
          margin: 0;
          position: relative;
          z-index: 1;
        }

        .contact-link {
          color: #8b5cf6;
          font-weight: 600;
          text-decoration: none;
          position: relative;
          transition: color 0.3s ease;
        }

        .contact-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #8b5cf6, #3b82f6);
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.3s ease;
        }

        .contact-link:hover {
          color: #7c3aed;
        }

        .contact-link:hover::after {
          transform: scaleX(1);
          transform-origin: left;
        }

        .contact-arrow {
          flex-shrink: 0;
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #8b5cf6, #3b82f6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;
        }

        .contact-card:hover .contact-arrow {
          transform: translateX(8px);
          box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
        }

        /* Animations */
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .about-hero-section {
            padding: 80px 0 60px;
          }

          .about-content-section {
            padding: 20px 0 80px;
          }

          .content-wrapper {
            gap: 60px;
          }

          .services-grid {
            grid-template-columns: 1fr;
          }

          .approach-pillars {
            grid-template-columns: repeat(3, 1fr);
          }

          .contact-card {
            flex-direction: column;
            text-align: center;
            padding: 32px 24px;
          }

          .contact-arrow {
            width: 48px;
            height: 48px;
          }

          .approach-card {
            padding: 32px 24px;
          }
        }

        @media (max-width: 480px) {
          .approach-pillars {
            grid-template-columns: 1fr;
          }
        }

        /* Focus States for Accessibility */
        .contact-link:focus,
        .service-item:focus-within {
          outline: 3px solid #8b5cf6;
          outline-offset: 2px;
        }

        /* Smooth Scrolling */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </>
  );
};

export default About;