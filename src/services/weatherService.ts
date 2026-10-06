export type WeatherCondition = 
  | 'sunny'
  | 'partly_cloudy'
  | 'cloudy'
  | 'rain'
  | 'heavy_rain'
  | 'thunderstorm'
  | 'foggy';

export interface HourlyForecast {
  time: string;
  temp: number;
  condition: WeatherCondition;
  conditionLabel: string;
  rainChance: number;
}

export interface DailyForecast {
  day: string;
  tempMin: number;
  tempMax: number;
  condition: WeatherCondition;
  conditionLabel: string;
}

export interface WeatherData {
  cityId: string;
  cityName: string;
  province: string;
  temperature: number; // in Celsius
  feelsLike: number;
  condition: WeatherCondition;
  conditionLabel: string;
  description: string;
  humidity: number; // percentage
  windSpeed: number; // km/h
  uvIndex: number;
  uvLevel: 'Rendah' | 'Sedang' | 'Tinggi' | 'Ekstrem';
  airQualityIndex: number; // AQI
  airQualityStatus: 'Baik' | 'Sedang' | 'Tidak Sehat';
  alert?: string;
  lastUpdated: string;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export interface CityOption {
  id: string;
  name: string;
  province: string;
}

export const CITIES_LIST: CityOption[] = [
  { id: 'jakarta', name: 'Jakarta', province: 'DKI Jakarta' },
  { id: 'surabaya', name: 'Surabaya', province: 'Jawa Timur' },
  { id: 'bandung', name: 'Bandung', province: 'Jawa Barat' },
  { id: 'medan', name: 'Medan', province: 'Sumatera Utara' },
  { id: 'makassar', name: 'Makassar', province: 'Sulawesi Selatan' },
  { id: 'denpasar', name: 'Denpasar', province: 'Bali' },
  { id: 'yogyakarta', name: 'Yogyakarta', province: 'D.I. Yogyakarta' },
  { id: 'semarang', name: 'Semarang', province: 'Jawa Tengah' },
  { id: 'palembang', name: 'Palembang', province: 'Sumatera Selatan' }
];

const BASE_CITY_DATA: Record<string, Omit<WeatherData, 'lastUpdated'>> = {
  jakarta: {
    cityId: 'jakarta',
    cityName: 'Jakarta',
    province: 'DKI Jakarta',
    temperature: 31,
    feelsLike: 35,
    condition: 'partly_cloudy',
    conditionLabel: 'Cerah Berawan',
    description: 'Sebagian besar cerah dengan tutupan awan tipis di wilayah pusat.',
    humidity: 75,
    windSpeed: 14,
    uvIndex: 7,
    uvLevel: 'Tinggi',
    airQualityIndex: 92,
    airQualityStatus: 'Sedang',
    alert: 'Peluang hujan lokal intensitas ringan menjelang sore hari.',
    hourly: [
      { time: '12:00', temp: 32, condition: 'sunny', conditionLabel: 'Terik', rainChance: 10 },
      { time: '15:00', temp: 31, condition: 'partly_cloudy', conditionLabel: 'Cerah Berawan', rainChance: 25 },
      { time: '18:00', temp: 28, condition: 'rain', conditionLabel: 'Hujan Ringan', rainChance: 65 },
      { time: '21:00', temp: 27, condition: 'cloudy', conditionLabel: 'Berawan', rainChance: 20 },
      { time: '00:00', temp: 26, condition: 'cloudy', conditionLabel: 'Berawan', rainChance: 10 }
    ],
    daily: [
      { day: 'Besok', tempMin: 25, tempMax: 33, condition: 'thunderstorm', conditionLabel: 'Hujan Petir' },
      { day: 'Lusa', tempMin: 24, tempMax: 32, condition: 'partly_cloudy', conditionLabel: 'Cerah Berawan' },
      { day: 'Kamis', tempMin: 25, tempMax: 33, condition: 'sunny', conditionLabel: 'Cerah' }
    ]
  },
  surabaya: {
    cityId: 'surabaya',
    cityName: 'Surabaya',
    province: 'Jawa Timur',
    temperature: 34,
    feelsLike: 39,
    condition: 'sunny',
    conditionLabel: 'Cerah Terik',
    description: 'Sinar matahari terik, disarankan memakai tabir surya di luar ruangan.',
    humidity: 62,
    windSpeed: 18,
    uvIndex: 9,
    uvLevel: 'Tinggi',
    airQualityIndex: 78,
    airQualityStatus: 'Sedang',
    hourly: [
      { time: '12:00', temp: 35, condition: 'sunny', conditionLabel: 'Cerah Terik', rainChance: 5 },
      { time: '15:00', temp: 33, condition: 'sunny', conditionLabel: 'Cerah', rainChance: 10 },
      { time: '18:00', temp: 29, condition: 'partly_cloudy', conditionLabel: 'Cerah Berawan', rainChance: 10 },
      { time: '21:00', temp: 28, condition: 'cloudy', conditionLabel: 'Cerah', rainChance: 5 },
      { time: '00:00', temp: 27, condition: 'partly_cloudy', conditionLabel: 'Cerah', rainChance: 5 }
    ],
    daily: [
      { day: 'Besok', tempMin: 26, tempMax: 35, condition: 'sunny', conditionLabel: 'Cerah' },
      { day: 'Lusa', tempMin: 26, tempMax: 34, condition: 'partly_cloudy', conditionLabel: 'Cerah Berawan' },
      { day: 'Kamis', tempMin: 25, tempMax: 33, condition: 'partly_cloudy', conditionLabel: 'Cerah Berawan' }
    ]
  },
  bandung: {
    cityId: 'bandung',
    cityName: 'Bandung',
    province: 'Jawa Barat',
    temperature: 24,
    feelsLike: 24,
    condition: 'rain',
    conditionLabel: 'Hujan Ringan',
    description: 'Udara sejuk dengan rintik hujan berkala di dataran tinggi Bandung.',
    humidity: 88,
    windSpeed: 10,
    uvIndex: 4,
    uvLevel: 'Sedang',
    airQualityIndex: 42,
    airQualityStatus: 'Baik',
    alert: 'Jalan licin di kawasan perbukitan dan Lembang, waspada berkendara.',
    hourly: [
      { time: '12:00', temp: 25, condition: 'cloudy', conditionLabel: 'Berawan', rainChance: 40 },
      { time: '15:00', temp: 23, condition: 'rain', conditionLabel: 'Hujan Ringan', rainChance: 80 },
      { time: '18:00', temp: 22, condition: 'heavy_rain', conditionLabel: 'Hujan Lebat', rainChance: 85 },
      { time: '21:00', temp: 21, condition: 'cloudy', conditionLabel: 'Berawan Dingin', rainChance: 30 },
      { time: '00:00', temp: 20, condition: 'foggy', conditionLabel: 'Berkabut', rainChance: 15 }
    ],
    daily: [
      { day: 'Besok', tempMin: 19, tempMax: 26, condition: 'rain', conditionLabel: 'Hujan Ringan' },
      { day: 'Lusa', tempMin: 19, tempMax: 25, condition: 'thunderstorm', conditionLabel: 'Hujan Petir' },
      { day: 'Kamis', tempMin: 20, tempMax: 27, condition: 'partly_cloudy', conditionLabel: 'Cerah Berawan' }
    ]
  },
  medan: {
    cityId: 'medan',
    cityName: 'Medan',
    province: 'Sumatera Utara',
    temperature: 29,
    feelsLike: 33,
    condition: 'thunderstorm',
    conditionLabel: 'Hujan Petir',
    description: 'Potensi petir dan hujan deras disertai hembusan angin kencang.',
    humidity: 85,
    windSpeed: 21,
    uvIndex: 5,
    uvLevel: 'Sedang',
    airQualityIndex: 54,
    airQualityStatus: 'Baik',
    alert: 'Peringatan dini cuaca BMKG: Potensi kilat dan angin kencang.',
    hourly: [
      { time: '12:00', temp: 31, condition: 'cloudy', conditionLabel: 'Berawan', rainChance: 45 },
      { time: '15:00', temp: 28, condition: 'thunderstorm', conditionLabel: 'Hujan Petir', rainChance: 90 },
      { time: '18:00', temp: 26, condition: 'rain', conditionLabel: 'Hujan Sedang', rainChance: 70 },
      { time: '21:00', temp: 25, condition: 'cloudy', conditionLabel: 'Berawan', rainChance: 25 },
      { time: '00:00', temp: 24, condition: 'partly_cloudy', conditionLabel: 'Cerah Berawan', rainChance: 15 }
    ],
    daily: [
      { day: 'Besok', tempMin: 24, tempMax: 31, condition: 'rain', conditionLabel: 'Hujan Ringan' },
      { day: 'Lusa', tempMin: 24, tempMax: 32, condition: 'partly_cloudy', conditionLabel: 'Cerah Berawan' },
      { day: 'Kamis', tempMin: 23, tempMax: 32, condition: 'sunny', conditionLabel: 'Cerah' }
    ]
  },
  makassar: {
    cityId: 'makassar',
    cityName: 'Makassar',
    province: 'Sulawesi Selatan',
    temperature: 32,
    feelsLike: 36,
    condition: 'partly_cloudy',
    conditionLabel: 'Cerah Berawan',
    description: 'Angin pantai berhembus cukup kencang, cuaca kondusif untuk aktivitas luar.',
    humidity: 71,
    windSpeed: 20,
    uvIndex: 8,
    uvLevel: 'Tinggi',
    airQualityIndex: 60,
    airQualityStatus: 'Baik',
    hourly: [
      { time: '12:00', temp: 33, condition: 'sunny', conditionLabel: 'Cerah', rainChance: 15 },
      { time: '15:00', temp: 31, condition: 'partly_cloudy', conditionLabel: 'Cerah Berawan', rainChance: 20 },
      { time: '18:00', temp: 29, condition: 'partly_cloudy', conditionLabel: 'Cerah Berawan', rainChance: 20 },
      { time: '21:00', temp: 27, condition: 'cloudy', conditionLabel: 'Berawan', rainChance: 15 },
      { time: '00:00', temp: 26, condition: 'partly_cloudy', conditionLabel: 'Cerah Berawan', rainChance: 10 }
    ],
    daily: [
      { day: 'Besok', tempMin: 25, tempMax: 33, condition: 'partly_cloudy', conditionLabel: 'Cerah Berawan' },
      { day: 'Lusa', tempMin: 25, tempMax: 34, condition: 'sunny', conditionLabel: 'Cerah' },
      { day: 'Kamis', tempMin: 24, tempMax: 32, condition: 'rain', conditionLabel: 'Hujan Ringan' }
    ]
  },
  denpasar: {
    cityId: 'denpasar',
    cityName: 'Denpasar',
    province: 'Bali',
    temperature: 30,
    feelsLike: 33,
    condition: 'partly_cloudy',
    conditionLabel: 'Cerah Berawan',
    description: 'Cuaca tropis ideal untuk wisata pantai dan kegiatan outdoor.',
    humidity: 74,
    windSpeed: 17,
    uvIndex: 8,
    uvLevel: 'Tinggi',
    airQualityIndex: 45,
    airQualityStatus: 'Baik',
    hourly: [
      { time: '12:00', temp: 31, condition: 'sunny', conditionLabel: 'Cerah', rainChance: 10 },
      { time: '15:00', temp: 30, condition: 'partly_cloudy', conditionLabel: 'Cerah Berawan', rainChance: 15 },
      { time: '18:00', temp: 28, condition: 'partly_cloudy', conditionLabel: 'Cerah Berawan', rainChance: 15 },
      { time: '21:00', temp: 27, condition: 'partly_cloudy', conditionLabel: 'Cerah Berawan', rainChance: 10 },
      { time: '00:00', temp: 26, condition: 'sunny', conditionLabel: 'Cerah', rainChance: 5 }
    ],
    daily: [
      { day: 'Besok', tempMin: 25, tempMax: 32, condition: 'sunny', conditionLabel: 'Cerah' },
      { day: 'Lusa', tempMin: 25, tempMax: 31, condition: 'partly_cloudy', conditionLabel: 'Cerah Berawan' },
      { day: 'Kamis', tempMin: 24, tempMax: 31, condition: 'partly_cloudy', conditionLabel: 'Cerah Berawan' }
    ]
  },
  yogyakarta: {
    cityId: 'yogyakarta',
    cityName: 'Yogyakarta',
    province: 'D.I. Yogyakarta',
    temperature: 30,
    feelsLike: 33,
    condition: 'cloudy',
    conditionLabel: 'Berawan',
    description: 'Awan tebal menutupi langit sebagian wilayah Sleman dan Kota Yogyakarta.',
    humidity: 79,
    windSpeed: 11,
    uvIndex: 6,
    uvLevel: 'Sedang',
    airQualityIndex: 68,
    airQualityStatus: 'Sedang',
    hourly: [
      { time: '12:00', temp: 30, condition: 'cloudy', conditionLabel: 'Berawan', rainChance: 30 },
      { time: '15:00', temp: 29, condition: 'rain', conditionLabel: 'Hujan Ringan', rainChance: 60 },
      { time: '18:00', temp: 27, condition: 'cloudy', conditionLabel: 'Berawan', rainChance: 35 },
      { time: '21:00', temp: 25, condition: 'cloudy', conditionLabel: 'Berawan', rainChance: 20 },
      { time: '00:00', temp: 24, condition: 'partly_cloudy', conditionLabel: 'Cerah Berawan', rainChance: 10 }
    ],
    daily: [
      { day: 'Besok', tempMin: 23, tempMax: 31, condition: 'rain', conditionLabel: 'Hujan Ringan' },
      { day: 'Lusa', tempMin: 23, tempMax: 32, condition: 'partly_cloudy', conditionLabel: 'Cerah Berawan' },
      { day: 'Kamis', tempMin: 24, tempMax: 32, condition: 'sunny', conditionLabel: 'Cerah' }
    ]
  },
  semarang: {
    cityId: 'semarang',
    cityName: 'Semarang',
    province: 'Jawa Tengah',
    temperature: 32,
    feelsLike: 37,
    condition: 'partly_cloudy',
    conditionLabel: 'Cerah Berawan',
    description: 'Kawasan pesisir pantai cukup panas dengan kelembapan lembap.',
    humidity: 77,
    windSpeed: 15,
    uvIndex: 8,
    uvLevel: 'Tinggi',
    airQualityIndex: 82,
    airQualityStatus: 'Sedang',
    hourly: [
      { time: '12:00', temp: 33, condition: 'sunny', conditionLabel: 'Terik', rainChance: 15 },
      { time: '15:00', temp: 31, condition: 'partly_cloudy', conditionLabel: 'Cerah Berawan', rainChance: 25 },
      { time: '18:00', temp: 28, condition: 'partly_cloudy', conditionLabel: 'Cerah Berawan', rainChance: 20 },
      { time: '21:00', temp: 27, condition: 'cloudy', conditionLabel: 'Berawan', rainChance: 15 },
      { time: '00:00', temp: 26, condition: 'cloudy', conditionLabel: 'Berawan', rainChance: 10 }
    ],
    daily: [
      { day: 'Besok', tempMin: 25, tempMax: 33, condition: 'thunderstorm', conditionLabel: 'Hujan Petir' },
      { day: 'Lusa', tempMin: 25, tempMax: 32, condition: 'partly_cloudy', conditionLabel: 'Cerah Berawan' },
      { day: 'Kamis', tempMin: 24, tempMax: 34, condition: 'sunny', conditionLabel: 'Cerah' }
    ]
  },
  palembang: {
    cityId: 'palembang',
    cityName: 'Palembang',
    province: 'Sumatera Selatan',
    temperature: 31,
    feelsLike: 36,
    condition: 'cloudy',
    conditionLabel: 'Berawan Lembap',
    description: 'Udara hangat di sepanjang Sungai Musi dengan potensi gerimis petang hari.',
    humidity: 82,
    windSpeed: 12,
    uvIndex: 7,
    uvLevel: 'Tinggi',
    airQualityIndex: 74,
    airQualityStatus: 'Sedang',
    hourly: [
      { time: '12:00', temp: 32, condition: 'cloudy', conditionLabel: 'Berawan', rainChance: 35 },
      { time: '15:00', temp: 30, condition: 'rain', conditionLabel: 'Gerimis', rainChance: 65 },
      { time: '18:00', temp: 27, condition: 'cloudy', conditionLabel: 'Berawan', rainChance: 40 },
      { time: '21:00', temp: 26, condition: 'cloudy', conditionLabel: 'Berawan', rainChance: 20 },
      { time: '00:00', temp: 25, condition: 'partly_cloudy', conditionLabel: 'Cerah Berawan', rainChance: 10 }
    ],
    daily: [
      { day: 'Besok', tempMin: 24, tempMax: 32, condition: 'rain', conditionLabel: 'Hujan Sedang' },
      { day: 'Lusa', tempMin: 24, tempMax: 33, condition: 'partly_cloudy', conditionLabel: 'Cerah Berawan' },
      { day: 'Kamis', tempMin: 24, tempMax: 33, condition: 'sunny', conditionLabel: 'Cerah' }
    ]
  }
};

/**
 * Mock Weather API Service
 * Simulates network request latency and dynamic slight atmospheric variations
 */
export const weatherService = {
  async fetchWeatherByCity(cityId: string = 'jakarta'): Promise<WeatherData> {
    // Simulate real API network latency (250ms - 450ms)
    await new Promise((resolve) => setTimeout(resolve, 320));

    const base = BASE_CITY_DATA[cityId] || BASE_CITY_DATA['jakarta'];
    
    // Slight random delta to feel truly dynamic upon refresh
    const tempDelta = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
    const humidityDelta = Math.floor(Math.random() * 5) - 2;
    const windDelta = Math.floor(Math.random() * 3) - 1;

    const currentTemp = Math.max(18, base.temperature + tempDelta);
    const feelsLike = Math.max(currentTemp, base.feelsLike + tempDelta);

    const date = new Date();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return {
      ...base,
      temperature: currentTemp,
      feelsLike: feelsLike,
      humidity: Math.min(99, Math.max(40, base.humidity + humidityDelta)),
      windSpeed: Math.max(4, base.windSpeed + windDelta),
      lastUpdated: `${hours}:${minutes}:${seconds} WIB`
    };
  },

  getCities(): CityOption[] {
    return CITIES_LIST;
  }
};
