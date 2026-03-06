import React from 'react';
import { Cloud, Droplets, Sun, Wind, CloudRain } from 'lucide-react';
import GlassCard from '../common/GlassCard';
import './WeatherWidget.css';

const WeatherWidget = () => {
    const forecast = [
        { time: 'Now', icon: Sun, chance: 0 },
        { time: '2 PM', icon: Cloud, chance: 15 },
        { time: '5 PM', icon: CloudRain, chance: 85 },
        { time: '8 PM', icon: CloudRain, chance: 40 },
    ];

    return (
        <GlassCard title="Water Outlook" icon={Cloud}>
            <div className="weather-main">
                <div className="current-weather">
                    <Sun size={48} className="weather-icon-large" />
                    <div className="temp-group">
                        <span className="current-temp">Clear</span>
                        <span className="condition">High Solar Potential</span>
                    </div>
                </div>
            </div>

            <div className="forecast-timeline">
                {forecast.map((item, i) => (
                    <div key={i} className="forecast-item">
                        <span className="f-time">{item.time}</span>
                        <item.icon size={20} className="f-icon" />
                        <span className="f-chance">{item.chance}% Rain</span>
                    </div>
                ))}
            </div>

            <div className="weather-alert">
                <CloudRain size={16} />
                <span>Rain expected at 5:00 PM. System will auto-pause irrigation.</span>
            </div>
        </GlassCard>
    );
};

export default WeatherWidget;
