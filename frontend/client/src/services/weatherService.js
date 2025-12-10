
// WMO Weather interpretation codes (WW)
// https://open-meteo.com/en/docs
const getWeatherIcon = (code) => {
    // 0: Clear sky
    if (code === 0) return { icon: 'sunny', label: 'Güneşli', color: 'text-yellow-500' };

    // 1, 2, 3: Mainly clear, partly cloudy, and overcast
    if (code === 1) return { icon: 'sunny', label: 'Az Bulutlu', color: 'text-yellow-400' };
    if (code === 2) return { icon: 'partly_cloudy_day', label: 'Parçalı Bulutlu', color: 'text-gray-400' };
    if (code === 3) return { icon: 'cloud', label: 'Kapalı', color: 'text-gray-500' };

    // 45, 48: Fog
    if (code === 45 || code === 48) return { icon: 'foggy', label: 'Sisli', color: 'text-gray-400' };

    // 51, 53, 55: Drizzle
    if (code >= 51 && code <= 55) return { icon: 'rainy', label: 'Çiseleyen Yağmur', color: 'text-blue-300' };

    // 61, 63, 65: Rain
    if (code >= 61 && code <= 65) return { icon: 'rainy', label: 'Yağmurlu', color: 'text-blue-500' };

    // 71, 73, 75: Snow fall
    if (code >= 71 && code <= 77) return { icon: 'weather_snowy', label: 'Karlı', color: 'text-blue-200' };

    // 80, 81, 82: Rain showers
    if (code >= 80 && code <= 82) return { icon: 'umbrella', label: 'Sağanak Yağışlı', color: 'text-blue-600' };

    // 95, 96, 99: Thunderstorm
    if (code >= 95 && code <= 99) return { icon: 'thunderstorm', label: 'Fırtınalı', color: 'text-purple-600' };

    return { icon: 'sunny', label: 'Bilinmiyor', color: 'text-gray-400' };
};

export const getUserLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
        } else {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                },
                (error) => {
                    reject(error);
                }
            );
        }
    });
};

export const getWeather = async (lat, lon) => {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`
        );

        if (!response.ok) {
            throw new Error('Weather data fetch failed');
        }

        const data = await response.json();
        const current = data.current_weather;
        const info = getWeatherIcon(current.weathercode);

        return {
            temperature: current.temperature,
            windspeed: current.windspeed,
            ...info
        };
    } catch (error) {
        console.error('Weather service error:', error);
        throw error;
    }
};
