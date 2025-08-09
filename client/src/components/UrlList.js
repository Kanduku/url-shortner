import React from "react";
import "./UrlList.css";

function UrlList({ urls }) {
  // Copy to clipboard handler
const handleCopy = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      // Modern secure context clipboard API
      await navigator.clipboard.writeText(text);
      showCopySuccess();
    } else {
      // Fallback method
      const textarea = document.createElement("textarea");
      textarea.value = text;
      // Avoid scrolling to bottom
      textarea.style.position = "fixed";
      textarea.style.top = "-9999px";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      const successful = document.execCommand("copy");
      if (successful) {
        showCopySuccess();
      } else {
        showCopyError();
      }
      document.body.removeChild(textarea);
    }
  } catch (err) {
    showCopyError();
  }
};

function showCopySuccess() {
  // You can replace this with a custom tooltip or UI feedback
  alert("Copied to clipboard!");
}

function showCopyError() {
  alert("Failed to copy!");
}


  // Share handler (uses Web Share API)
  const handleShare = (url, original) => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this short URL",
          text: original,
          url: url,
        })
        .catch(() => alert("Sharing failed or was cancelled."));
    } else {
      alert("Sharing not supported in this browser.");
    }
  };

  return (
     <div className="mobile-simulator">
      <ul className="url-list">
        {urls.map((url) => (
          <li key={url.short_code} className="url-item">
          <a
            href={url.full_short_url}
            target="_blank"
            rel="noreferrer"
            className="short-url"
            style={{ display: "inline-block", maxWidth: "100%" }}
          >
            {url.full_short_url}
          </a>

          <div style={{ margin: "6px 0 0", fontWeight: "600" }}>→</div>

          <div
            className="original-url"
            style={{ marginTop: "4px", wordBreak: "break-word" }}
          >
            {url.original_url}
          </div>

        

          {/* Buttons container */}
          <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
            <button
              className="copy-button"
              onClick={() => handleCopy(url.full_short_url)}
              aria-label="Copy short URL"
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#007aff",
                color: "#fff",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Copy
            </button>

            <button
              className="share-button"
              onClick={() => handleShare(url.full_short_url, url.original_url)}
              aria-label="Share short URL"
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#34c759",
                color: "#fff",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Share
            </button>
          </div>
        </li>
      ))}
    </ul>
     </div>
  );
}

export default UrlList;
