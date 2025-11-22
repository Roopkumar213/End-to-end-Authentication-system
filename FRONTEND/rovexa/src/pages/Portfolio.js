// src/pages/Portfolio.js
import React, { useState, useEffect } from "react";
import PortfolioGrid from "../components/PortfolioGrid";
import { getPortfolio } from "../api/endpoints";
import { samplePortfolio } from "../data/samplePortfolio";
import SEO from "../components/SEO";

export default function Portfolio() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState("All");

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      const data = await getPortfolio();
      setItems(data);
    } catch (err) {
      console.error("Failed to load portfolio:", err);
      setItems(samplePortfolio);
    } finally {
      setLoading(false);
    }
  };

  const allTags = ["All", ...new Set(items.flatMap((i) => i.tags))];
  const filteredItems =
    selectedTag === "All"
      ? items
      : items.filter((i) => i.tags.includes(selectedTag));

  return (
    <>
      <SEO
        title="Portfolio"
        description="Explore our portfolio of successful web and mobile projects across various industries"
      />

      <div className="bg-light min-vh-100">

        {/* HEADER SECTION */}
        <section className="py-5 text-center portfolio-header">
          <div className="container">

            <h1 className="fw-bold display-5 mb-3 fade-up">
              Our Portfolio
            </h1>

            <p className="lead text-muted mx-auto fade-up" style={{ maxWidth: 700 }}>
              Explore our recent projects and see how we’ve helped businesses
              achieve their digital goals.
            </p>

          </div>
        </section>

        {/* FILTER + GRID */}
        <section className="py-5">
          <div className="container">

            {/* TAG FILTER BUTTONS */}
            <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`btn px-4 py-2 rounded-pill ${
                    selectedTag === tag
                      ? "btn-primary text-white"
                      : "btn-outline-secondary"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* LOADING SPINNER */}
            {loading ? (
              <div className="d-flex justify-content-center py-5">
                <div className="spinner-border text-primary" role="status" />
              </div>
            ) : (
              <PortfolioGrid items={filteredItems} />
            )}
          </div>
        </section>
      </div>
    </>
  );
}
