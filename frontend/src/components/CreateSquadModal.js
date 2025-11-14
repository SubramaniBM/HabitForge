import React, { useState } from 'react';
import { FaTimes, FaUsers, FaGlobe, FaLock } from 'react-icons/fa';
import './CreateSquadModal.css';

const CreateSquadModal = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'mixed',
    icon: '🎯',
    isPublic: true,
    maxMembers: 10
  });

  const categories = ['fitness', 'productivity', 'learning', 'wellness', 'mixed'];
  const icons = ['🎯', '🔥', '💪', '📚', '🧘', '🎨', '💻', '🏃', '🌟', '⚡'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onCreate(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Squad</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">Squad Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter squad name..."
              required
              maxLength={50}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What is this squad about?"
              rows={3}
              maxLength={200}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="maxMembers">Max Members</label>
              <input
                type="number"
                id="maxMembers"
                name="maxMembers"
                value={formData.maxMembers}
                onChange={handleChange}
                min={2}
                max={50}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Squad Icon</label>
            <div className="icon-selector">
              {icons.map(icon => (
                <button
                  key={icon}
                  type="button"
                  className={`icon-option ${formData.icon === icon ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, icon })}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
              />
              <span className="checkbox-text">
                {formData.isPublic ? (
                  <><FaGlobe /> Public Squad (Anyone can join)</>
                ) : (
                  <><FaLock /> Private Squad (Invite only)</>
                )}
              </span>
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <FaUsers /> Create Squad
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSquadModal;
