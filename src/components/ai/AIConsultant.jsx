import React, { useState, useEffect, useRef } from 'react';
import { Bot, Lightbulb, ChevronRight, Info, TrendingUp, AlertTriangle, RotateCw } from 'lucide-react';
import { analyzeAquasentinelData } from '../../utils/aiService';
import { getRAGContext } from '../../utils/ragUtils';
import './AIConsultant.css';

const AIConsultant = ({ currentData }) => {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false); // Default to false
    const [showReasoning, setShowReasoning] = useState(null);
    const lastTriggerRef = useRef({ tankLevel: 0, soilMoisture: 0, time: 0 });

    const getInsights = async (force = false) => {
        const now = Date.now();
        const { tankLevel, soilMoisture, time } = lastTriggerRef.current;

        // Force manual or strictly check thresholds
        const tankDiff = Math.abs(currentData.tankLevel - tankLevel);
        const moistureDiff = Math.abs(currentData.soilMoisture - soilMoisture);
        const timeDiff = now - time;

        const shouldTrigger = force || (tankDiff >= 20 || moistureDiff >= 20 || timeDiff >= 1800000);

        if (!shouldTrigger && analysis) return;

        setLoading(true);
        const context = getRAGContext(currentData);
        const result = await analyzeAquasentinelData(context);

        if (result) {
            setAnalysis(result);
            lastTriggerRef.current = {
                tankLevel: currentData.tankLevel,
                soilMoisture: currentData.soilMoisture,
                time: now
            };
        }
        setLoading(false);
    };

    // No automatic triggers on mount anymore to save API quota
    useEffect(() => {
        // Only log mount
        console.log('AI Consultant Ready (Manual Mode)');
    }, []);

    if (!analysis && !loading) {
        return (
            <div className="ai-consultant-section empty-state">
                <div className="ai-intel-card start-card">
                    <Bot className="ai-icon large" />
                    <h3>Aquasentinel Water Intelligence</h3>
                    <p>Click below to generate a predictive usage report and optimization plan.</p>
                    <button className="btn-start-analysis" onClick={() => getInsights(true)}>
                        <RotateCw size={18} />
                        Generate AI Report
                    </button>
                </div>
            </div>
        );
    }

    if (loading && !analysis) {
        return (
            <div className="ai-consultant-loading">
                <div className="loader"></div>
                <p>AI Agent Analyzing System State...</p>
            </div>
        );
    }

    if (!analysis) return null;

    return (
        <div className="ai-consultant-section">
            <header className="ai-header">
                <div className="ai-title-row">
                    <Bot className="ai-icon" />
                    <div className="ai-title-group">
                        <h2>Water Intelligence Agent</h2>
                        <span className="ai-status">Predictive Analysis Active</span>
                    </div>
                </div>
                <button className={`btn-refresh-ai ${loading ? 'spinning' : ''}`} onClick={() => getInsights(true)} disabled={loading}>
                    <RotateCw size={16} />
                    <span>{loading ? 'Analyzing...' : 'Refresh AI'}</span>
                </button>
            </header>

            <div className="ai-intelligence-grid">
                {/* Prediction Card */}
                {analysis.prediction && (
                    <div className="ai-intel-card prediction">
                        <div className="intel-header">
                            <TrendingUp size={18} />
                            <h3>Tomorrow's Forecast</h3>
                        </div>
                        <div className="intel-body">
                            <div className="predicted-value">
                                {analysis.prediction.tomorrowLiters}L
                                <span className="unit">Est. Usage</span>
                            </div>
                            <p className="reasoning">{analysis.prediction.reasoning}</p>
                        </div>
                    </div>
                )}

                {/* Optimization Alert */}
                {analysis.optimization && (
                    <div className="ai-intel-card optimization">
                        <div className="intel-header">
                            <AlertTriangle size={18} />
                            <h3>Efficiency Alert</h3>
                        </div>
                        <div className="intel-body">
                            <div className="usage-area">
                                <span>Peak Area:</span> {analysis.optimization.highestUsageArea}
                            </div>
                            <div className="savings">
                                <span>Target Savings:</span> {analysis.optimization.potentialSavings}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="ai-recommendations-list">
                {analysis.recommendations?.map((item, index) => (
                    <div key={item.id} className={`ai-recommendation-card ${item.status}`} style={{ animationDelay: `${index * 100}ms` }}>
                        <div className="rec-header">
                            <Lightbulb size={20} className="bulb-icon" />
                            <div className="rec-info">
                                <h4>{item.title}</h4>
                                <p>{item.message}</p>
                            </div>
                            <div className="rec-impact">
                                <span className="impact-label">Impact</span>
                                <span className="impact-value">{item.impact}</span>
                            </div>
                        </div>

                        <div className="rec-actions">
                            <button className="btn-reasoning" onClick={() => setShowReasoning(showReasoning === item.id ? null : item.id)}>
                                <Info size={14} />
                                {showReasoning === item.id ? 'Hide Reasoning' : 'How was this calculated?'}
                            </button>
                            <button className="btn-apply">
                                Apply Suggestion <ChevronRight size={16} />
                            </button>
                        </div>

                        {showReasoning === item.id && (
                            <div className="reasoning-drawer animate-slide-down">
                                <p>{item.explanation}</p>
                                <div className="confidence">Confidence: <strong>{item.confidence}%</strong></div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AIConsultant;
