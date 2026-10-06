import React, { useState, useEffect, useCallback } from 'react';
import { 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  CloudFog, 
  Wind, 
  Droplets, 
  MapPin, 
  RefreshCw, 
  ChevronDown,
  AlertTriangle,
  Sparkles,
  Gauge
} from 'lucide-react';
import { 
  weatherService, 
  WeatherData, 
  WeatherCondition,
  CITIES_LIST 
} from '../services/weatherService';

interface WeatherWidgetProps {
  initialCityId?: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ initialCityId = 'jakarta' }) => {
  const [selectedCityId, setSelectedCityId] = useState<string>(initialCityId);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [activeForecastTab, setActiveForecastTab] = useState<'hourly' | 'daily'>('hourly');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState<boolean>(false);

  // Load weather data
  const loadWeather = useCallback(async (cityId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await weatherService.fetchWeatherByCity(cityId);
      setWeather(data);
    } catch {
      setError('Gagal memuat data cuaca.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeather(selectedCityId);
  }, [selectedCityId, loadWeather]);

  // Convert temperature if needed
  const formatTemp = (celsius: number) => {
    if (tempUnit === 'F') {
      return `${Math.round((celsius * 9) / 5 + 32)}°F`;
    }
    return `${celsius}°C`;
  };

  // Dynamic Weather Icon based on condition
  const renderWeatherIcon = (condition: WeatherCondition, sizeClass = 'w-10 h-10') => {
    switch (condition) {
      case 'sunny':
        return <Sun className={`${sizeClass} text-amber-500 fill-amber-400 drop-shadow-sm`} />;
      case 'partly_cloudy':
        return <CloudSun className={`${sizeClass} text-amber-500 fill-amber-300 drop-shadow-sm`} />;
      case 'cloudy':
        return <Cloud className={`${sizeClass} text-slate-400 fill-slate-300 drop-shadow-sm`} />;
      case 'rain':
        return <CloudRain className={`${sizeClass} text-blue-500 fill-blue-200 drop-shadow-sm`} />;
      case 'heavy_rain':
        return <CloudRain className={`${sizeClass} text-blue-600 fill-blue-300 drop-shadow-sm`} />;
      case 'thunderstorm':
        return <CloudLightning className={`${sizeClass} text-amber-500 fill-amber-300 drop-shadow-sm`} />;
      case 'foggy':
        return <CloudFog className={`${sizeClass} text-slate-400 drop-shadow-sm`} />;
      default:
        return <CloudSun className={`${sizeClass} text-amber-500`} />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs transition-colors">
      {/* Widget Header: Title + City Selector + Refresh */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#004a99] flex items-center justify-center text-amber-300 shadow-2xs">
            <Sun className="w-3.5 h-3.5 fill-amber-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Prakiraan Cuaca
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Unit Toggle */}
          <button
            onClick={() => setTempUnit(prev => prev === 'C' ? 'F' : 'C')}
            title="Ganti Satuan Suhu"
            className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            °{tempUnit}
          </button>

          {/* Refresh Button */}
          <button
            onClick={() => loadWeather(selectedCityId)}
            disabled={loading}
            title="Perbarui Cuaca"
            className="p-1 rounded-md text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600 dark:text-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* City Selector Pill Dropdown */}
      <div className="relative mb-3">
        <button
          onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
          className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-amber-400 transition-all text-slate-800 dark:text-slate-200"
        >
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-amber-400 shrink-0" />
            <span className="font-bold">{weather?.cityName || 'Pilih Kota'}</span>
            <span className="text-[11px] text-slate-400 font-normal truncate">({weather?.province})</span>
          </div>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isCityDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isCityDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {CITIES_LIST.map((city) => (
              <button
                key={city.id}
                onClick={() => {
                  setSelectedCityId(city.id);
                  setIsCityDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-colors ${
                  city.id === selectedCityId 
                    ? 'font-bold text-[#004a99] dark:text-amber-300 bg-amber-50/50 dark:bg-blue-950/40' 
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>{city.name}</span>
                <span className="text-[10px] text-slate-400">{city.province}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Temperature & Weather Card */}
      {weather && (
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 via-slate-50 to-amber-50/50 dark:from-slate-800/80 dark:via-slate-850 dark:to-blue-950/40 p-4 border border-blue-100/80 dark:border-slate-700/60 shadow-2xs mb-3">
          <div className="flex items-center justify-between">
            <div>
              {/* Temperature */}
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {formatTemp(weather.temperature)}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Terasa {formatTemp(weather.feelsLike)}
                </span>
              </div>

              {/* Condition */}
              <div className="mt-1 flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-bold text-blue-900 dark:text-amber-300">
                  {weather.conditionLabel}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                {weather.description}
              </p>
            </div>

            {/* Dynamic Weather Icon */}
            <div className="shrink-0 p-2 rounded-xl bg-white/70 dark:bg-slate-900/60 shadow-xs border border-white/80 dark:border-slate-700/40">
              {renderWeatherIcon(weather.condition, 'w-12 h-12')}
            </div>
          </div>

          {/* Weather Alert if present */}
          {weather.alert && (
            <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-start gap-1.5 text-[11px] text-amber-800 dark:text-amber-300 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span className="line-clamp-2">{weather.alert}</span>
            </div>
          )}
        </div>
      )}

      {/* Atmospheric Metrics Grid (3 cols) */}
      {weather && (
        <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
          {/* Humidity */}
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              <Droplets className="w-3 h-3 text-blue-500" />
              <span>Kelembapan</span>
            </div>
            <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
              {weather.humidity}%
            </div>
          </div>

          {/* Wind Speed */}
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              <Wind className="w-3 h-3 text-emerald-500" />
              <span>Angin</span>
            </div>
            <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
              {weather.windSpeed} km/j
            </div>
          </div>

          {/* UV / AQI */}
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              <Gauge className="w-3 h-3 text-amber-500" />
              <span>Udara</span>
            </div>
            <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
              {weather.airQualityIndex} <span className="text-[10px] font-normal text-slate-400">AQI</span>
            </div>
          </div>
        </div>
      )}

      {/* Forecast Tabs */}
      {weather && (
        <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveForecastTab('hourly')}
                className={`text-[11px] font-bold pb-0.5 transition-colors ${
                  activeForecastTab === 'hourly'
                    ? 'text-blue-700 dark:text-amber-400 border-b-2 border-amber-400'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                Hari Ini (Per Jam)
              </button>
              <span className="text-slate-300 dark:text-slate-700 text-xs">·</span>
              <button
                onClick={() => setActiveForecastTab('daily')}
                className={`text-[11px] font-bold pb-0.5 transition-colors ${
                  activeForecastTab === 'daily'
                    ? 'text-blue-700 dark:text-amber-400 border-b-2 border-amber-400'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                3 Hari ke Depan
              </button>
            </div>

            <span className="text-[10px] text-slate-400 font-mono">
              BMKG Real-time
            </span>
          </div>

          {/* Hourly View */}
          {activeForecastTab === 'hourly' && (
            <div className="grid grid-cols-5 gap-1 text-center">
              {weather.hourly.map((h, idx) => (
                <div 
                  key={idx} 
                  className="py-1.5 px-1 rounded-md bg-slate-50 dark:bg-slate-800/50 hover:bg-amber-50/50 dark:hover:bg-slate-800 transition-colors flex flex-col items-center"
                >
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    {h.time}
                  </span>
                  <div className="my-1">
                    {renderWeatherIcon(h.condition, 'w-4 h-4')}
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                    {formatTemp(h.temp)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Daily View */}
          {activeForecastTab === 'daily' && (
            <div className="space-y-1.5">
              {weather.daily.map((d, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-xs"
                >
                  <span className="font-semibold text-slate-700 dark:text-slate-300 w-16">
                    {d.day}
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    {renderWeatherIcon(d.condition, 'w-4 h-4')}
                    <span className="text-[11px]">{d.conditionLabel}</span>
                  </div>
                  <div className="text-right font-semibold text-slate-800 dark:text-slate-200">
                    <span className="text-slate-400 font-normal mr-1">{formatTemp(d.tempMin)}</span>
                    <span>{formatTemp(d.tempMax)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Widget Footer */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
        <div className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Update: {weather?.lastUpdated || 'Baru saja'}</span>
        </div>
        <span className="text-slate-400">Data Stasiun Meteorologi</span>
      </div>
    </div>
  );
};
