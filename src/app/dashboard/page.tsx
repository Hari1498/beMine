"use client";

import { useEffect, useState } from "react";

interface ResponseData {
  id: number;
  accepted: boolean;
  timestamp: string;
  message?: string;
  media_content?: string;
  media_type?: string;
}

export default function Dashboard() {
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/response")
      .then((res) => res.json())
      .then((data) => {
        setResponses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load data", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading Love Notes... ❤️</div>;

  return (
    <div className="dashboard-container">
      <h1 className="title">Her Responses 💌</h1>

      {responses.length === 0 ? (
        <p className="no-data">No responses yet. Keep waiting! 🕰️</p>
      ) : (
        <div className="grid">
          {responses.map((res) => (
            <div key={res.id} className="card">
              <div className="header">
                <span className="badge">Accepted ✅</span>
                <span className="timestamp">
                  {new Date(res.timestamp).toLocaleString()}
                </span>
              </div>

              {res.message && <p className="message">"{res.message}"</p>}

              {res.media_content && (
                <div className="media-preview">
                  {res.media_type?.startsWith("image") ? (
                    <img src={res.media_content} alt="Upload" />
                  ) : res.media_type?.startsWith("video") ? (
                    <video src={res.media_content} controls />
                  ) : (
                    <p>Unsupported Media</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .dashboard-container {
          min-height: 100vh;
          padding: 2rem;
          background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
          font-family: "Inter", sans-serif;
        }

        .title {
          text-align: center;
          font-family: "Dancing Script", cursive;
          color: #d63384;
          font-size: 3rem;
          margin-bottom: 2rem;
        }

        .loading,
        .no-data {
          text-align: center;
          font-size: 1.5rem;
          color: #666;
          margin-top: 3rem;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .card {
          background: white;
          padding: 1.5rem;
          border-radius: 15px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border: 1px solid #eee;
          transition: transform 0.2s;
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          font-size: 0.85rem;
          color: #888;
        }

        .badge {
          background: #d1fae5;
          color: #065f46;
          padding: 0.25rem 0.5rem;
          border-radius: 999px;
          font-weight: bold;
        }

        .message {
          font-size: 1.1rem;
          color: #333;
          font-style: italic;
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .media-preview {
          margin-top: 1rem;
          border-radius: 10px;
          overflow: hidden;
          background: #000;
        }

        img,
        video {
          width: 100%;
          display: block;
          max-height: 300px;
          object-fit: cover;
        }
      `}</style>
    </div>
  );
}
