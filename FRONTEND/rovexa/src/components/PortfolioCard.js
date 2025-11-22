// src/components/PortfolioCard.js
import React from "react";
import { Link } from "react-router-dom";

export default function PortfolioCard({ item, index = 0 }) {
  const delay = `${index * 0.08}s`;

  return (
    <div
      className="portfolio-card"
      style={{ animationDelay: delay }}
    >
      <Link to={`/portfolio/${item._id}`} className="text-decoration-none">
        <div className="card h-100 shadow-sm overflow-hidden">
          <div className="card-img-top-wrapper" style={{ height: 220, overflow: "hidden" }}>
            <img
              src={item.imageUrl}
              alt={item.title}
              className="card-img-top object-fit-cover"
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .35s ease" }}
            />
          </div>

          <div className="card-body">
            <h5 className="card-title mb-2">{item.title}</h5>
            <p className="card-text text-muted mb-3" style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>
              {item.description}
            </p>

            <div className="d-flex flex-wrap gap-2">
              {Array.isArray(item.tags) && item.tags.map((tag, i) => (
                <span key={i} className="badge bg-primary bg-opacity-10 text-primary">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
