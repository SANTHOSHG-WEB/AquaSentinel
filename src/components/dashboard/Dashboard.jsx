import React, { useState } from 'react';
import { ref, update } from 'firebase/database';
import { db } from '../../utils/firebase';
import { Droplets, Sprout, Activity, Zap, Award, Trophy, Clock, LogOut, CloudRain, Waves, AlertTriangle } from 'lucide-react';
import GlassCard from '../common/GlassCard';
import SmartAvatar from '../common/SmartAvatar';
import Analytics from './Analytics';
import Rewards from '../gamification/Rewards';
import AIConsultant from '../ai/AIConsultant';
import AIChat from '../ai/AIChat';
import QualityGauge from './QualityGauge';
import WeatherWidget from './WeatherWidget';
import WaterMaps from './WaterMaps';
import RelayControl from './RelayControl';
import SensorHistory from './SensorHistory';
import SensorSimulator from './SensorSimulator';
import { useSensorData } from '../../hooks/useSensorData';
import './Dashboard.css';

const Dashboard = ({ onLogout }) => {
    const data = useSensorData('device_001');
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    const [activeTab, setActiveTab] = useState('overview');

    const toggleGardenMotor = () => {
        const motorRef = ref(db, `devices/device_001/data/motors`);
        update(motorRef, {
            gardenMotor: !data.motors.gardenMotor,
            autoMode: false
        });
    };

    const stats = {
        ecoPoints: 1250,
        pws: 88,
    };

    if (data.loading) {
        return (
            <div className="loading-screen">
                <Activity className="pulse-icon" size={48} />
                <p>Connecting to Aquasentinel Hub...</p>
            </div>
        );
    }

    const renderOverview = () => (
        <div className="dashboard-grid tab-content active">
            <GlassCard className="avatar-card" delay={50}>
                <SmartAvatar
                    state={data.tankLevel < 20 ? 'critical' : (data.tankLevel > 70 ? 'super' : 'warning')}
                    message={
                        data.tankLevel < 20 ? "I'm so thirsty! Please fill the tank!" :
                            (data.tankLevel > 70 ? "Tank is full! I feel powerful!" : "Water levels are looking good!")
                    }
                />
            </GlassCard>

            <GlassCard title="Water Tank" icon={Droplets} delay={100}>
                <div className="sensor-value-container">
                    <div className="circular-progress" style={{ '--value': `${data.tankLevel}%` }}>
                        <span className="value">{data.tankLevel}%</span>
                    </div>
                    <div className="sensor-details">
                        <p>Status: <span className={data.tankLevel > 20 ? "status-ok" : "status-warn"}>
                            {data.tankLevel > 20 ? "Optimal" : "Low Level"}
                        </span></p>
                        <p>Motor: <span className={data.motors.tankMotor ? "status-on" : "status-off"}>
                            {data.motors.tankMotor ? "RUNNING" : "Standby"}
                        </span></p>
                    </div>
                </div>
            </GlassCard>

            <GlassCard title="Rain Sensor" icon={CloudRain} delay={225}>
                <div className="sensor-value-container">
                    <div className="circular-progress" style={{ '--value': `${data.rainValue}%`, '--color': '#4A90E2' }}>
                        <span className="value">{data.rainValue}mm</span>
                    </div>
                    <div className="sensor-details">
                        <p>Status: <span className={data.isRaining ? "status-on" : "status-off"}>
                            {data.isRaining ? "RAINING" : "Clear Skies"}
                        </span></p>
                        <p>Intensity: {data.rainValue > 0 ? (data.rainValue > 50 ? "Heavy" : "Light") : "None"}</p>
                    </div>
                </div>
            </GlassCard>

            <GlassCard title="Soil Moisture" icon={Sprout} delay={250}>
                <div className="sensor-value-container">
                    <div className="linear-progress-wrapper">
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${data.soilMoisture}%` }}></div>
                        </div>
                        <span className="value">{data.soilMoisture}%</span>
                    </div>
                    <div className="sensor-actions">
                        <button
                            className={`btn-action ${data.motors.gardenMotor ? 'active' : ''}`}
                            onClick={toggleGardenMotor}
                        >
                            {data.motors.gardenMotor ? 'Stop Irrigation' : 'Irrigate Now'}
                        </button>
                    </div>
                </div>
            </GlassCard>

            <GlassCard title="Water Flow" icon={Waves} delay={275}>
                <div className="sensor-value-container">
                    <div className="circular-progress" style={{ '--value': `${Math.min(data.waterFlow, 100)}%`, '--color': '#14b8a6' }}>
                        <span className="value">{data.waterFlow}<span style={{ fontSize: '1rem' }}>L/m</span></span>
                    </div>
                    <div className="sensor-details">
                        <p>Status: <span className={data.waterFlow > 0 ? "status-on" : "status-off"}>
                            {data.waterFlow > 0 ? "ACTIVE" : "Idle"}
                        </span></p>
                        <p>Usage Rate: {data.waterFlow > 50 ? "High" : "Normal"}</p>
                    </div>
                </div>
            </GlassCard>

            <GlassCard title="Pipeline Status" icon={AlertTriangle} delay={300} className={data.leakage ? "alert-card pulse-alert" : ""}>
                <div className="sensor-value-container" style={{ alignItems: 'center' }}>
                    <div className={`status-badge ${data.leakage ? 'danger' : 'safe'}`}>
                        {data.leakage ? (
                            <>
                                <AlertTriangle size={32} className="pulse-icon" />
                                <h3>LEAK DETECTED</h3>
                            </>
                        ) : (
                            <>
                                <Activity size={32} />
                                <h3>SYSTEM SECURE</h3>
                            </>
                        )}
                    </div>
                    <div className="sensor-details" style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <p>{data.leakage ? "Immediate attention required! Pressure drop detected." : "All pipelines operating at normal pressure."}</p>
                    </div>
                </div>
            </GlassCard>

            <QualityGauge />
            <WeatherWidget />
        </div>
    );

    const renderAnalysis = () => (
        <div className="dashboard-analysis-view tab-content active">
            <AIConsultant currentData={data} />

            <div className="bottom-section">
                <section className="side-panel">
                    <GlassCard title="Personal Water Score" icon={Zap} delay={100}>
                        <div className="pws-container">
                            <div className="pws-value">{stats.pws}</div>
                            <div className="grade">Grade A</div>
                        </div>
                    </GlassCard>

                    <GlassCard title="Leaderboard" icon={Trophy} delay={200}>
                        <div className="leaderboard-preview">
                            <div className="leader-item">
                                <span className="rank">1</span>
                                <span className="name">User_492</span>
                                <span className="points">2450</span>
                            </div>
                            <div className="leader-item current">
                                <span className="rank">8</span>
                                <span className="name">You</span>
                                <span className="points">{stats.ecoPoints}</span>
                            </div>
                        </div>
                    </GlassCard>
                </section>
                <Analytics />
            </div>
            <Rewards />
        </div>
    );

    const renderControl = () => (
        <div className="dashboard-grid tab-content active">
            <RelayControl motors={data.motors} />
            <WaterMaps />
            <SensorSimulator />
        </div>
    );

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-info">
                    <h1 className="gradient-text">Aquasentinel</h1>
                    <p className="subtitle">Smart Water Intelligence</p>
                </div>
                <div className="header-actions">
                    <div className="status-indicator">
                        <Activity size={18} className="pulse-icon" />
                        <span>Systems Online</span>
                    </div>
                    <div className="user-profile">
                        <Award size={24} className="badge-icon" />
                        <span className="points">{stats.ecoPoints} pts</span>
                    </div>
                    <button className="btn-icon-only" onClick={() => setIsHistoryOpen(true)} title="View Sensor History">
                        <Clock size={20} />
                    </button>
                    <button className="btn-icon-only" onClick={onLogout} title="Logout">
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <nav className="dashboard-nav">
                <button
                    className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    Dashboard
                </button>
                <button
                    className={`nav-tab ${activeTab === 'analysis' ? 'active' : ''}`}
                    onClick={() => setActiveTab('analysis')}
                >
                    Water Analysis
                </button>
                <button
                    className={`nav-tab ${activeTab === 'control' ? 'active' : ''}`}
                    onClick={() => setActiveTab('control')}
                >
                    System Control
                </button>
            </nav>

            <div className="tab-container">
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'analysis' && renderAnalysis()}
                {activeTab === 'control' && renderControl()}
            </div>

            <SensorHistory
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
            />

            <AIChat currentData={data} />
        </div>
    );
};

export default Dashboard;
