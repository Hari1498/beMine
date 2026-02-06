"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Home() {
  const router = useRouter();
  const [noBtnPosition, setNoBtnPosition] = useState({
    top: "auto",
    left: "auto",
  });
  const [isMoved, setIsMoved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [media, setMedia] = useState<{ content: string; type: string } | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleYesClick = () => {
    setShowModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        toast.error("File size too big! Please keep it under 4MB. ❤️");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setMedia({
          content: reader.result as string,
          type: file.type,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const submitResponse = async () => {
    if (!media) {
      toast.error(
        "Please upload a cute video/photo! I really want to see you! 🥺📸",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await fetch("/api/response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accepted: true,
          message,
          media_content: media?.content,
          media_type: media?.type,
        }),
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
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-float">
            <h2>Send me a love note? 💌</h2>
            <textarea
              placeholder="Tell me something sweet..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="message-input"
            />

            <div className="file-upload">
              <label htmlFor="file-upload" className="custom-file-upload">
                {media
                  ? "You look amazing! 😍"
                  : "Open Camera & Take a Shot! 📸"}
              </label>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                accept="image/*,video/*"
                capture="user"
              />
            </div>

            <button
              onClick={submitResponse}
              disabled={isSubmitting}
              className="btn-submit">
              {isSubmitting ? "Sending... 🚀" : "Send My Love ❤️"}
            </button>
          </div>
        </div>
      )}

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

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 100;
        }

        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: 20px;
          text-align: center;
          width: 90%;
          max-width: 400px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .message-input {
          width: 100%;
          height: 100px;
          margin: 1rem 0;
          padding: 0.5rem;
          border-radius: 10px;
          border: 1px solid #ccc;
          font-family: inherit;
        }

        .file-upload input {
          display: none;
        }

        .custom-file-upload {
          display: inline-block;
          padding: 6px 12px;
          cursor: pointer;
          background: var(--soft-pink);
          border-radius: 5px;
          margin-bottom: 1rem;
          font-weight: bold;
          color: var(--dark-red);
        }

        .btn-submit {
          background: var(--primary-pink);
          color: white;
          padding: 0.8rem 2rem;
          border-radius: 50px;
          font-size: 1.2rem;
          width: 100%;
          transition: background 0.3s;
        }

        .btn-submit:hover {
          background: var(--dark-red);
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
