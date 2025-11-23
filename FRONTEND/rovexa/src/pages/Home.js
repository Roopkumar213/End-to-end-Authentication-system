import React from 'react';

// Mock components for demo
const SEO = ({ title, description }) => null;

const Hero = () => (
  <section className="hero-section">
    <div className="hero-background">
      <div className="hero-orb orb-1"></div>
      <div className="hero-orb orb-2"></div>
      <div className="hero-orb orb-3"></div>
      <div className="hero-grid"></div>
    </div>
    
    <div className="hero-container">
      <div className="hero-content">
        <div className="hero-badge">Welcome to WebStudio</div>
        <h1 className="hero-title">
          Building Digital
          <span className="hero-title-gradient"> Experiences</span>
          <br />That Matter
        </h1>
        <p className="hero-subtitle">
          Modern web studio creating exceptional digital experiences that drive results and inspire users
        </p>
        <div className="hero-cta-group">
          <a href="/contact" className="hero-btn hero-btn-primary">
            Get Started
            <svg className="btn-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a href="/services" className="hero-btn hero-btn-secondary">
            View Services
          </a>
        </div>
      </div>
    </div>
    
    <div className="hero-scroll-indicator">
      <div className="scroll-mouse">
        <div className="scroll-wheel"></div>
      </div>
      <span className="scroll-text">Scroll to explore</span>
    </div>
  </section>
);

const ServiceCard = ({ icon, title, description, features }) => (
  <div className="service-card">
    <div className="service-card-glow"></div>
    <div className="service-card-content">
      <div className="service-icon-wrapper">
        <div className="service-icon">
          {icon}
        </div>
      </div>
      <h3 className="service-title">{title}</h3>
      <p className="service-description">{description}</p>
      <ul className="service-features">
        {features.map((feature, idx) => (
          <li key={idx} className="feature-item">
            <svg className="feature-check" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const Home = () => {
  const services = [
    {
      icon: (
        <svg style={{ width: '3rem', height: '3rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Web Development',
      description: 'Custom web applications built with modern technologies for optimal performance and user experience.',
      features: ['React & Next.js', 'Responsive Design', 'Performance Optimization', 'SEO Best Practices'],
    },
    {
      icon: (
        <svg style={{ width: '3rem', height: '3rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Mobile Apps',
      description: 'Native and cross-platform mobile applications that deliver exceptional user experiences.',
      features: ['iOS & Android', 'React Native', 'Push Notifications', 'Offline Support'],
    },
    {
      icon: (
        <svg style={{ width: '3rem', height: '3rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      title: 'UI/UX Design',
      description: 'Beautiful, intuitive designs that prioritize user needs and business goals.',
      features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
    },
  ];

  return (
    <>
      <SEO
        title="Home"
        description="Modern web studio creating exceptional digital experiences that drive results and inspire users"
      />
      
      <div className="home-page">
        <Hero />

        {/* Services Section */}
        <section className="services-section">
          <div className="section-background">
            <div className="bg-pattern"></div>
          </div>
          
          <div className="home-container">
            <div className="section-header">
              <div className="section-eyebrow">What We Offer</div>
              <h2 className="section-title">Our Services</h2>
              <div className="title-decoration">
                <span className="decoration-line"></span>
                <span className="decoration-dot"></span>
                <span className="decoration-line"></span>
              </div>
              <p className="section-subtitle">
                We offer comprehensive digital solutions to help your business thrive in the modern world.
              </p>
            </div>

            <div className="services-grid">
              {services.map((service, index) => (
                <div key={index} className="service-card-wrapper" style={{ animationDelay: `${index * 100}ms` }}>
                  <ServiceCard {...service} />
                </div>
              ))}
            </div>

            <div className="section-cta">
              <a href="/services" className="cta-button">
                View All Services
                <svg className="cta-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10h12m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stats-background">
            <div className="stats-orb"></div>
          </div>
          
          <div className="home-container">
            <div className="section-header">
              <div className="section-eyebrow">Our Track Record</div>
              <h2 className="section-title">Why Choose Us</h2>
              <div className="title-decoration">
                <span className="decoration-line"></span>
                <span className="decoration-dot"></span>
                <span className="decoration-line"></span>
              </div>
              <p className="section-subtitle">
                We combine creativity, technology, and strategy to deliver results that matter.
              </p>
            </div>

            <div className="stats-grid">
              {[
                { number: '150+', label: 'Projects Completed' },
                { number: '98%', label: 'Client Satisfaction' },
                { number: '50+', label: 'Team Members' },
                { number: '10+', label: 'Years Experience' },
              ].map((stat, index) => (
                <div key={index} className="stat-card" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                  <div className="stat-bar">
                    <div className="stat-bar-fill" style={{ animationDelay: `${index * 100 + 300}ms` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-background">
            <div className="cta-orb cta-orb-1"></div>
            <div className="cta-orb cta-orb-2"></div>
            <div className="cta-particles"></div>
          </div>
          
          <div className="home-container">
            <div className="cta-content">
              <div className="cta-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="cta-title">Ready to Start Your Project?</h2>
              <p className="cta-subtitle">
                Let's work together to bring your vision to life. Get in touch with our team today.
              </p>
              <div className="cta-buttons">
                <a href="/contact" className="cta-btn cta-btn-primary">
                  Get Started
                  <svg className="btn-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10h12m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                <a href="/about" className="cta-btn cta-btn-secondary">
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        /* Reset and Base */
        * {
          box-sizing: border-box;
        }

        .home-page {
          background: #ffffff;
          overflow-x: hidden;
        }

        /* Hero Section */
        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }

        .hero-background {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .hero-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.4;
          animation: heroFloat 20s ease-in-out infinite;
        }

        .orb-1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.6), transparent);
          top: -200px;
          right: -100px;
        }

        .orb-2 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.5), transparent);
          bottom: -150px;
          left: -100px;
          animation-delay: 7s;
        }

        .orb-3 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(236, 72, 153, 0.4), transparent);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 14s;
        }

        @keyframes heroFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(50px, -50px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
        }

        .hero-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: gridScroll 20s linear infinite;
        }

        @keyframes gridScroll {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        .hero-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
          z-index: 1;
        }

        .hero-content {
          text-align: center;
          animation: heroFadeIn 1s ease-out;
        }

        @keyframes heroFadeIn {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-badge {
          display: inline-block;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #a5b4fc;
          background: rgba(99, 102, 241, 0.2);
          padding: 10px 24px;
          border-radius: 50px;
          margin-bottom: 32px;
          border: 1px solid rgba(165, 180, 252, 0.3);
          backdrop-filter: blur(10px);
          animation: heroFadeIn 1s ease-out 0.2s backwards;
        }

        .hero-title {
          font-size: clamp(2.5rem, 6vw, 5rem);
          font-weight: 900;
          color: #ffffff;
          line-height: 1.1;
          margin: 0 0 32px;
          letter-spacing: -0.03em;
          animation: heroFadeIn 1s ease-out 0.3s backwards;
        }

        .hero-title-gradient {
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline-block;
        }

        .hero-subtitle {
          font-size: clamp(1.125rem, 2vw, 1.5rem);
          color: #cbd5e1;
          line-height: 1.7;
          max-width: 700px;
          margin: 0 auto 48px;
          animation: heroFadeIn 1s ease-out 0.4s backwards;
        }

        .hero-cta-group {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
          animation: heroFadeIn 1s ease-out 0.5s backwards;
        }

        .hero-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 32px;
          font-size: 1.0625rem;
          font-weight: 600;
          text-decoration: none;
          border-radius: 12px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .hero-btn-primary {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
        }

        .hero-btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .hero-btn-primary:hover::before {
          opacity: 1;
        }

        .hero-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(99, 102, 241, 0.5);
        }

        .hero-btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
        }

        .hero-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .btn-icon {
          transition: transform 0.3s ease;
          position: relative;
          z-index: 1;
        }

        .hero-btn:hover .btn-icon {
          transform: translateX(4px);
        }

        .hero-scroll-indicator {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          animation: heroFadeIn 1s ease-out 0.8s backwards;
        }

        .scroll-mouse {
          width: 24px;
          height: 40px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          position: relative;
        }

        .scroll-wheel {
          width: 4px;
          height: 8px;
          background: white;
          border-radius: 2px;
          position: absolute;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
          animation: scrollWheel 2s ease-in-out infinite;
        }

        @keyframes scrollWheel {
          0%, 100% { opacity: 1; top: 8px; }
          50% { opacity: 0.3; top: 20px; }
        }

        .scroll-text {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* Container */
        .home-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Section Header */
        .section-header {
          text-align: center;
          margin-bottom: 64px;
          animation: fadeSlideUp 0.8s ease-out;
        }

        .section-eyebrow {
          display: inline-block;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #6366f1;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
          padding: 8px 20px;
          border-radius: 50px;
          margin-bottom: 20px;
          border: 1px solid rgba(99, 102, 241, 0.2);
        }

        .section-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 24px;
          letter-spacing: -0.02em;
        }

        .title-decoration {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .decoration-line {
          width: 40px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #6366f1, transparent);
        }

        .decoration-dot {
          width: 8px;
          height: 8px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.8); }
        }

        .section-subtitle {
          font-size: clamp(1.0625rem, 2vw, 1.25rem);
          color: #64748b;
          line-height: 1.7;
          max-width: 700px;
          margin: 0 auto;
        }

        /* Services Section */
        .services-section {
          position: relative;
          padding: 120px 0;
          background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
        }

        .section-background {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .bg-pattern {
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.03) 0%, transparent 50%);
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 32px;
          margin-bottom: 64px;
        }

        @media (min-width: 1024px) {
          .services-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .service-card-wrapper {
          animation: fadeSlideUp 0.8s ease-out backwards;
        }

        /* Service Card */
        .service-card {
          height: 100%;
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          transition: transform 0.3s ease;
        }

        .service-card:hover {
          transform: translateY(-8px);
        }

        .service-card-glow {
          position: absolute;
          inset: -2px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899);
          border-radius: 24px;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 0;
        }

        .service-card:hover .service-card-glow {
          opacity: 1;
        }

        .service-card-content {
          position: relative;
          height: 100%;
          background: white;
          border-radius: 24px;
          padding: 40px 32px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          z-index: 1;
        }

        .service-card:hover .service-card-content {
          box-shadow: 0 20px 40px rgba(99, 102, 241, 0.15);
        }

        .service-icon-wrapper {
          margin-bottom: 24px;
        }

        .service-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
          transition: all 0.3s ease;
        }

        .service-card:hover .service-icon {
          transform: scale(1.05) rotate(5deg);
          box-shadow: 0 12px 30px rgba(99, 102, 241, 0.4);
        }

        .service-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 16px;
        }

        .service-description {
          font-size: 1rem;
          color: #64748b;
          line-height: 1.6;
          margin: 0 0 24px;
        }

        .service-features {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.9375rem;
          color: #475569;
          padding: 8px 0;
          border-bottom: 1px solid rgba(226, 232, 240, 0.5);
        }

        .feature-item:last-child {
          border-bottom: none;
        }

        .feature-check {
          flex-shrink: 0;
          color: #6366f1;
          background: rgba(99, 102, 241, 0.1);
          border-radius: 50%;
          padding: 3px;
        }

        .section-cta {
          text-align: center;
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 40px;
          font-size: 1.0625rem;
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          text-decoration: none;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .cta-button::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .cta-button:hover::before {
          opacity: 1;
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(99, 102, 241, 0.4);
        }

        .cta-arrow {
          transition: transform 0.3s ease;
          position: relative;
          z-index: 1;
        }

        .cta-button:hover .cta-arrow {
          transform: translateX(4px);
        }

        /* Stats Section */
        .stats-section {
          position: relative;
          padding: 120px 0;
          background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
        }

        .stats-background {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .stats-orb {
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.08), transparent);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          filter: blur(80px);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 32px;
        }

        @media (min-width: 640px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .stat-card {
          text-align: center;
          padding: 40px 24px;
          background: white;
          border-radius: 20px;
          border: 2px solid rgba(226, 232, 240, 0.6);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          animation: fadeSlideUp 0.8s ease-out backwards;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(99, 102, 241, 0.15);
          border-color: #6366f1;
        }

        .stat-card:hover::before {
          transform: scaleX(1);
        }

        .stat-number {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 12px;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.9375rem;
          font-weight: 500;
          color: #64748b;
          margin-bottom: 16px;
        }

        .stat-bar {
          width: 100%;
          height: 4px;
          background: rgba(99, 102, 241, 0.1);
          border-radius: 2px;
          overflow: hidden;
        }

        .stat-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          border-radius: 2px;
          transform: scaleX(0);
          transform-origin: left;
          animation: barFill 1s ease-out forwards;
        }

        @keyframes barFill {
          to { transform: scaleX(1); }
        }

        /* CTA Section */
        .cta-section {
          position: relative;
          padding: 120px 0;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          overflow: hidden;
        }

        .cta-background {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .cta-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.5;
          animation: floatOrb 15s ease-in-out infinite;
        }

        .cta-orb-1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.6), transparent);
          top: -150px;
          right: -100px;
        }

        .cta-orb-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(236, 72, 153, 0.5), transparent);
          bottom: -100px;
          left: -100px;
          animation-delay: 7s;
        }

        @keyframes floatOrb {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -30px); }
        }

        .cta-particles {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(2px 2px at 20% 30%, white, transparent),
            radial-gradient(2px 2px at 60% 70%, white, transparent),
            radial-gradient(1px 1px at 50% 50%, white, transparent),
            radial-gradient(1px 1px at 80% 10%, white, transparent),
            radial-gradient(2px 2px at 90% 60%, white, transparent),
            radial-gradient(1px 1px at 33% 80%, white, transparent),
            radial-gradient(1px 1px at 15% 85%, white, transparent);
          background-size: 200% 200%;
          background-position: 50% 50%;
          opacity: 0.3;
          animation: particleMove 20s ease-in-out infinite;
        }

        @keyframes particleMove {
          0%, 100% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
        }

        .cta-content {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
          animation: fadeSlideUp 0.8s ease-out;
        }

        .cta-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 32px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2));
          border: 2px solid rgba(99, 102, 241, 0.3);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #a5b4fc;
          backdrop-filter: blur(10px);
          animation: iconFloat 3s ease-in-out infinite;
        }

        @keyframes iconFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .cta-title {
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 800;
          color: white;
          margin: 0 0 24px;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .cta-subtitle {
          font-size: clamp(1.0625rem, 2vw, 1.375rem);
          color: #cbd5e1;
          line-height: 1.7;
          margin: 0 0 48px;
        }

        .cta-buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 32px;
          font-size: 1.0625rem;
          font-weight: 600;
          text-decoration: none;
          border-radius: 12px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .cta-btn-primary {
          background: white;
          color: #6366f1;
          box-shadow: 0 8px 24px rgba(255, 255, 255, 0.2);
        }

        .cta-btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .cta-btn-primary:hover::before {
          opacity: 1;
        }

        .cta-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(255, 255, 255, 0.3);
        }

        .cta-btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
        }

        .cta-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .btn-arrow {
          transition: transform 0.3s ease;
          position: relative;
          z-index: 1;
        }

        .cta-btn:hover .btn-arrow {
          transform: translateX(4px);
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
          .hero-section {
            min-height: 90vh;
            padding: 60px 0;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .hero-cta-group {
            flex-direction: column;
            align-items: stretch;
          }

          .hero-btn {
            justify-content: center;
          }

          .hero-scroll-indicator {
            display: none;
          }

          .services-section,
          .stats-section,
          .cta-section {
            padding: 80px 0;
          }

          .section-header {
            margin-bottom: 48px;
          }

          .services-grid {
            grid-template-columns: 1fr;
            gap: 24px;
            margin-bottom: 48px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: stretch;
          }

          .cta-btn {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .hero-badge {
            font-size: 11px;
            padding: 8px 16px;
          }

          .service-card-content {
            padding: 32px 24px;
          }

          .service-icon {
            width: 64px;
            height: 64px;
          }

          .stat-card {
            padding: 32px 20px;
          }
        }

        /* Focus States for Accessibility */
        .hero-btn:focus-visible,
        .cta-button:focus-visible,
        .cta-btn:focus-visible {
          outline: 3px solid #6366f1;
          outline-offset: 2px;
        }

        /* Smooth Scroll */
        html {
          scroll-behavior: smooth;
        }

        /* Prevent layout shift */
        img, svg {
          display: block;
          max-width: 100%;
        }
      `}</style>
    </>
  );
};

export default Home;