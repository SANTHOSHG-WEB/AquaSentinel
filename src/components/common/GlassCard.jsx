import React from 'react';
import './GlassCard.css';

const GlassCard = ({ children, className = '', title, icon: Icon, delay = 0 }) => {
  return (
    <div 
      className={`glass-card ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {(title || Icon) && (
        <div className="card-header">
          {Icon && <Icon className="card-icon" size={24} />}
          {title && <h2 className="card-title">{title}</h2>}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;
