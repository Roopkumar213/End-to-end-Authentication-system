// src/components/ServiceCard.js
import React from "react";

export default function ServiceCard({ icon, title, description, features }) {
  return (
    <div className="service-card card shadow-sm h-100 border-0">
      <div className="card-body p-4">
        
        {/* Icon */}
        <div className="text-primary mb-3" style={{ fontSize: "2rem" }}>
          {icon}
        </div>

        {/* Title */}
        <h3 className="h4 fw-bold mb-3">{title}</h3>

        {/* Description */}
        <p className="text-muted mb-4">{description}</p>

        {/* Features */}
        <ul className="list-unstyled">
          {features.map((feature, index) => (
            <li key={index} className="d-flex align-items-start mb-2">
              <svg
                className="text-primary me-2 mt-1 flex-shrink-0"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-muted">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
