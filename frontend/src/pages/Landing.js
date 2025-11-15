import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFire, FaUsers, FaTrophy, FaMedal, FaChartLine, FaArrowRight, FaStar, FaBolt, FaHeart, FaRocket, FaCrown } from 'react-icons/fa';
import './Landing.css';

const Landing = () => {
  useEffect(() => {
    // Simple fade-in animations using CSS classes
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    
    if (heroTitle) heroTitle.style.animation = 'fadeInDown 1.2s ease-out forwards';
    if (heroSubtitle) heroSubtitle.style.animation = 'fadeInUp 1s ease-out 0.3s forwards';
    heroButtons.forEach((btn, i) => {
      btn.style.animation = `fadeInUp 0.8s ease-out ${0.5 + i * 0.1}s forwards`;
    });

    // Animate on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.feature-card, .step').forEach(el => {
      el.style.opacity = '0';
      observer.observe(el);
    });

    const titleObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'scaleIn 0.6s ease-out forwards';
          titleObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.section-title').forEach(title => {
      title.style.opacity = '0';
      titleObserver.observe(title);
    });

    return () => {
      observer.disconnect();
      titleObserver.disconnect();
    };
  }, []);

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Build Better Habits <span className="highlight">Together</span>
              </h1>
              <p className="hero-subtitle">
                Turn your goals into achievements with gamification and social accountability.
                Join squads, earn badges, and level up your life!
              </p>
              <div className="hero-buttons">
                <Link to="/register" className="btn btn-primary btn-large">
                  Get Started Free <FaArrowRight />
                </Link>
                <Link to="/about" className="btn btn-outline btn-large">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="hero-badges">
              <FaTrophy className="floating-badge badge-1" />
              <FaMedal className="floating-badge badge-2" />
              <FaFire className="floating-badge badge-3" />
              <FaStar className="floating-badge badge-4" />
              <FaBolt className="floating-badge badge-5" />
              <FaHeart className="floating-badge badge-6" />
              <FaRocket className="floating-badge badge-7" />
              <FaCrown className="floating-badge badge-8" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why HabitForge?</h2>
          <p className="section-subtitle">
            Traditional habit trackers lack motivation. We make it fun and social!
          </p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaUsers />
              </div>
              <h3>Squad System</h3>
              <p>
                Join or create small groups to work together toward shared goals.
                Accountability meets community!
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaTrophy />
              </div>
              <h3>Gamification</h3>
              <p>
                Earn points, unlock badges, and level up as you complete your habits.
                Make progress visible and rewarding!
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaMedal />
              </div>
              <h3>Achievements</h3>
              <p>
                Celebrate milestones with special badges and rewards.
                Every streak counts!
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaChartLine />
              </div>
              <h3>Track Progress</h3>
              <p>
                Visualize your journey with streak calendars and progress charts.
                See how far you've come!
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaFire />
              </div>
              <h3>Live Activity Feed</h3>
              <p>
                See what your squad members are achieving in real-time.
                Cheer them on and stay motivated!
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FaUsers />
              </div>
              <h3>Leaderboards</h3>
              <p>
                Friendly competition within your squad keeps everyone engaged
                and pushing forward together!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Create Your Habits</h3>
              <p>Set up personal habits you want to build - fitness, learning, mindfulness, and more.</p>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <h3>Join a Squad</h3>
              <p>Find like-minded people or create your own squad with friends.</p>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <h3>Complete & Earn</h3>
              <p>Check off habits daily, earn points, and watch your streak grow!</p>
            </div>

            <div className="step">
              <div className="step-number">4</div>
              <h3>Level Up Together</h3>
              <p>Celebrate wins, unlock badges, and motivate your squad to reach team goals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Habits?</h2>
            <p>Join thousands of users building better lives together!</p>
            <Link to="/register" className="btn btn-primary btn-large">
              Start Your Journey <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
