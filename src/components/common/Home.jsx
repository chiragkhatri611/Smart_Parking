import React from 'react'
import { Link } from 'react-router-dom'
import { HomeNav } from "./HomeNav";
import './Home.css'

export const Home = () => {
  return (
    <>
      <HomeNav />
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Smart Parking Solutions for Modern Cities</h1>
          <p>Experience hassle-free parking with our innovative system. Find, reserve, and pay for parking spots in real-time, all from your smartphone.</p>
          <div className="hero-buttons">
            <Link to="/signup" className="btn">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-outline">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <div className="feature-box">
            <h3>Real-time Availability</h3>
            <p>Get instant updates on parking spot availability. No more driving around in circles looking for a space.</p>
          </div>
          <div className="feature-box">
            <h3>Easy Reservations</h3>
            <p>Book your parking spot in advance and arrive stress-free. Your spot will be waiting for you.</p>
          </div>
          <div className="feature-box">
            <h3>Secure Payments</h3>
            <p>Multiple payment options with secure transactions. Pay for parking with just a few taps.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-container">
          <div className="stat-item">
            <h2>10K+</h2>
            <p>Active Users</p>
          </div>
          <div className="stat-item">
            <h2>5K+</h2>
            <p>Parking Spots</p>
          </div>
          <div className="stat-item">
            <h2>98%</h2>
            <p>User Satisfaction</p>
          </div>
          <div className="stat-item">
            <h2>24/7</h2>
            <p>Customer Support</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="testimonials-container">
          <h2>What Our Users Say</h2>
          <div className="testimonial-grid">
            <div className="testimonial-card">
              <p className="testimonial-content">"This app has completely changed how I park in the city. No more stress about finding a spot!"</p>
              <p className="testimonial-author">- Sarah Johnson</p>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-content">"The real-time updates are incredibly accurate. I've never had to circle around looking for parking since using this app."</p>
              <p className="testimonial-author">- Michael Chen</p>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-content">"As a business owner, this has helped my customers find parking near my store. It's been a game-changer!"</p>
              <p className="testimonial-author">- David Wilson</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-container">
          <h2>Ready to Experience Smart Parking?</h2>
          <p>Join thousands of satisfied users who have made parking stress-free.</p>
          <div className="hero-buttons">
            <Link to="/signup" className="btn">
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About Us</h3>
            <ul>
              <li><Link to="/about">Our Story</Link></li>
              <li><Link to="/team">Our Team</Link></li>
              <li><Link to="/careers">Careers</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Support</h3>
            <ul>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/help">Help Center</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Legal</h3>
            <ul>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/cookies">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 Smart Parking System. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
};
