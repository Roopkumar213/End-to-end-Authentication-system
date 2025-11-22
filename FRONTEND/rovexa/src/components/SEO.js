import { useEffect } from "react";

export default function SEO({ title, description }) {
  useEffect(() => {
    // Set document title
    document.title = title
      ? `${title} | Web Studio`
      : "Web Studio - Creative Digital Solutions";

    // Handle meta description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", description);
    }

    // OPTIONAL: Auto-update social share tags (Open Graph)
    const updateOG = (property, content) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    if (title) updateOG("og:title", title + " | Web Studio");
    if (description) updateOG("og:description", description);

  }, [title, description]);

  return null;
}
