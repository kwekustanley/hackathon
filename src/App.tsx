import React, { useEffect, useState } from 'react';
import { 
  Search, 
  MapPin, 
  AlertTriangle, 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Calendar,
  Github,
  CloudRain,
  Sun,
  Cloud,
  Bell,
  Phone,
  Mail,
  Shield,
  Info,
  X
} from 'lucide-react';

export default function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [alertLevel, setAlertLevel] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);

  // Expanded list of Ghana cities and towns
  const cities = [
    'Accra', 'Kumasi', 'Tamale', 'Cape Coast', 'Ho', 'Sunyani', 'Koforidua', 'Takoradi',
    'Tema', 'Wa', 'Bolgatanga', 'Techiman', 'Obuasi', 'Tarkwa', 'Winneba', 'Kasoa',
    'Nkawkaw', 'Yendi', 'Berekum', 'Kintampo', 'Dunkwa', 'Prestea', 'Axim', 'Elmina',
    'Saltpond', 'Swedru', 'Nsawam', 'Suhum', 'Akim Oda', 'Begoro', 'Hohoe', 'Kpando',
    'Aflao', 'Keta', 'Anloga', 'Denu', 'Bawku', 'Navrongo', 'Lawra', 'Jirapa',
    'Tumu', 'Damongo', 'Salaga', 'Kpandai', 'Zabzugu', 'Gushiegu', 'Savelugu', 'Tolon',
    'Kumbungu', 'Mion', 'Karaga', 'Garu', 'Tempane', 'Binduri', 'Pusiga', 'Paga'
  ];

  const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Heavy Rain', 'Thunderstorm', 'Overcast', 'Drizzle', 'Scattered Showers'];

  const alertLevels = [
    { 
      level: 'Normal', 
      color: 'from-green-500 to-green-600', 
      borderColor: 'border-green-400',
      explanation: 'Weather conditions are stable. No immediate flood risk. Continue normal activities.'
    },
    { 
      level: 'Watch', 
      color: 'from-yellow-500 to-yellow-600', 
      borderColor: 'border-yellow-400',
      explanation: 'Conditions are developing that could lead to flooding. Stay alert and monitor updates.'
    },
    { 
      level: 'Warning', 
      color: 'from-orange-500 to-orange-600', 
      borderColor: 'border-orange-400',
      explanation: 'Flooding is likely or occurring. Avoid low-lying areas and prepare for possible evacuation.'
    },
    { 
      level: 'Emergency', 
      color: 'from-red-500 to-red-600', 
      borderColor: 'border-red-400',
      explanation: 'Severe flooding is imminent or occurring. Take immediate action to protect life and property.'
    }
  ];

  const getWeatherIcon = (condition) => {
    if (condition.includes('Sunny')) return <Sun size={48} />;
    if (condition.includes('Rain') || condition.includes('Storm') || condition.includes('Drizzle') || condition.includes('Showers')) return <CloudRain size={48} />;
    if (condition.includes('Cloud')) return <Cloud size={48} />;
    return <Sun size={48} />;
  };

  const generateAlertLevel = (rainfall, condition) => {
    // Logic-based alert generation
    if (rainfall > 80 || condition.includes('Heavy Rain') || condition.includes('Thunderstorm')) {
      return alertLevels[3]; // Emergency
    } else if (rainfall > 50 || condition.includes('Rain')) {
      return alertLevels[2]; // Warning
    } else if (rainfall > 20 || condition.includes('Drizzle') || condition.includes('Showers')) {
      return alertLevels[1]; // Watch
    } else {
      return alertLevels[0]; // Normal
    }
  };

  const generateRandomWeather = (cityName = null) => {
    const randomCity = cityName || cities[Math.floor(Math.random() * cities.length)];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const temperature = Math.floor(Math.random() * 16) + 20; // 20-36°C
    const rainfall = Math.floor(Math.random() * 101); // 0-100mm
    const humidity = Math.floor(Math.random() * 46) + 50; // 50-95%
    const windSpeed = Math.floor(Math.random() * 15) + 1; // 1-15 km/h
    const feelsLike = temperature + Math.floor(Math.random() * 6) - 3; // ±3°C from actual temp

    return {
      city: randomCity,
      temperature: temperature,
      condition: randomCondition,
      rainfall: rainfall,
      humidity: humidity,
      windSpeed: windSpeed,
      feelsLike: feelsLike
    };
  };

  const generateForecast = (currentWeather) => {
    const days = ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5'];
    return days.map((day, index) => {
      if (index === 0) {
        // Use current weather data for "Today"
        return {
          date: day,
          condition: currentWeather.condition,
          temperature: currentWeather.temperature,
          icon: getWeatherIcon(currentWeather.condition)
        };
      } else {
        // Generate random data for future days
        const futureCondition = conditions[Math.floor(Math.random() * conditions.length)];
        return {
          date: day,
          condition: futureCondition,
          temperature: Math.floor(Math.random() * 16) + 20,
          icon: getWeatherIcon(futureCondition)
        };
      }
    });
  };

  const handleSearch = () => {
    setIsLoading(true);
    const cityInput = document.getElementById('city-input') as HTMLInputElement;
    const searchCity = cityInput?.value.trim();
    
    // Simulate API delay
    setTimeout(() => {
      const newWeather = generateRandomWeather(searchCity || null);
      const newAlert = generateAlertLevel(newWeather.rainfall, newWeather.condition);
      const newForecast = generateForecast(newWeather); // Pass current weather to forecast
      
      setWeatherData(newWeather);
      setAlertLevel(newAlert);
      setForecast(newForecast);
      setIsLoading(false);
      
      // Clear input
      if (cityInput) cityInput.value = '';
    }, 1000);
  };

  const handleLocationSearch = () => {
    // Show location permission popup
    setShowLocationPopup(true);
  };

  const handleLocationPermissionAllow = () => {
    setShowLocationPopup(false);
    setIsLoading(true);
    
    // Simulate getting user location
    setTimeout(() => {
      const newWeather = generateRandomWeather();
      const newAlert = generateAlertLevel(newWeather.rainfall, newWeather.condition);
      const newForecast = generateForecast(newWeather); // Pass current weather to forecast
      
      setWeatherData(newWeather);
      setAlertLevel(newAlert);
      setForecast(newForecast);
      setIsLoading(false);
    }, 1500);
  };

  const handleLocationPermissionDeny = () => {
    setShowLocationPopup(false);
  };

  const handleSubscribe = () => {
    const phoneInput = document.getElementById('phone-number') as HTMLInputElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const successDiv = document.getElementById('notify-success');
    
    if (phoneInput?.value.trim()) {
      if (successDiv) {
        successDiv.textContent = '✅ Successfully subscribed to flood alerts!';
        successDiv.className = 'p-3 bg-green-100 border border-green-300 text-green-800 rounded-xl';
        successDiv.style.display = 'block';
        
        // Clear inputs
        phoneInput.value = '';
        if (emailInput) emailInput.value = '';
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          successDiv.style.display = 'none';
        }, 3000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Location Permission Popup */}
      {showLocationPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-300 scale-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin size={20} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Location Access</h3>
              </div>
              <button
                onClick={handleLocationPermissionDeny}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-3">
                <strong>Flood & Weather Alert System</strong> wants to access your location to provide accurate weather information for your area.
              </p>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>This will help us:</strong>
                </p>
                <ul className="text-sm text-blue-600 mt-1 space-y-1">
                  <li>• Show weather for your exact location</li>
                  <li>• Provide relevant flood alerts</li>
                  <li>• Give accurate local forecasts</li>
                </ul>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleLocationPermissionDeny}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300"
              >
                Don't Allow
              </button>
              <button
                onClick={handleLocationPermissionAllow}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Allow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 via-orange-600 to-red-700 text-white py-6 px-4 shadow-2xl">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Flood & Weather Alert System
            </h1>
          </div>
          <p className="text-base md:text-lg font-medium opacity-95">
           Route 360
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-4 space-y-4">
        {/* Location Search Section */}
        <section className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-white/20">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center flex items-center justify-center gap-2">
              <Search size={20} />
              Get Weather Information
            </h2>
            <div className="flex flex-col lg:flex-row gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  id="city-input"
                  placeholder="Enter your city or town"
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-all duration-300 text-sm shadow-sm hover:shadow-md"
                />
              </div>
              <div className="flex gap-2">
                <button
                  id="search-btn"
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 text-sm"
                >
                  <Search size={16} />
                  {isLoading ? 'Loading...' : 'Get Weather Info'}
                </button>
                <button
                  id="location-btn"
                  onClick={handleLocationSearch}
                  disabled={isLoading}
                  className="px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 text-sm"
                >
                  <MapPin size={16} />
                  <span className="hidden sm:inline">Use My Location</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Welcome Message - Only shown when no weather data */}
        {!weatherData && !isLoading && (
          <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-8 border border-blue-200/50 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield size={32} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Welcome to Route 360's Flood & Weather Alert System
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Stay informed about weather conditions and flood risks in your area. 
                Enter your city name or use your current location to get started with real-time weather updates and safety alerts.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Search size={16} />
                  <span>Search any city in Ghana</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin size={16} />
                  <span>Use your current location</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Bell size={16} />
                  <span>Get instant alerts</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Loading State */}
        {isLoading && (
          <section className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-white/20 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 font-medium">Getting weather information...</p>
            </div>
          </section>
        )}

        {/* Alert Banner - Only shown when weather data exists */}
        {weatherData && alertLevel && (
          <section 
            id="alert-banner" 
            className={`bg-gradient-to-r ${alertLevel.color} text-white p-3 rounded-lg shadow-lg border-l-4 ${alertLevel.borderColor}`}
          >
            <div className="flex items-center justify-center gap-2">
              <AlertTriangle size={20} />
              <span className="text-lg font-bold">Alert Level: {alertLevel.level}</span>
            </div>
          </section>
        )}

        {/* Alert Explanation - Only shown when weather data exists */}
        {weatherData && alertLevel && (
          <section className="bg-blue-50/80 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-blue-200/50">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Alert Explanation</h3>
                <p className="text-blue-700 text-sm leading-relaxed">
                  <strong>Current Status:</strong> {alertLevel.explanation}
                </p>
                <div className="mt-3 text-xs text-blue-600">
                  <p><strong>Alert levels are determined by:</strong> Rainfall amount (mm), weather conditions, and flood risk assessment for the area.</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Weather Info Card - Only shown when weather data exists */}
        {weatherData && (
          <section id="weather-info" className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-white/20">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Thermometer size={20} />
              Current Weather
            </h2>
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 id="city-name" className="text-2xl font-bold text-gray-800">
                    {weatherData.city}
                  </h3>
                  <div id="weather-icon" className="text-blue-500">
                    {getWeatherIcon(weatherData.condition)}
                  </div>
                </div>
                <div id="temperature" className="text-4xl font-bold text-blue-600">
                  {weatherData.temperature}°C
                </div>
                <div id="condition" className="text-lg text-gray-600 capitalize font-medium">
                  {weatherData.condition}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg shadow-md">
                  <div className="flex items-center gap-2 text-blue-600 mb-1">
                    <Droplets size={16} />
                    <span className="font-semibold text-xs">Rainfall</span>
                  </div>
                  <div id="rainfall" className="text-xl font-bold text-gray-800">{weatherData.rainfall} mm</div>
                </div>
                
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-3 rounded-lg shadow-md">
                  <div className="flex items-center gap-2 text-teal-600 mb-1">
                    <Eye size={16} />
                    <span className="font-semibold text-xs">Humidity</span>
                  </div>
                  <div id="humidity" className="text-xl font-bold text-gray-800">{weatherData.humidity}%</div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg shadow-md">
                  <div className="flex items-center gap-2 text-purple-600 mb-1">
                    <Wind size={16} />
                    <span className="font-semibold text-xs">Wind Speed</span>
                  </div>
                  <div id="wind-speed" className="text-xl font-bold text-gray-800">{weatherData.windSpeed} km/h</div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-lg shadow-md">
                  <div className="flex items-center gap-2 text-orange-600 mb-1">
                    <Thermometer size={16} />
                    <span className="font-semibold text-xs">Feels Like</span>
                  </div>
                  <div className="text-xl font-bold text-gray-800">{weatherData.feelsLike}°C</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 5-Day Forecast Section - Only shown when weather data exists */}
        {weatherData && forecast.length > 0 && (
          <section id="forecast-section" className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-white/20">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar size={20} />
              5-Day Forecast
            </h2>
            <div className="overflow-x-auto">
              <div className="flex gap-3 min-w-max">
                {forecast.map((day, index) => (
                  <div key={index} className="forecast-card bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg shadow-md min-w-[120px] text-center">
                    <div className="forecast-date text-xs font-semibold text-gray-600 mb-2">{day.date}</div>
                    <div className="forecast-icon text-blue-500 mb-2 flex justify-center">
                      {React.cloneElement(day.icon, { size: 28 })}
                    </div>
                    <div className="forecast-temp text-base font-bold text-gray-800 mb-1">{day.temperature}°C</div>
                    <div className="forecast-condition text-xs text-gray-600 capitalize">{day.condition}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Notify Me Section */}
        <section className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-white/20">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Bell size={20} />
            Get Alert Notifications
          </h2>
          <div className="max-w-xl mx-auto space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label htmlFor="phone-number" className="block text-sm font-semibold text-gray-700 mb-1">
                  Phone Number (SMS Alerts)
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    id="phone-number"
                    className="w-full pl-9 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md text-sm"
                    placeholder="+233 123 456 789"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                  Email (Optional)
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    className="w-full pl-9 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md text-sm"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
            </div>
            
            <div id="notify-success" className="hidden p-3 bg-green-100 border border-green-300 text-green-800 rounded-lg"></div>
            
            <button
              id="subscribe-btn"
              onClick={handleSubscribe}
              className="w-full md:w-auto px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
            >
              <Bell size={16} />
              Subscribe to Alerts
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-6 px-4 mt-8">
        
      </footer>
    </div>
  );
}
