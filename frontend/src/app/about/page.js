"use client";
import Link from "next/link";
import Image from "next/image";
import "./about.css";

export default function About() {
  return (
    <main className="about-page">
      {/* Background Image */}
      <div className="background-image">
        <Image src="/bg.png" alt="Background" fill objectFit="cover" priority />
      </div>

      {/* Header */}
      <header className="header">
        <Link href="/" className="logo">Scanner</Link>
        <nav className="navbar">
          <Link href="/" className="">Home</Link>
          <Link href="/about" className="active">About</Link>
        </nav>
      </header>

      {/* About Section */}
      <div className="about">
        <div className="about-content">
          <h1>About Our Scanner</h1>
          <h3>Ensuring Web Security</h3>
          <p>
            Our vulnerability scanner detects security threats, providing
            comprehensive reports and recommendations.
          </p>
          <p>
            Trusted by professionals worldwide, our tool offers real-time
            scanning and security analysis.
          </p>
          <Link href="/" className="contact-button">Back to Home</Link>
        </div>
      </div>
    </main>
  );
}
