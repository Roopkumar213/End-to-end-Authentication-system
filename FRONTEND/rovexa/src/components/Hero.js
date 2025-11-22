import React from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="py-5 py-md-7 bg-light position-relative overflow-hidden">
      <div className="container">
        <div className="row align-items-center g-5">

          {/* TEXT SECTION */}
          <div className="col-12 col-lg-6 animate-slide-left">
            <h1 className="display-4 fw-bold mb-3">
              Crafting Digital Experiences That Matter
            </h1>

            <p className="lead text-muted mb-4">
              We design and develop exceptional web and mobile applications that
              help businesses grow and users thrive.
            </p>

            <div className="d-flex flex-column flex-sm-row gap-3">
              <Link to="/portfolio" className="btn btn-primary btn-lg px-4">
                View Our Work
              </Link>

              <Link
                to="/contact"
                className="btn btn-outline-primary btn-lg px-4"
              >
                Get In Touch
              </Link>
            </div>
          </div>

          {/* IMAGE SECTION */}
          <div className="col-12 col-lg-6 position-relative animate-slide-right">
            <div className="position-relative z-2">
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80"
                alt="Team collaboration"
                className="img-fluid rounded shadow"
              />
            </div>

            {/* Decorative boxes */}
            <div
              className="position-absolute rounded bg-primary bg-opacity-25"
              style={{
                width: "180px",
                height: "180px",
                bottom: "-30px",
                right: "-30px",
                zIndex: 0,
              }}
            />

            <div
              className="position-absolute rounded bg-primary bg-opacity-10"
              style={{
                width: "180px",
                height: "180px",
                top: "-30px",
                left: "-30px",
                zIndex: 0,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
