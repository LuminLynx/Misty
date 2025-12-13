package com.luminlynx.misty.widget.api

import retrofit2.http.GET
import retrofit2.http.Query

/**
 * Retrofit interface for Open-Meteo API
 * https://open-meteo.com/en/docs
 */
interface OpenMeteoApiService {

    /**
     * Get weather forecast data
     */
    @GET("v1/forecast")
    suspend fun getWeatherForecast(
        @Query("latitude") latitude: Double,
        @Query("longitude") longitude: Double,
        @Query("current") current: String = "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
        @Query("daily") daily: String = "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max",
        @Query("timezone") timezone: String = "auto",
        @Query("forecast_days") forecastDays: Int = 7
    ): WeatherForecastResponse
}

/**
 * Geocoding API service
 */
interface GeocodingApiService {
    
    /**
     * Search for location by name
     */
    @GET("v1/search")
    suspend fun searchLocation(
        @Query("name") name: String,
        @Query("count") count: Int = 1,
        @Query("language") language: String = "en",
        @Query("format") format: String = "json"
    ): GeocodingResponse
}

/**
 * Response model for weather forecast
 */
data class WeatherForecastResponse(
    val latitude: Double,
    val longitude: Double,
    val timezone: String,
    val current: CurrentWeatherResponse,
    val daily: DailyWeatherResponse
)

/**
 * Current weather data from API
 */
data class CurrentWeatherResponse(
    val time: String,
    val temperature_2m: Double,
    val relative_humidity_2m: Int,
    val apparent_temperature: Double,
    val weather_code: Int,
    val wind_speed_10m: Double
)

/**
 * Daily weather data from API
 */
data class DailyWeatherResponse(
    val time: List<String>,
    val weather_code: List<Int>,
    val temperature_2m_max: List<Double>,
    val temperature_2m_min: List<Double>,
    val sunrise: List<String>,
    val sunset: List<String>,
    val uv_index_max: List<Double>
)

/**
 * Geocoding response for location search
 */
data class GeocodingResponse(
    val results: List<GeocodingResult>?
)

/**
 * Individual geocoding result
 */
data class GeocodingResult(
    val id: Int,
    val name: String,
    val latitude: Double,
    val longitude: Double,
    val country: String?,
    val admin1: String?
)
