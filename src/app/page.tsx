"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [noBtnPosition, setNoBtnPosition] = useState({
    top: "auto",
    left: "auto",
  });
  const [isMoved, setIsMoved] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleYesClick = async () => {
    try {
      // Create FormData for Netlify Forms
      const formData = new FormData();
      formData.append("form-name", "valentine-response");
      formData.append("accepted", "true");
      formData.append("timestamp", new Date().toISOString());

      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as any).toString(),
      });

      router.push("/success");
    } catch (error) {
      console.error("Failed to send response", error);
      router.push("/success");
    }
  };

  const moveNoButton = () => {
    if (!containerRef.current) return;

    // Get container dimensions
    const containerRect = containerRef.current.getBoundingClientRect();

    // Calculate random position within container
    // Subtract button size approx (100px)
    const maxTop = containerRect.height - 100;
    const maxLeft = containerRect.width - 150;

    const randomTop = Math.floor(Math.random() * maxTop);
    const randomLeft = Math.floor(Math.random() * maxLeft);

    setNoBtnPosition({
      top: `${randomTop}px`,
      left: `${randomLeft}px`,
    });
    setIsMoved(true);
  };

  return (
    <div ref={containerRef} className="container">
      {/* Hidden Netlify Form for static analysis */}
      <form name="valentine-response" data-netlify="true" hidden>
        <input type="hidden" name="form-name" value="valentine-response" />
        <input type="text" name="accepted" />
        <input type="text" name="timestamp" />
      </form>

      <div className="content animate-float">
        <h1 className="title">Will you be my Valentine?</h1>
        <p className="subtitle">Because you mean the world to me...</p>

        <div className="button-group">
          <button
            onClick={handleYesClick}
            className="btn btn-yes animate-heartbeat">
            Yes! ❤️
          </button>

          <button
            onMouseEnter={moveNoButton}
            onClick={moveNoButton}
            style={
              isMoved
                ? {
                    position: "absolute",
                    top: noBtnPosition.top,
                    left: noBtnPosition.left,
                  }
                : {}
            }
            className="btn btn-no">
            No 💔
          </button>
        </div>
      </div>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          width: 100vw;
          position: relative;
          overflow: hidden;
        }

        .content {
          text-align: center;
          z-index: 10;
          padding: 2rem;
          background: var(--glass-bg);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          border: 1px solid var(--glass-border);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        }

        .title {
          font-size: 4rem;
          color: var(--dark-red);
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }

        .subtitle {
          font-size: 1.5rem;
          margin-bottom: 3rem;
          color: var(--text-color);
        }

        .button-group {
          display: flex;
          gap: 2rem;
          justify-content: center;
          align-items: center;
        }

        .btn {
          font-size: 1.5rem;
          padding: 1rem 3rem;
          border-radius: 50px;
          transition: all 0.3s ease;
          font-weight: bold;
        }

        .btn-yes {
          background: var(--primary-pink);
          color: white;
          box-shadow: 0 4px 15px rgba(255, 77, 109, 0.4);
        }

        .btn-yes:hover {
          transform: scale(1.1);
          background: var(--dark-red);
        }

        .btn-no {
          background: var(--white);
          color: var(--text-color);
          border: 2px solid var(--primary-pink);
        }
      `}</style>
    </div>
  );
}
