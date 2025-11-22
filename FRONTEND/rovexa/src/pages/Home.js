import React from 'react';
import Hero from '../components/Hero';
import ServiceCard from '../components/ServiceCard';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

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
      <Hero />

      <section className="py-5 bg-white">
        <div className="container py-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-5"
          >
            <h2 className="display-5 fw-bold mb-3">
              Our Services
            </h2>
            <p className="lead text-muted mx-auto" style={{ maxWidth: '42rem' }}>
              We offer comprehensive digital solutions to help your business thrive in the modern world.
            </p>
          </motion.div>

          <div className="row g-4">
            {services.map((service, index) => (
              <div key={index} className="col-12 col-md-6 col-lg-4">
                <ServiceCard {...service} />
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <Link
              to="/services"
              className="btn btn-primary btn-lg px-5"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container py-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-5"
          >
            <h2 className="display-5 fw-bold mb-3">
              Why Choose Us
            </h2>
            <p className="lead text-muted mx-auto" style={{ maxWidth: '42rem' }}>
              We combine creativity, technology, and strategy to deliver results that matter.
            </p>
          </motion.div>

          <div className="row g-4">
            {[
              { number: '150+', label: 'Projects Completed' },
              { number: '98%', label: 'Client Satisfaction' },
              { number: '50+', label: 'Team Members' },
              { number: '10+', label: 'Years Experience' },
            ].map((stat, index) => (
              <div key={index} className="col-12 col-sm-6 col-lg-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="display-4 fw-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-muted">{stat.label}</div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 bg-primary text-white">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="display-5 fw-bold mb-3">
                  Ready to Start Your Project?
                </h2>
                <p className="lead mb-4" style={{ opacity: 0.9 }}>
                  Let's work together to bring your vision to life. Get in touch with our team today.
                </p>
                <Link
                  to="/contact"
                  className="btn btn-light btn-lg px-5"
                >
                  Get Started
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;