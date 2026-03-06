import React from 'react';
import { Award, Star, Flame, Droplet } from 'lucide-react';
import GlassCard from '../common/GlassCard';
import './Rewards.css';

const Rewards = () => {
    const badges = [
        { id: 1, name: 'Water Saver', icon: Droplet, level: 'Gold', progress: 100, color: '#FFD700' },
        { id: 2, name: 'Eco Warrior', icon: Star, level: 'Silver', progress: 65, color: '#C0C0C0' },
        { id: 3, name: 'Leak Detective', icon: Award, level: 'Bronze', progress: 30, color: '#CD7F32' },
        { id: 4, name: 'Streak Master', icon: Flame, level: 'None', progress: 80, color: '#94a3b8' },
    ];

    return (
        <div className="rewards-section">
            <h2 className="section-title">Achievements & Badges</h2>
            <div className="badges-grid">
                {badges.map((badge, index) => (
                    <GlassCard key={badge.id} delay={index * 100} className="badge-card">
                        <div className="badge-icon-wrapper" style={{ color: badge.color }}>
                            <badge.icon size={48} />
                        </div>
                        <div className="badge-info">
                            <h3>{badge.name}</h3>
                            <p className="badge-level">{badge.level} Achievement</p>
                            <div className="progress-mini">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${badge.progress}%`, background: badge.color }}
                                />
                            </div>
                            <span className="progress-text">{badge.progress}% to next rank</span>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
};

export default Rewards;
