import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { FaTimes } from 'react-icons/fa';
import './CreateHabitModal.css';

const CreateHabitModal = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other',
    frequency: 'daily',
    color: '#4A90E2'
  });

  const categories = [
    { value: 'health', label: '💪 Health', color: '#E74C3C' },
    { value: 'fitness', label: '🏃 Fitness', color: '#E67E22' },
    { value: 'productivity', label: '📝 Productivity', color: '#3498DB' },
    { value: 'learning', label: '📚 Learning', color: '#9B59B6' },
    { value: 'mindfulness', label: '🧘 Mindfulness', color: '#1ABC9C' },
    { value: 'social', label: '🤝 Social', color: '#F39C12' },
    { value: 'other', label: '🎯 Other', color: '#95A5A6' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (category) => {
    const selectedCategory = categories.find(c => c.value === category);
    setFormData(prev => ({
      ...prev,
      category,
      color: selectedCategory?.color || '#4A90E2'
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Habit</h2>
          <button className="btn-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="habit-form">
          <div className="form-group">
            <label htmlFor="title">Habit Name *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Morning workout, Read 30 minutes"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add more details about your habit..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <div className="category-grid">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  className={`category-option ${formData.category === cat.value ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(cat.value)}
                  style={{
                    borderColor: formData.category === cat.value ? cat.color : '#e0e0e0'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="frequency">Frequency</label>
            <select
              id="frequency"
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Habit
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default CreateHabitModal;
