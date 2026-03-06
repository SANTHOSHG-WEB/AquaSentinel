import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import GlassCard from '../common/GlassCard';
import './WaterMaps.css';

const WaterMaps = () => {
    return (
        <GlassCard title="Irrigation Zones & Sensors" icon={MapPin}>
            <div className="map-placeholder">
                <div className="map-overlay">
                    <Navigation className="nav-icon" />
                    <p>Interactive Map Initializing...</p>
                </div>
                <div className="zone-legend">
                    <div className="legend-item"><span className="dot green"></span> Optimal</div>
                    <div className="legend-item"><span className="dot yellow"></span> Dry</div>
                    <div className="legend-item"><span className="dot red"></span> Critical</div>
                </div>
                {/* Simplified SVG Map representation */}
                <svg viewBox="0 0 400 200" className="garden-map-svg">
                    <rect x="20" y="20" width="100" height="80" rx="10" className="zone-rect optimal" />
                    <rect x="140" y="20" width="100" height="80" rx="10" className="zone-rect dry" />
                    <rect x="260" y="20" width="100" height="80" rx="10" className="zone-rect optimal" />
                    <circle cx="70" cy="60" r="5" className="sensor-point" />
                    <circle cx="190" cy="60" r="5" className="sensor-point" />
                    <circle cx="310" cy="60" r="5" className="sensor-point pulse" />
                </svg>
            </div>
            <button className="btn-full-map">Open Satellite View</button>
        </GlassCard>
    );
};

export default WaterMaps;
