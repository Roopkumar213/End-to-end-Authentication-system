import React from "react";
import { Link } from "react-router-dom";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero-section">
      {/* Animated background elements */}
      <div className="hero-bg-blob hero-bg-blob-1"></div>
      <div className="hero-bg-blob hero-bg-blob-2"></div>
      <div className="hero-bg-blob hero-bg-blob-3"></div>
      
      <div className="container hero-container">
        <div className="row align-items-center g-5 hero-row">

          {/* TEXT SECTION */}
          <div className="col-12 col-lg-6 hero-text-col">
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-dot"></span>
              Web Studio • Product & Engineering Partner
            </div>

            <h1 className="hero-heading">
              Crafting Digital Experiences That Matter
            </h1>

            <p className="hero-subheading">
              We design and develop exceptional web and mobile applications that
              help businesses grow and users thrive.
            </p>

            <div className="hero-buttons">
              <Link to="/portfolio" className="hero-btn hero-btn-primary">
                View Our Work
                <span className="hero-btn-shine"></span>
              </Link>

              <Link to="/contact" className="hero-btn hero-btn-secondary">
                Get In Touch
              </Link>
            </div>

            {/* Stat badges */}
            <div className="hero-stats">
              <div className="hero-stat-card">
                <div className="hero-stat-value">10+</div>
                <div className="hero-stat-label">Projects Delivered</div>
              </div>
              <div className="hero-stat-card">
                <div className="hero-stat-value">★ 5.0</div>
                <div className="hero-stat-label">Trusted by Startups</div>
              </div>
            </div>
          </div>

          {/* IMAGE SECTION */}
          <div className="col-12 col-lg-6 hero-image-col">
            <div className="hero-image-wrapper">
              {/* Main image card */}
              <div className="hero-image-card">
                <img
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80"
                  alt="Team collaboration"
                  className="hero-image"
                />
                
                {/* Floating status badge */}
                <div className="hero-image-badge">
                  <span className="hero-badge-dot"></span>
                  Live Dashboard
                </div>
              </div>

              {/* Decorative gradient shapes */}
              <div className="hero-deco-shape hero-deco-shape-1"></div>
              <div className="hero-deco-shape hero-deco-shape-2"></div>
              <div className="hero-deco-glow"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}