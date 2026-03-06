import React from 'react';
import { Droplets, Thermometer, Waves } from 'lucide-react';
import GlassCard from '../common/GlassCard';
import './QualityGauge.css';

const QualityGauge = ({ turbidity = 2.4, ph = 7.2, temp = 24 }) => {
    const getQualityStatus = () => {
        if (turbidity < 5) return { label: 'Excellent', color: '#22c55e' };
        if (turbidity < 10) return { label: 'Medium', color: '#eab308' };
        return { label: 'Poor', color: '#ef4444' };
    };

    const status = getQualityStatus();

    return (
        <GlassCard title="Water Quality Metrics" icon={Waves}>
            <div className="quality-metrics-grid">
                <div className="metric-item">
                    <div className="metric-icon" style={{ background: 'rgba(58, 166, 185, 0.1)', color: '#3AA6B9' }}>
                        <Droplets size={20} />
                    </div>
                    <div className="metric-data">
                        <span className="label">Turbidity</span>
                        <span className="value">{turbidity} <small>NTU</small></span>
                    </div>
                </div>

                <div className="metric-item">
                    <div className="metric-icon" style={{ background: 'rgba(126, 217, 87, 0.1)', color: '#7ED957' }}>
                        <Waves size={20} />
                    </div>
                    <div className="metric-data">
                        <span className="label">pH Level</span>
                        <span className="value">{ph}</span>
                    </div>
                </div>

                <div className="metric-item">
                    <div className="metric-icon" style={{ background: 'rgba(234, 179, 8, 0.1)', color: '#eab308' }}>
                        <Thermometer size={20} />
                    </div>
                    <div className="metric-data">
                        <span className="label">Temperature</span>
                        <span className="value">{temp}°C</span>
                    </div>
                </div>
            </div>

            <div className="quality-status-banner" style={{ borderColor: status.color }}>
                <div className="banner-dot" style={{ background: status.color }} />
                <span>Overall Quality: <strong>{status.label}</strong></span>
            </div>

            <div className="usage-suggestion">
                <p>Recommended: <strong>Drinking & Household</strong></p>
            </div>
        </GlassCard>
    );
};

export default QualityGauge;
