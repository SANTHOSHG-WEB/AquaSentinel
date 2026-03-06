import { getSensorHistory } from './storageUtils';

/**
 * Knowledge base for water conservation and system maintenance
 */
const KNOWLEDGE_BASE = [
    {
        topic: 'Irrigation',
        content: 'Gardens should be watered early in the morning or late in the evening to reduce evaporation. Soil moisture below 30% usually indicates a need for watering.'
    },
    {
        topic: 'Tank Maintenance',
        content: 'Water tanks should be checked for leaks if the level drops significantly without corresponding usage. Sediment buildup can affect pump efficiency.'
    },
    {
        topic: 'Rainwater Harvesting',
        content: 'During rainfall, ensure filters are clear. Harvesting 1000L of rainwater can sustain a small garden for weeks.'
    },
    {
        topic: 'Leaks',
        content: 'Continuous water flow during inactive hours (e.g., 2 AM - 4 AM) is a strong indicator of a pipe leak or a dripping faucet.'
    }
];

export const getRAGContext = (currentData) => {
    const history = getSensorHistory();
    const recentHistory = history.slice(-10); // Last 10 readings

    const context = {
        currentStatus: {
            tankLevel: `${currentData.tankLevel}%`,
            soilMoisture: `${currentData.soilMoisture}%`,
            isRaining: currentData.isRaining ? 'Yes' : 'No',
            waterFlow: `${currentData.waterFlow} L/min`
        },
        trends: recentHistory.map(h => ({
            time: h.timestamp,
            tank: h.tankLevel,
            moisture: h.soilMoisture,
            flow: h.waterFlow
        })),
        expertKnowledge: KNOWLEDGE_BASE
    };

    return JSON.stringify(context, null, 2);
};
