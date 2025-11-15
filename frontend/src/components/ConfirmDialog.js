import React from 'react';
import './ConfirmDialog.css';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', isDangerous = false }) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-dialog-overlay" onClick={onClose}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-dialog-content">
          <h2 className="confirm-dialog-title">{title}</h2>
          <p className="confirm-dialog-message">{message}</p>
        </div>
        <div className="confirm-dialog-actions">
          <button onClick={onClose} className="confirm-dialog-btn cancel-btn">
            {cancelText}
          </button>
          <button 
            onClick={onConfirm} 
            className={`confirm-dialog-btn confirm-btn ${isDangerous ? 'danger' : ''}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
