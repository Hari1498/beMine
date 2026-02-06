"use client";

import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="container">
      <div className="content animate-float">
        <h1 className="title">YAY! ❤️</h1>
        <p className="message">
          You just made me the happiest person in the world!
          <br />I promise to cherish you every single day.
        </p>

        <div className="heart-container animate-heartbeat">💖</div>

        <Link href="/promises" className="btn-promises">
          See my promises to you...
        </Link>
      </div>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          text-align: center;
          padding: 2rem;
        }

        .content {
          background: var(--glass-bg);
          backdrop-filter: blur(10px);
          padding: 3rem;
          border-radius: 20px;
          border: 1px solid var(--glass-border);
          max-width: 600px;
        }

        .title {
          font-size: 5rem;
          color: var(--dark-red);
          margin-bottom: 1rem;
        }

        .message {
          font-size: 1.5rem;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .heart-container {
          font-size: 5rem;
          margin: 2rem 0;
        }

        .btn-promises {
          display: inline-block;
          margin-top: 1rem;
          font-size: 1.2rem;
          color: var(--dark-red);
          text-decoration: underline;
          transition: transform 0.3s;
        }

        .btn-promises:hover {
          transform: scale(1.05);
          color: var(--primary-pink);
        }
      `}</style>
    </div>
  );
}
