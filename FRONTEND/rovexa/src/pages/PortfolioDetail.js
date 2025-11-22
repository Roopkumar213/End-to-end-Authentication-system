// src/pages/PortfolioDetail.js
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getPortfolioItem } from "../api/endpoints";
import { samplePortfolio } from "../data/samplePortfolio";
import SEO from "../components/SEO";

export default function PortfolioDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadItem = async () => {
    setLoading(true);
    try {
      const data = await getPortfolioItem(id);
      setItem(data);
    } catch (error) {
      console.error("Failed to load portfolio item:", error);
      const fallback = samplePortfolio.find((p) => String(p._id) === String(id));
      if (fallback) {
        setItem(fallback);
      } else {
        navigate("/portfolio");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
        <div className="spinner-border text-primary" role="status" aria-hidden="true" />
      </div>
    );
  }

  if (!item) return null;

  const {
    title = "Untitled Project",
    description = "",
    tags = [],
    imageUrl = "",
    gallery = [],
    role = "",
    tech = [],
    liveUrl = "",
    repoUrl = "",
  } = item;

  return (
    <>
      <SEO title={title} description={description} />

      <div className="bg-light min-vh-100">
        <section className="py-5">
          <div className="container">

            <div className="mb-4">
              <Link to="/portfolio" className="text-primary text-decoration-none">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="me-2" aria-hidden>
                  <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7 7-7" />
                </svg>
                Back to Portfolio
              </Link>
            </div>

            <div className="mb-4">
              <h1 className="display-5 fw-bold">{title}</h1>
              <p className="text-muted lead">{description}</p>
            </div>

            {/* Tags */}
            <div className="mb-4">
              {tags && tags.length > 0 ? (
                tags.map((tag, i) => (
                  <span key={i} className="badge bg-primary bg-opacity-10 text-primary me-2">
                    {tag}
                  </span>
                ))
              ) : (
                <span className="badge bg-secondary">No tags</span>
              )}
            </div>

            {/* Main image */}
            <div className="mb-5">
              {imageUrl ? (
                <div className="rounded overflow-hidden shadow-sm">
                  <img src={imageUrl} alt={title} className="img-fluid w-100" />
                </div>
              ) : (
                <div className="d-flex align-items-center justify-content-center rounded bg-secondary bg-opacity-10" style={{ height: 320 }}>
                  <div className="text-muted">No preview available</div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="row">
              <div className="col-12">
                <h2 className="h5 fw-bold mb-3">Project Overview</h2>
                <p className="text-muted mb-4">{description}</p>

                <h3 className="h6 fw-bold mb-3">Key Features</h3>
                <ul className="list-unstyled mb-4">
                  <li className="d-flex mb-2">
                    <svg width="20" height="20" fill="currentColor" className="me-2 text-primary" viewBox="0 0 20 20" aria-hidden>
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>Responsive design optimized for all devices and screen sizes</div>
                  </li>
                  <li className="d-flex mb-2">
                    <svg width="20" height="20" fill="currentColor" className="me-2 text-primary" viewBox="0 0 20 20" aria-hidden>
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>Modern UI with intuitive user experience and smooth interactions</div>
                  </li>
                  <li className="d-flex mb-2">
                    <svg width="20" height="20" fill="currentColor" className="me-2 text-primary" viewBox="0 0 20 20" aria-hidden>
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>Performance optimizations and accessibility considerations</div>
                  </li>
                </ul>

                <h3 className="h6 fw-bold mb-2">My Role & Responsibilities</h3>
                <p className="text-muted mb-4">{role || "Contributor — responsible for design, development, and deployment."}</p>

                <h3 className="h6 fw-bold mb-2">Tech Stack</h3>
                <div className="mb-4">
                  {tech && tech.length > 0 ? (
                    tech.map((t, i) => (
                      <span key={i} className="badge bg-secondary text-dark me-2 mb-2">{t}</span>
                    ))
                  ) : (
                    <span className="badge bg-secondary">Not specified</span>
                  )}
                </div>

                {(liveUrl || repoUrl) && (
                  <div className="mb-4 d-flex flex-wrap gap-2">
                    {liveUrl && (
                      <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary me-2 mb-2">
                        View Live
                      </a>
                    )}
                    {repoUrl && (
                      <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary mb-2">
                        View Repo
                      </a>
                    )}
                  </div>
                )}

                {gallery && gallery.length > 0 && (
                  <>
                    <h3 className="h6 fw-bold mb-3">Gallery</h3>
                    <div className="row g-3 mb-4">
                      {gallery.map((g, idx) => (
                        <div key={idx} className="col-12 col-sm-6 col-lg-4">
                          <div className="rounded overflow-hidden shadow-sm">
                            <img src={g} alt={`${title} screenshot ${idx + 1}`} className="img-fluid" style={{ height: 180, objectFit: "cover", width: "100%" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <div className="d-flex align-items-center justify-content-between mt-5">
                  <button
                    onClick={() => window.history.back()}
                    className="btn btn-outline-secondary"
                  >
                    Go Back
                  </button>

                  <div className="text-muted small">
                    Updated: {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
