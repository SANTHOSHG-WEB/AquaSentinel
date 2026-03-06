import React, { useState, useEffect } from 'react';
import { Clock, Trash2, X, Calendar } from 'lucide-react';
import { getSensorHistory, clearSensorHistory } from '../../utils/storageUtils';
import './SensorHistory.css';

const SensorHistory = ({ isOpen, onClose }) => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (isOpen) {
            setHistory(getSensorHistory().reverse()); // Show latest first
        }
    }, [isOpen]);

    const handleClear = () => {
        if (window.confirm('Are you sure you want to clear all sensor history?')) {
            clearSensorHistory();
            setHistory([]);
        }
    };

    if (!isOpen) return null;

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString();
    };

    return (
        <div className="history-overlay" onClick={onClose}>
            <div className="history-modal" onClick={e => e.stopPropagation()}>
                <header className="history-header">
                    <div className="title-group">
                        <Clock className="header-icon" />
                        <h2>Sensor Timeline</h2>
                    </div>
                    <div className="header-actions">
                        <button className="btn-clear" onClick={handleClear} title="Clear All History">
                            <Trash2 size={18} />
                            <span>Clear</span>
                        </button>
                        <button className="btn-close" onClick={onClose}>
                            <X size={24} />
                        </button>
                    </div>
                </header>

                <div className="history-content">
                    {history.length === 0 ? (
                        <div className="empty-history">
                            <Calendar size={48} />
                            <p>No historical data recorded yet.</p>
                            <span>Data is stored locally as it arrives.</span>
                        </div>
                    ) : (
                        <div className="table-wrapper">
                            <table className="history-table">
                                <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>Tank</th>
                                        <th>Moisture</th>
                                        <th>Rain</th>
                                        <th>Flow</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((item, index) => (
                                        <tr key={index}>
                                            <td className="time-col">{formatDate(item.timestamp)}</td>
                                            <td>{item.tankLevel}%</td>
                                            <td>{item.soilMoisture}%</td>
                                            <td>
                                                <span className={`status-pill ${item.isRaining ? 'rain' : 'clear'}`}>
                                                    {item.isRaining ? 'Raining' : 'Clear'}
                                                </span>
                                            </td>
                                            <td>{item.waterFlow} L/m</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SensorHistory;
