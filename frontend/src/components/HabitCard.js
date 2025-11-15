import React from 'react';
import { FaCheck, FaFire, FaTrophy, FaTrash } from 'react-icons/fa';
import './HabitCard.css';

const HabitCard = ({ habit, onComplete, onDelete }) => {
  const isCompletedToday = () => {
    if (!habit.completions || habit.completions.length === 0) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastCompletion = new Date(habit.completions[habit.completions.length - 1].date);
    lastCompletion.setHours(0, 0, 0, 0);
    
    return today.getTime() === lastCompletion.getTime();
  };

  const completed = isCompletedToday();

  const getCategoryIcon = (category) => {
    const icons = {
      health: '💪',
      fitness: '🏃',
      productivity: '📝',
      learning: '📚',
      mindfulness: '🧘',
      social: '🤝',
      other: '🎯'
    };
    return icons[category] || '🎯';
  };

  return (
    <div className={`habit-card card ${completed ? 'completed' : ''}`}>
      <button 
        className="delete-habit-btn"
        onClick={() => onDelete && onDelete(habit._id)}
        title="Delete habit"
      >
        <FaTrash />
      </button>
      
      <div className="habit-header">
        <div className="habit-icon" style={{ backgroundColor: habit.color }}>
          {getCategoryIcon(habit.category)}
        </div>
        <div className="habit-info">
          <h3 className="habit-title">{habit.title}</h3>
          {habit.description && (
            <p className="habit-description">{habit.description}</p>
          )}
        </div>
      </div>

      <div className="habit-stats">
        <div className="habit-stat">
          <FaFire className="streak-icon" />
          <span className="streak-value">{habit.currentStreak}</span>
          <span className="streak-label">day streak</span>
        </div>
        <div className="habit-stat">
          <FaTrophy className="trophy-icon" />
          <span className="streak-value">{habit.longestStreak}</span>
          <span className="streak-label">best</span>
        </div>
      </div>

      <button
        className={`btn-complete ${completed ? 'btn-completed' : 'btn-incomplete'}`}
        onClick={() => !completed && onComplete(habit._id)}
        disabled={completed}
      >
        <FaCheck />
        {completed ? 'Completed Today!' : 'Mark Complete'}
      </button>

      {habit.currentStreak > 0 && (
        <div className="habit-footer">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${Math.min((habit.currentStreak / 30) * 100, 100)}%` }}
            />
          </div>
          <span className="progress-text">
            {habit.currentStreak >= 30 ? '30+ days!' : `${30 - habit.currentStreak} days to milestone`}
          </span>
        </div>
      )}
    </div>
  );
};

export default HabitCard;
