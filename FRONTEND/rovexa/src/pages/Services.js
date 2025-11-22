// src/pages/Services.js
import React from "react";
import ServiceCard from "../components/ServiceCard";
import SEO from "../components/SEO";

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

      <div className="bg-light min-vh-100">

        {/* HERO */}
        <section className="py-5 text-center">
          <div className="container">
            <h1 className="display-5 fw-bold mb-3 fade-up">Our Services</h1>
            <p className="lead text-muted mx-auto fade-up" style={{ maxWidth: 800 }}>
              We provide end-to-end digital solutions tailored to your business needs. From concept to deployment, we're with you every step of the way.
            </p>
          </div>
        </section>

        {/* SERVICES GRID */}
        <section className="py-5">
          <div className="container">
            <div className="row g-4">
              {services.map((service, idx) => (
                <div key={idx} className="col-12 col-md-6 col-lg-4">
                  <ServiceCard {...service} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section className="py-5 bg-white">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="h3 fw-bold fade-up">Our Process</h2>
              <p className="text-muted mx-auto" style={{ maxWidth: 700 }}>
                We follow a proven methodology to deliver exceptional results on time and within budget.
              </p>
            </div>

            <div className="row g-4">
              {[
                { step: '01', title: 'Discovery', description: 'Understanding your goals and requirements' },
                { step: '02', title: 'Design', description: 'Creating beautiful and functional designs' },
                { step: '03', title: 'Development', description: 'Building with best practices and modern tech' },
                { step: '04', title: 'Launch', description: 'Deploying and providing ongoing support' },
              ].map((phase, i) => (
                <div key={i} className="col-12 col-md-6 col-lg-3 text-center">
                  <div className="p-4 border rounded">
                    <div className="display-6 fw-bold text-primary mb-3">{phase.step}</div>
                    <h5 className="fw-semibold mb-2">{phase.title}</h5>
                    <p className="text-muted mb-0">{phase.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default Services;
