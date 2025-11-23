import React from "react";

// Mock SEO component for demo
const SEO = ({ title, description }) => null;

// ServiceCard Component with Premium Design
const ServiceCard = ({ icon, title, description, features }) => {
  return (
    <div className="service-card">
      <div className="service-card-inner">
        <div className="service-icon-wrapper">
          <div className="service-icon">
            {icon}
          </div>
        </div>
        <h3 className="service-title">{title}</h3>
        <p className="service-description">{description}</p>
        <ul className="service-features">
          {features.map((feature, idx) => (
            <li key={idx} className="service-feature-item">
              <svg className="feature-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Services = () => {
  const services = [
    {
      icon: (
        <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Web Development",
      description: "Custom web applications built with modern technologies for optimal performance and user experience.",
      features: ["React & Next.js", "Node.js & Express", "Database Design", "API Development", "Cloud Deployment", "Performance Optimization"],
    },
    {
      icon: (
        <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: "Mobile Apps",
      description: "Native and cross-platform mobile applications that deliver exceptional user experiences.",
      features: ["iOS Development", "Android Development", "React Native", "Flutter", "App Store Optimization", "Push Notifications"],
    },
    {
      icon: (
        <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      title: "UI/UX Design",
      description: "Beautiful, intuitive designs that prioritize user needs and business goals.",
      features: ["User Research", "Wireframing", "High-Fidelity Prototypes", "Design Systems", "Usability Testing", "Accessibility Audits"],
    },
    {
      icon: (
        <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "E-Commerce Solutions",
      description: "Complete e-commerce platforms with payment integration and inventory management.",
      features: ["Shopify & WooCommerce", "Custom Solutions", "Payment Gateway Integration", "Inventory Management", "Analytics & Reporting", "Marketing Automation"],
    },
    {
      icon: (
        <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Digital Marketing",
      description: "Data-driven marketing strategies to grow your online presence and reach your audience.",
      features: ["SEO Optimization", "Content Marketing", "Social Media Strategy", "PPC Campaigns", "Email Marketing", "Analytics & Insights"],
    },
    {
      icon: (
        <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Maintenance & Support",
      description: "Ongoing maintenance and support to keep your applications running smoothly.",
      features: ["24/7 Monitoring", "Security Updates", "Performance Tuning", "Bug Fixes", "Feature Enhancements", "Technical Support"],
    },
  ];

  return (
    <>
      <SEO
        title="Services"
        description="Comprehensive digital solutions including web development, mobile apps, UI/UX design, and more"
      />

      <div className="services-page">
        {/* Background Elements */}
        <div className="bg-gradient-orb orb-1"></div>
        <div className="bg-gradient-orb orb-2"></div>
        <div className="bg-gradient-orb orb-3"></div>

        {/* HERO */}
        <section className="services-hero">
          <div className="container">
            <div className="hero-content fade-up">
              <span className="eyebrow-label">What We Do</span>
              <h1 className="hero-title">Our Services</h1>
              <div className="title-accent"></div>
              <p className="hero-description">
                We provide end-to-end digital solutions tailored to your business needs. From concept to deployment, we're with you every step of the way.
              </p>
            </div>
          </div>
        </section>

        {/* SERVICES GRID */}
        <section className="services-grid-section">
          <div className="container">
            <div className="services-grid">
              {services.map((service, idx) => (
                <div key={idx} className="service-card-wrapper" style={{ animationDelay: `${idx * 100}ms` }}>
                  <ServiceCard {...service} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section className="process-section">
          <div className="container">
            <div className="process-header fade-up">
              <h2 className="process-title">Our Process</h2>
              <p className="process-description">
                We follow a proven methodology to deliver exceptional results on time and within budget.
              </p>
            </div>

            <div className="process-timeline">
              <div className="timeline-line"></div>
              <div className="process-steps">
                {[
                  { step: '01', title: 'Discovery', description: 'Understanding your goals and requirements' },
                  { step: '02', title: 'Design', description: 'Creating beautiful and functional designs' },
                  { step: '03', title: 'Development', description: 'Building with best practices and modern tech' },
                  { step: '04', title: 'Launch', description: 'Deploying and providing ongoing support' },
                ].map((phase, i) => (
                  <div key={i} className="process-step" style={{ animationDelay: `${i * 150}ms` }}>
                    <div className="step-card">
                      <div className="step-number-badge">{phase.step}</div>
                      <h5 className="step-title">{phase.title}</h5>
                      <p className="step-description">{phase.description}</p>
                    </div>
                  </div>
                ))}
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

        /* Page Background */
        .services-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          position: relative;
          overflow-x: hidden;
        }

        /* Animated Background Orbs */
        .bg-gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
          pointer-events: none;
          z-index: 0;
          animation: float 20s ease-in-out infinite;
        }

        .orb-1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.3), transparent);
          top: -200px;
          right: -200px;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.25), transparent);
          bottom: -150px;
          left: -150px;
          animation-delay: 5s;
        }

        .orb-3 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(236, 72, 153, 0.2), transparent);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 10s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(5deg); }
          66% { transform: translate(-20px, 20px) rotate(-5deg); }
        }

        /* Container */
        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
          z-index: 1;
        }

        /* Hero Section */
        .services-hero {
          padding: 120px 0 80px;
          text-align: center;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .eyebrow-label {
          display: inline-block;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #6366f1;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
          padding: 8px 20px;
          border-radius: 50px;
          margin-bottom: 24px;
          border: 1px solid rgba(99, 102, 241, 0.2);
        }

        .hero-title {
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 20px;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .title-accent {
          width: 80px;
          height: 4px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899);
          margin: 0 auto 32px;
          border-radius: 2px;
        }

        .hero-description {
          font-size: clamp(1.125rem, 2vw, 1.25rem);
          color: #64748b;
          line-height: 1.7;
          margin: 0;
        }

        /* Services Grid Section */
        .services-grid-section {
          padding: 40px 0 100px;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 32px;
        }

        @media (min-width: 768px) {
          .services-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .services-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .service-card-wrapper {
          animation: fadeSlideUp 0.6s ease-out backwards;
        }

        /* Service Card */
        .service-card {
          height: 100%;
          perspective: 1000px;
        }

        .service-card-inner {
          height: 100%;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 40px 32px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02), 0 12px 24px rgba(0, 0, 0, 0.04);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .service-card-inner::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05));
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 24px;
        }

        .service-card:hover .service-card-inner {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(99, 102, 241, 0.15), 0 24px 48px rgba(0, 0, 0, 0.1);
          border-color: rgba(99, 102, 241, 0.3);
        }

        .service-card:hover .service-card-inner::before {
          opacity: 1;
        }

        /* Service Icon */
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
          position: relative;
        }

        .service-icon::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899);
          border-radius: 22px;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .service-card:hover .service-icon {
          transform: scale(1.05) rotate(5deg);
          box-shadow: 0 12px 30px rgba(99, 102, 241, 0.4);
        }

        .service-card:hover .service-icon::before {
          opacity: 1;
        }

        /* Service Content */
        .service-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 16px;
          line-height: 1.3;
        }

        .service-description {
          font-size: 1rem;
          color: #64748b;
          line-height: 1.6;
          margin: 0 0 24px;
        }

        /* Service Features */
        .service-features {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .service-feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.9375rem;
          color: #475569;
          padding: 8px 0;
          border-bottom: 1px solid rgba(226, 232, 240, 0.5);
          transition: all 0.2s ease;
        }

        .service-feature-item:last-child {
          border-bottom: none;
        }

        .service-card:hover .service-feature-item {
          color: #1e293b;
        }

        .feature-icon {
          flex-shrink: 0;
          width: 18px;
          height: 18px;
          color: #6366f1;
          background: rgba(99, 102, 241, 0.1);
          border-radius: 50%;
          padding: 3px;
        }

        /* Process Section */
        .process-section {
          padding: 100px 0;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.9));
          backdrop-filter: blur(20px);
          position: relative;
        }

        .process-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 80px;
        }

        .process-title {
          font-size: clamp(2rem, 4vw, 2.5rem);
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 16px;
          letter-spacing: -0.02em;
        }

        .process-description {
          font-size: 1.125rem;
          color: #64748b;
          line-height: 1.7;
          margin: 0;
        }

        /* Timeline */
        .process-timeline {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
        }

        .timeline-line {
          position: absolute;
          top: 60px;
          left: 5%;
          right: 5%;
          height: 2px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899, #6366f1);
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
          display: none;
        }

        @media (min-width: 1024px) {
          .timeline-line {
            display: block;
          }
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .process-steps {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        @media (min-width: 768px) {
          .process-steps {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .process-steps {
            grid-template-columns: repeat(4, 1fr);
            gap: 32px;
          }
        }

        .process-step {
          animation: fadeSlideUp 0.6s ease-out backwards;
          position: relative;
        }

        .step-card {
          background: white;
          border-radius: 20px;
          padding: 32px 24px;
          text-align: center;
          border: 2px solid rgba(226, 232, 240, 0.6);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .step-card::before {
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

        .step-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(99, 102, 241, 0.15);
          border-color: #6366f1;
        }

        .step-card:hover::before {
          transform: scaleX(1);
        }

        .step-number-badge {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 20px;
          box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
          transition: transform 0.3s ease;
        }

        .step-card:hover .step-number-badge {
          transform: scale(1.1);
        }

        .step-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 12px;
        }

        .step-description {
          font-size: 0.9375rem;
          color: #64748b;
          line-height: 1.6;
          margin: 0;
        }

        /* Animations */
        .fade-up {
          animation: fadeSlideUp 0.8s ease-out;
        }

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

        /* Mobile Timeline Accent */
        @media (max-width: 1023px) {
          .process-step::before {
            content: '';
            position: absolute;
            left: 24px;
            top: 0;
            bottom: 0;
            width: 2px;
            background: linear-gradient(180deg, #6366f1, #8b5cf6);
            opacity: 0.3;
          }

          .process-step:first-child::before {
            top: 50%;
          }

          .process-step:last-child::before {
            bottom: 50%;
          }

          .step-card {
            margin-left: 40px;
          }
        }

        /* Responsive Typography */
        @media (max-width: 768px) {
          .services-hero {
            padding: 80px 0 60px;
          }

          .services-grid-section {
            padding: 20px 0 60px;
          }

          .process-section {
            padding: 60px 0;
          }

          .services-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        /* Focus Styles for Accessibility */
        .service-card:focus-within .service-card-inner,
        .step-card:focus-within {
          outline: 3px solid #6366f1;
          outline-offset: 2px;
        }
      `}</style>
    </>
  );
};

export default Services;