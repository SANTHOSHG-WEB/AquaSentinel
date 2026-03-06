import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import GlassCard from '../common/GlassCard';
import './Analytics.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Analytics = () => {
    const lineData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                fill: true,
                label: 'Water Usage (L)',
                data: [420, 380, 450, 310, 290, 520, 480],
                borderColor: '#3AA6B9',
                backgroundColor: 'rgba(58, 166, 185, 0.1)',
                tension: 0.4,
            },
            {
                label: 'Savings (L)',
                data: [50, 60, 40, 80, 90, 30, 45],
                borderColor: '#7ED957',
                backgroundColor: 'rgba(126, 217, 87, 0.1)',
                tension: 0.4,
            }
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#94a3b8', font: { family: 'Poppins' } }
            },
        },
        scales: {
            y: {
                ticks: { color: '#94a3b8' },
                grid: { color: 'rgba(255, 255, 255, 0.05)' }
            },
            x: {
                ticks: { color: '#94a3b8' },
                grid: { display: false }
            }
        }
    };

    return (
        <div className="analytics-grid">
            <GlassCard title="Weekly Consumption Trends" className="chart-card">
                <Line data={lineData} options={options} />
            </GlassCard>

            <div className="stats-mini-grid">
                <GlassCard title="Avg. Daily Usage" delay={100}>
                    <div className="stat-value">385L</div>
                    <div className="stat-trend negative">↑ 12% vs last week</div>
                </GlassCard>
                <GlassCard title="Monthly Savings" delay={200}>
                    <div className="stat-value">1.2k L</div>
                    <div className="stat-trend positive">↓ 5% waste reduction</div>
                </GlassCard>
            </div>
        </div>
    );
};

export default Analytics;
