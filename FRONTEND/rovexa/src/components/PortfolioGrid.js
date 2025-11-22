import React from "react";
import PortfolioCard from "./PortfolioCard";

export default function PortfolioGrid({ items }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted fs-5">No portfolio items found.</p>
      </div>
    );
  }

  return (
    <div className="container px-0">
      <div className="row g-4">
        {items.map((item, index) => (
          <div key={item._id} className="col-12 col-md-6 col-lg-4">
            <PortfolioCard item={item} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
}
