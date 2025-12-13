package com.luminlynx.misty.widget.data

import android.content.Context
import android.util.Log
import com.luminlynx.misty.widget.model.WeatherData
import com.luminlynx.misty.widget.model.HourlyForecast
import com.luminlynx.misty.widget.model.DailyForecast
import com.luminlynx.misty.widget.api.ApiClient
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File
import java.text.SimpleDateFormat
import java.util.Locale
import com.google.gson.Gson
import com.google.gson.annotations.SerializedName

/**
 * Repository for managing weather data for the widget
 * Handles data fetching, caching, and offline scenarios
 */
class WeatherWidgetRepository(private val context: Context) {

    companion object {
        private const val TAG = "WeatherWidgetRepository"
        private const val CACHE_FILE = "weather_cache.json"
        private const val CACHE_VALIDITY_MS = 30 * 60 * 1000L // 30 minutes default
        private const val MAX_RETRY_ATTEMPTS = 3
        private const val INITIAL_BACKOFF_MS = 1000L
    }

    private val gson = Gson()
    private val cacheFile: File
        get() = File(context.cacheDir, CACHE_FILE)

    /**
     * Cached weather data wrapper with timestamp
     */
    private data class CachedWeatherData(
        val data: WeatherData,
        val timestamp: Long
    )

    /**
     * Fetch weather data with caching and offline support
     */
    suspend fun getWeatherData(
        latitude: String,
        longitude: String,
        isMetric: Boolean,
        forceRefresh: Boolean = false
    ): Result<WeatherData> = withContext(Dispatchers.IO) {
        try {
            // Check cache first if not forcing refresh
            if (!forceRefresh) {
                val cachedData = getCachedWeatherData()
                if (cachedData != null && isCacheValid(cachedData.timestamp)) {
                    Log.d(TAG, "Returning cached weather data")
                    return@withContext Result.success(cachedData.data)
                }
            }

            // Attempt to fetch fresh data with exponential backoff
            var attempt = 0
            var lastException: Exception? = null

            while (attempt < MAX_RETRY_ATTEMPTS) {
                try {
                    val weatherData = fetchWeatherDataFromApi(latitude, longitude, isMetric)
                    
                    // Cache the successful result
                    cacheWeatherData(weatherData)
                    
                    Log.d(TAG, "Successfully fetched weather data")
                    return@withContext Result.success(weatherData)
                } catch (e: Exception) {
                    lastException = e
                    attempt++
                    
                    if (attempt < MAX_RETRY_ATTEMPTS) {
                        val backoffDelay = INITIAL_BACKOFF_MS * (1 shl attempt)
                        Log.w(TAG, "Fetch attempt $attempt failed, retrying in ${backoffDelay}ms", e)
                        Thread.sleep(backoffDelay)
                    }
                }
            }

            // All retries failed, try to return cached data even if expired
            val cachedData = getCachedWeatherData()
            if (cachedData != null) {
                Log.w(TAG, "All fetch attempts failed, returning expired cache")
                return@withContext Result.success(cachedData.data)
            }

            // No cache available, return error
            Log.e(TAG, "Failed to fetch weather data and no cache available", lastException)
            Result.failure(lastException ?: Exception("Failed to fetch weather data"))
        } catch (e: Exception) {
            Log.e(TAG, "Error in getWeatherData", e)
            Result.failure(e)
        }
    }

    /**
     * Fetch weather data from Open-Meteo API
     */
    private suspend fun fetchWeatherDataFromApi(
        latitude: String,
        longitude: String,
        isMetric: Boolean
    ): WeatherData {
        Log.d(TAG, "Fetching weather data from Open-Meteo API for lat=$latitude, lon=$longitude")
        
        val lat = latitude.toDouble()
        val lon = longitude.toDouble()
        
        // Fetch weather forecast
        val weatherResponse = ApiClient.weatherApi.getWeatherForecast(lat, lon)
        
        // Use coordinates as location name
        // In future, location name can be stored in widget preferences during configuration
        val locationName = "${lat.format(2)}°, ${lon.format(2)}°"
        
        // Parse sunrise/sunset times
        val sunriseTime = parseIsoDateTime(weatherResponse.daily.sunrise[0])
        val sunsetTime = parseIsoDateTime(weatherResponse.daily.sunset[0])
        
        // Convert temperature to Fahrenheit if needed
        val temperature = if (isMetric) {
            weatherResponse.current.temperature_2m
        } else {
            celsiusToFahrenheit(weatherResponse.current.temperature_2m)
        }
        
        val feelsLike = if (isMetric) {
            weatherResponse.current.apparent_temperature
        } else {
            celsiusToFahrenheit(weatherResponse.current.apparent_temperature)
        }
        
        val highTemp = if (isMetric) {
            weatherResponse.daily.temperature_2m_max[0]
        } else {
            celsiusToFahrenheit(weatherResponse.daily.temperature_2m_max[0])
        }
        
        val lowTemp = if (isMetric) {
            weatherResponse.daily.temperature_2m_min[0]
        } else {
            celsiusToFahrenheit(weatherResponse.daily.temperature_2m_min[0])
        }
        
        // Convert wind speed to mph if needed (API returns km/h)
        val windSpeed = if (isMetric) {
            weatherResponse.current.wind_speed_10m
        } else {
            kmhToMph(weatherResponse.current.wind_speed_10m)
        }
        
        // Get weather condition description
        val condition = getWeatherConditionDescription(weatherResponse.current.weather_code)
        
        Log.d(TAG, "Successfully fetched weather data from Open-Meteo API")
        
        return WeatherData(
            location = locationName,
            temperature = temperature,
            feelsLike = feelsLike,
            condition = condition,
            conditionCode = weatherResponse.current.weather_code,
            humidity = weatherResponse.current.relative_humidity_2m,
            windSpeed = windSpeed,
            highTemp = highTemp,
            lowTemp = lowTemp,
            uvIndex = weatherResponse.daily.uv_index_max[0].toInt(),
            sunrise = sunriseTime,
            sunset = sunsetTime,
            lastUpdate = System.currentTimeMillis(),
            isMetric = isMetric
        )
    }
    
    /**
     * Convert Celsius to Fahrenheit
     */
    private fun celsiusToFahrenheit(celsius: Double): Double {
        return celsius * 9.0 / 5.0 + 32.0
    }
    
    /**
     * Convert km/h to mph
     */
    private fun kmhToMph(kmh: Double): Double {
        return kmh * 0.621371
    }
    
    /**
     * Format double to specified decimal places
     */
    private fun Double.format(decimals: Int): String {
        return "%.${decimals}f".format(this)
    }
    
    /**
     * Parse ISO 8601 date-time string to timestamp
     * Handles multiple ISO 8601 format variants from Open-Meteo API
     */
    private fun parseIsoDateTime(isoDateTime: String): Long {
        return try {
            // Try common ISO 8601 formats that Open-Meteo API might return
            val formats = listOf(
                SimpleDateFormat("yyyy-MM-dd'T'HH:mm", Locale.US),
                SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.US),
                SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssXXX", Locale.US),
                SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX", Locale.US)
            )
            
            for (format in formats) {
                try {
                    return format.parse(isoDateTime)?.time ?: continue
                } catch (e: Exception) {
                    // Try next format
                    continue
                }
            }
            
            // If all formats fail, log and return current time
            Log.w(TAG, "Failed to parse date-time with any format: $isoDateTime")
            System.currentTimeMillis()
        } catch (e: Exception) {
            Log.w(TAG, "Error parsing date-time: $isoDateTime", e)
            System.currentTimeMillis()
        }
    }
    
    /**
     * Get human-readable weather condition description from WMO code
     * WMO Weather interpretation codes (WW)
     */
    private fun getWeatherConditionDescription(code: Int): String {
        return when (code) {
            0 -> "Clear sky"
            1 -> "Mainly clear"
            2 -> "Partly cloudy"
            3 -> "Overcast"
            45, 48 -> "Foggy"
            51 -> "Light drizzle"
            53 -> "Moderate drizzle"
            55 -> "Dense drizzle"
            61 -> "Slight rain"
            63 -> "Moderate rain"
            65 -> "Heavy rain"
            66, 67 -> "Freezing rain"
            71 -> "Slight snow"
            73 -> "Moderate snow"
            75 -> "Heavy snow"
            77 -> "Snow grains"
            80 -> "Slight rain showers"
            81 -> "Moderate rain showers"
            82 -> "Violent rain showers"
            85 -> "Slight snow showers"
            86 -> "Heavy snow showers"
            95 -> "Thunderstorm"
            96, 99 -> "Thunderstorm with hail"
            else -> "Unknown"
        }
    }

    /**
     * Get hourly forecast data
     */
    suspend fun getHourlyForecast(
        latitude: String,
        longitude: String,
        hours: Int = 24
    ): Result<List<HourlyForecast>> = withContext(Dispatchers.IO) {
        try {
            // Mock implementation
            val forecasts = mutableListOf<HourlyForecast>()
            val baseTemp = 20.0
            
            for (i in 0 until hours) {
                forecasts.add(
                    HourlyForecast(
                        time = System.currentTimeMillis() + (i * 3600 * 1000),
                        temperature = baseTemp + (Math.sin(i.toDouble() / 4) * 5),
                        condition = if (i % 3 == 0) "Sunny" else "Partly Cloudy",
                        conditionCode = if (i % 3 == 0) 0 else 2
                    )
                )
            }
            
            Result.success(forecasts)
        } catch (e: Exception) {
            Log.e(TAG, "Error fetching hourly forecast", e)
            Result.failure(e)
        }
    }

    /**
     * Get daily forecast data
     */
    suspend fun getDailyForecast(
        latitude: String,
        longitude: String,
        days: Int = 7
    ): Result<List<DailyForecast>> = withContext(Dispatchers.IO) {
        try {
            // Mock implementation
            val forecasts = mutableListOf<DailyForecast>()
            val baseTemp = 20.0
            
            for (i in 0 until days) {
                forecasts.add(
                    DailyForecast(
                        date = System.currentTimeMillis() + (i * 24 * 3600 * 1000),
                        highTemp = baseTemp + 5 + (i % 3),
                        lowTemp = baseTemp - 3 - (i % 2),
                        condition = when (i % 4) {
                            0 -> "Sunny"
                            1 -> "Partly Cloudy"
                            2 -> "Cloudy"
                            else -> "Rain"
                        },
                        conditionCode = when (i % 4) {
                            0 -> 0
                            1 -> 2
                            2 -> 3
                            else -> 61
                        }
                    )
                )
            }
            
            Result.success(forecasts)
        } catch (e: Exception) {
            Log.e(TAG, "Error fetching daily forecast", e)
            Result.failure(e)
        }
    }

    /**
     * Cache weather data to file
     */
    private fun cacheWeatherData(data: WeatherData) {
        try {
            val cachedData = CachedWeatherData(data, System.currentTimeMillis())
            val json = gson.toJson(cachedData)
            cacheFile.writeText(json)
            Log.d(TAG, "Weather data cached successfully")
        } catch (e: Exception) {
            Log.e(TAG, "Error caching weather data", e)
        }
    }

    /**
     * Get cached weather data from file
     */
    private fun getCachedWeatherData(): CachedWeatherData? {
        return try {
            if (!cacheFile.exists()) {
                return null
            }

            val json = cacheFile.readText()
            gson.fromJson(json, CachedWeatherData::class.java)
        } catch (e: Exception) {
            Log.e(TAG, "Error reading cached weather data", e)
            null
        }
    }

    /**
     * Check if cached data is still valid
     */
    private fun isCacheValid(timestamp: Long, validityMs: Long = CACHE_VALIDITY_MS): Boolean {
        val age = System.currentTimeMillis() - timestamp
        return age < validityMs
    }

    /**
     * Clear cached data
     */
    fun clearCache() {
        try {
            if (cacheFile.exists()) {
                cacheFile.delete()
                Log.d(TAG, "Cache cleared")
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error clearing cache", e)
        }
    }
}
