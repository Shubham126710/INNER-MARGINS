import { useState, useEffect } from 'react';

// WMO Weather interpretation codes
function getWeatherDescription(code: number): string {
  if (code === 0) return 'CLEAR SKY';
  if (code === 1 || code === 2) return 'PARTLY CLOUDY';
  if (code === 3) return 'OVERCAST';
  if (code >= 45 && code <= 48) return 'FOG';
  if (code >= 51 && code <= 55) return 'DRIZZLE';
  if (code >= 61 && code <= 65) return 'RAIN';
  if (code >= 71 && code <= 77) return 'SNOW';
  if (code >= 80 && code <= 82) return 'RAIN SHOWERS';
  if (code >= 95 && code <= 99) return 'THUNDERSTORM';
  return 'UNKNOWN';
}

interface PublicationMeta {
  location: string;
  weather: string;
  isLoading: boolean;
  error: boolean;
}

export function usePublicationMeta(): PublicationMeta {
  const [meta, setMeta] = useState<PublicationMeta>({
    location: '',
    weather: '',
    isLoading: true,
    error: false,
  });

  useEffect(() => {
    let mounted = true;

    async function fetchMeta() {
      try {
        const cached = sessionStorage.getItem('publication_meta');
        if (cached) {
          const parsed = JSON.parse(cached);
          const age = Date.now() - parsed.timestamp;
          if (age < 1000 * 60 * 30) {
            if (mounted) {
              setMeta({
                location: parsed.location,
                weather: parsed.weather,
                isLoading: false,
                error: false,
              });
            }
            return;
          }
        }

        let lat = 30.7333; // Default to Chandigarh
        let lon = 76.7794;
        let locationStr = 'CHANDIGARH / INDIA (BASE)';
        let hasLocation = false;

        // 1. Try Geolocation
        if ('geolocation' in navigator) {
          try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 5000,
                maximumAge: 1000 * 60 * 30
              });
            });
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            hasLocation = true;
          } catch (geoErr) {
            console.warn('Geolocation denied or timeout. Using fallback location.');
          }
        }

        // 2. If we have real coordinates, get the real city
        if (hasLocation) {
          try {
            const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
            if (geoRes.ok) {
              const geoData = await geoRes.json();
              const city = geoData.city || geoData.locality || geoData.principalSubdivision || 'UNKNOWN LOCATION';
              const country = geoData.countryName || 'UNKNOWN';
              locationStr = `${city.toUpperCase()} / ${country.toUpperCase()}`;
            }
          } catch (e) {
            console.warn('Reverse geocoding failed:', e);
            locationStr = `${lat.toFixed(2)}, ${lon.toFixed(2)} (COORD)`;
          }
        }

        // 3. Get Weather (always attempted, even for fallback coords)
        let weatherStr = 'WEATHER UNAVAILABLE';
        try {
          const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`);
          if (weatherRes.ok) {
            const weatherData = await weatherRes.json();
            const temp = Math.round(weatherData.current.temperature_2m);
            const code = weatherData.current.weather_code;
            const weatherDesc = getWeatherDescription(code);
            weatherStr = `${temp}°C · ${weatherDesc}`;
          }
        } catch (e) {
          console.warn('Weather API failed:', e);
        }

        if (mounted) {
          setMeta({
            location: locationStr,
            weather: weatherStr,
            isLoading: false,
            error: false,
          });
          
          sessionStorage.setItem('publication_meta', JSON.stringify({
            location: locationStr,
            weather: weatherStr,
            timestamp: Date.now()
          }));
        }

      } catch (err) {
        console.warn('Could not fetch publication meta:', err);
        if (mounted) {
          setMeta(prev => ({ 
            ...prev, 
            location: 'CHANDIGARH / INDIA (BASE)',
            weather: 'WEATHER UNAVAILABLE',
            isLoading: false, 
            error: true 
          }));
        }
      }
    }

    fetchMeta();

    return () => { mounted = false; };
  }, []);

  return meta;
}
