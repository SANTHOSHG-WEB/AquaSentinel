import React, { useState, useEffect } from 'react';
import { Cloud, Droplets, Sun, Wind, CloudRain, CloudLightning, CloudSnow, Loader2, MapPin } from 'lucide-react';
import GlassCard from '../common/GlassCard';
import './WeatherWidget.css';

const WeatherWidget = () => {
    const [weatherData, setWeatherData] = useState({
        currentTemp: null,
        condition: 'Loading...',
        location: 'Detecting Location...',
        forecast: [],
        mainIcon: Loader2,
        isRainingNow: false
    });
    const [loading, setLoading] = useState(true);

    // WMO Weather interpretation codes map
    const getWeatherDetails = (code) => {
        if (code === 0) return { icon: Sun, text: 'Clear sky' };
        if (code === 1 || code === 2 || code === 3) return { icon: Cloud, text: 'Partly cloudy' };
        if (code === 45 || code === 48) return { icon: Wind, text: 'Fog' };
        if (code >= 51 && code <= 67) return { icon: CloudRain, text: 'Rain' };
        if (code >= 71 && code <= 77) return { icon: CloudSnow, text: 'Snow' };
        if (code >= 80 && code <= 82) return { icon: CloudRain, text: 'Showers' };
        if (code >= 95 && code <= 99) return { icon: CloudLightning, text: 'Thunderstorm' };
        return { icon: Cloud, text: 'Unknown' };
    };

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // 1. Get user location automatically via IP
                const locationRes = await fetch('https://ipapi.co/json/');
                const locationData = await locationRes.json();

                const lat = locationData.latitude || 28.6139; // Fallback to New Delhi
                const lon = locationData.longitude || 77.2090;
                const city = locationData.city || 'Unknown Location';

                // 2. Fetch Live Weather from Open-Meteo (Free, No Auth required)
                // We ask for current_weather + hourly precipitation probability for the forecast timeline
                const weatherRes = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=precipitation_probability,weathercode&timezone=auto&forecast_days=1`
                );
                const meteoData = await weatherRes.json();

                // 3. Process the current weather
                const current = meteoData.current_weather;
                const currentDetails = getWeatherDetails(current.weathercode);

                // Determine if it's currently raining broadly (for the alert)
                const isRainingNow = current.weathercode >= 51 && current.weathercode <= 99 && current.weathercode !== 71 && current.weathercode !== 77;

                // 4. Process the hourly forecast for the next 4 intervals (skipping current hour)
                const nowHourIndex = new Date().getHours();
                const forecastList = [];

                for (let i = nowHourIndex + 1; i < nowHourIndex + 5; i++) {
                    // Safe wrap around for midnight
                    if (i >= 24) continue;

                    const timeString = meteoData.hourly.time[i];
                    const hourDate = new Date(timeString);
                    // Format to simple hour (e.g., "2 PM")
                    const formattedHour = hourDate.toLocaleTimeString([], { hour: 'numeric' });

                    const hourCode = meteoData.hourly.weathercode[i];
                    const pop = meteoData.hourly.precipitation_probability[i];
                    const details = getWeatherDetails(hourCode);

                    forecastList.push({
                        time: formattedHour,
                        icon: details.icon,
                        chance: pop
                    });
                }

                setWeatherData({
                    currentTemp: Math.round(current.temperature),
                    condition: currentDetails.text,
                    location: city,
                    forecast: forecastList.length > 0 ? forecastList : [
                        { time: 'N/A', icon: Cloud, chance: 0 }
                    ],
                    mainIcon: currentDetails.icon,
                    isRainingNow: isRainingNow
                });

                setLoading(false);

            } catch (error) {
                console.error("Failed to fetch weather data:", error);
                setWeatherData(prev => ({ ...prev, condition: 'Weather Unavailable' }));
                setLoading(false);
            }
        };

        fetchWeather();
        // Refresh weather every 30 minutes
        const interval = setInterval(fetchWeather, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const MainIcon = weatherData.mainIcon;

    return (
        <GlassCard title="Live Water Outlook" icon={Cloud}>
            <div className="weather-location" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '10px' }}>
                <MapPin size={14} />
                <span>{weatherData.location}</span>
            </div>

            <div className="weather-main">
                <div className="current-weather">
                    {loading ? (
                        <Loader2 size={48} className="weather-icon-large spin" />
                    ) : (
                        <MainIcon size={48} className="weather-icon-large" />
                    )}
                    <div className="temp-group">
                        <span className="current-temp">
                            {weatherData.currentTemp !== null ? `${weatherData.currentTemp}°C` : '--'}
                        </span>
                        <span className="condition">{weatherData.condition}</span>
                    </div>
                </div>
            </div>

            <div className="forecast-timeline">
                {weatherData.forecast.map((item, i) => (
                    <div key={i} className="forecast-item">
                        <span className="f-time">{item.time}</span>
                        <item.icon size={20} className="f-icon" />
                        <span className="f-chance">{item.chance}% Rain</span>
                    </div>
                ))}
            </div>

            {weatherData.isRainingNow ? (
                <div className="weather-alert">
                    <CloudRain size={16} />
                    <span>Rain detected locally. Irrigation system paused to save water.</span>
                </div>
            ) : (
                <div className="weather-alert" style={{ background: 'var(--background)', color: 'var(--primary)', borderColor: 'var(--card-border)' }}>
                    <Sun size={16} />
                    <span>Clear conditions. Standard irrigation schedule active.</span>
                </div>
            )}
        </GlassCard>
    );
};

export default WeatherWidget;
