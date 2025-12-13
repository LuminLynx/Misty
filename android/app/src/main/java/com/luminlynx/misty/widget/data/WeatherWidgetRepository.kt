package com.luminlynx.misty.widget.data

import android.content.Context
import android.util.Log
import com.luminlynx.misty.widget.model.WeatherData
import com.luminlynx.misty.widget.model.HourlyForecast
import com.luminlynx.misty.widget.model.DailyForecast
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File
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
     * Fetch weather data from API (mock implementation)
     * In production, this would use Retrofit to call Open-Meteo API
     */
    private suspend fun fetchWeatherDataFromApi(
        latitude: String,
        longitude: String,
        isMetric: Boolean
    ): WeatherData {
        // Mock implementation - returns sample data
        // TODO: In production, integrate with Open-Meteo API
        // Example API call:
        // val response = weatherApi.getCurrentWeather(latitude, longitude)
        // return response.toWeatherData()
        //
        // This mock implementation is intentional for the initial widget release.
        // The main Capacitor app uses the real Open-Meteo API via web layer.
        // Future enhancement: Share weather data between app and widget.
        
        Log.d(TAG, "Fetching weather data for lat=$latitude, lon=$longitude (using mock data)")
        
        // Simulate network delay
        kotlinx.coroutines.delay(500)
        
        // Return mock data for widget demonstration
        return WeatherData(
            location = "San Francisco",
            temperature = if (isMetric) 22.0 else 72.0,
            feelsLike = if (isMetric) 20.0 else 68.0,
            condition = "Partly Cloudy",
            conditionCode = 2,
            humidity = 65,
            windSpeed = if (isMetric) 15.0 else 9.0,
            highTemp = if (isMetric) 25.0 else 77.0,
            lowTemp = if (isMetric) 18.0 else 64.0,
            uvIndex = 6,
            sunrise = System.currentTimeMillis() - 6 * 3600 * 1000,
            sunset = System.currentTimeMillis() + 6 * 3600 * 1000,
            lastUpdate = System.currentTimeMillis(),
            isMetric = isMetric
        )
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
