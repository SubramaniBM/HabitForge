import React from 'react';
import { FaFire, FaUsers, FaHeart, FaLightbulb, FaBullseye, FaHandshake, FaGamepad, FaAward } from 'react-icons/fa';
import './About.css';

const About = () => {
  return (
    <div className="about-page page-container">
      <div className="container">
        <div className="page-header text-center">
          <h1 className="page-title">About HabitForge</h1>
          <p className="page-subtitle">
            Building better habits through gamification and community
          </p>
        </div>

        <div className="about-content">
          <section className="about-section card">
            <div className="section-icon">
              <FaFire />
            </div>
            <h2>Our Mission</h2>
            <p>
              HabitForge was created to solve the main weakness of traditional habit trackers — 
              lack of external motivation. We believe that building lasting habits is easier 
              and more fun when you have a supportive community cheering you on.
            </p>
            <p>
              Our mission is to make habit formation engaging, effective, and social. Through
              gamification and squad-based accountability, we transform everyday goals into
              a collaborative and rewarding experience.
            </p>
          </section>

          <section className="about-section card">
            <div className="section-icon">
              <FaLightbulb />
            </div>
            <h2>Why HabitForge?</h2>
            <p>
              Research shows that social accountability significantly increases the likelihood
              of achieving goals. When you share your progress with others and receive positive
              reinforcement, you're more likely to stay consistent.
            </p>
            <p>
              HabitForge combines this principle with gamification elements like points, levels,
              and badges to create a positive reinforcement loop that keeps you motivated day
              after day.
            </p>
          </section>

          <section className="about-section card">
            <div className="section-icon">
              <FaUsers />
            </div>
            <h2>The Squad System</h2>
            <p>
              At the heart of HabitForge is the Squad system. Squads are small groups of 
              people working toward similar goals. Within your squad, you can:
            </p>
            <ul className="feature-list">
              <li>View real-time activity feeds of member achievements</li>
              <li>Compete on friendly leaderboards</li>
              <li>Work together toward weekly team goals</li>
              <li>Give "Cheers" to celebrate each other's wins</li>
            </ul>
            <p>
              Whether you join a public squad or create a private one with friends, the 
              squad system ensures you're never on your habit journey alone.
            </p>
          </section>

          <section className="about-section card">
            <div className="section-icon">
              <FaHeart />
            </div>
            <h2>Built for Students, by Students</h2>
            <p>
              This project was developed as part of our Web Technologies course, combining
              modern web development practices with user-centered design. We used:
            </p>
            <ul className="tech-list">
              <li><strong>Frontend:</strong> React, React Router, Axios</li>
              <li><strong>Backend:</strong> Node.js, Express.js</li>
              <li><strong>Database:</strong> MongoDB with Mongoose</li>
              <li><strong>Authentication:</strong> JWT (JSON Web Tokens)</li>
            </ul>
            <p>
              Our goal was to create a full-stack web application that solves a real problem
              while demonstrating proficiency in modern web development technologies.
            </p>
          </section>

          <section className="values-section">
            <h2 className="text-center mb-4">Our Core Values</h2>
            <div className="values-grid">
              <div className="value-card">
                <h3><FaBullseye /> Goal-Oriented</h3>
                <p>Every feature is designed to help you achieve your goals</p>
              </div>
              <div className="value-card">
                <h3>🤝 Community-First</h3>
                <p>Building habits is better together</p>
              </div>
              <div className="value-card">
                <h3>🎮 Fun & Engaging</h3>
                <p>Gamification makes progress enjoyable</p>
              </div>
              <div className="value-card">
                <h3>📈 Progress-Focused</h3>
                <p>Celebrate small wins, achieve big results</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
