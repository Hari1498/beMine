"use client";

import Link from "next/link";

export default function PromisesPage() {
  const promises = [
    "I promise to love you, even when you're hangry. 🍔",
    "I promise to always listen to your stories, no matter how many times you tell them. 👂",
    "I promise to be your biggest cheerleader in everything you do. 🎉",
    "I promise to hold your hand through the scary parts of movies (and life). 🤝",
    "I promise to always make your coffee just the way you like it. ☕",
    "I promise to love you more with every passing day. ❤️",
  ];

  return (
    <div className="container">
      <h1 className="title">My Promises to You</h1>

      <div className="grid">
        {promises.map((promise, index) => (
          <div
            key={index}
            className="card animate-float"
            style={{ animationDelay: `${index * 0.2}s` }}>
            <p>{promise}</p>
          </div>
        ))}
      </div>

      <Link href="/" className="back-link">
        Home 🏠
      </Link>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 4rem 2rem;
          text-align: center;
        }

        .title {
          font-size: 4rem;
          color: var(--dark-red);
          margin-bottom: 3rem;
          text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.5);
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto 3rem auto;
        }

        .card {
          background: var(--glass-bg);
          backdrop-filter: blur(5px);
          padding: 2rem;
          border-radius: 15px;
          border: 1px solid var(--glass-border);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          font-size: 1.25rem;
          color: var(--text-color);
          transition: transform 0.3s ease;
        }

        .card:hover {
          transform: translateY(-5px) scale(1.02);
          background: rgba(255, 255, 255, 0.6);
        }

        .back-link {
          display: inline-block;
          margin-top: 2rem;
          color: var(--dark-red);
          font-size: 1.2rem;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          background: var(--glass-bg);
        }
      `}</style>
    </div>
  );
}
