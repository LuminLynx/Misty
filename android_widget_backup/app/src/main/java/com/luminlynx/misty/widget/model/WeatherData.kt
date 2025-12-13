package com.luminlynx.misty.widget.model

/**
 * Data model for weather information displayed in the widget
 */
data class WeatherData(
    val location: String,
    val temperature: Double,
    val feelsLike: Double,
    val condition: String,
    val conditionCode: Int,
    val humidity: Int,
    val windSpeed: Double,
    val highTemp: Double,
    val lowTemp: Double,
    val uvIndex: Int? = null,
    val sunrise: Long? = null,
    val sunset: Long? = null,
    val lastUpdate: Long,
    val isMetric: Boolean = true
) {
    /**
     * Get formatted temperature string with appropriate unit
     */
    fun getFormattedTemperature(): String {
        val unit = if (isMetric) "°C" else "°F"
        return "${temperature.toInt()}$unit"
    }

    /**
     * Get formatted feels like temperature
     */
    fun getFormattedFeelsLike(): String {
        val unit = if (isMetric) "°C" else "°F"
        return "Feels like ${feelsLike.toInt()}$unit"
    }

    /**
     * Get formatted high/low temperature range
     */
    fun getFormattedHighLow(): String {
        val unit = if (isMetric) "°C" else "°F"
        return "H:${highTemp.toInt()}$unit L:${lowTemp.toInt()}$unit"
    }

    /**
     * Get formatted humidity
     */
    fun getFormattedHumidity(): String = "Humidity: $humidity%"

    /**
     * Get formatted wind speed
     */
    fun getFormattedWindSpeed(): String {
        val unit = if (isMetric) "km/h" else "mph"
        return "Wind: ${windSpeed.toInt()} $unit"
    }

    /**
     * Get weather icon resource name based on condition code
     */
    fun getWeatherIconName(): String {
        // WMO Weather interpretation codes (WW)
        return when (conditionCode) {
            0 -> "ic_clear_sky"
            1, 2, 3 -> "ic_partly_cloudy"
            45, 48 -> "ic_fog"
            51, 53, 55 -> "ic_drizzle"
            61, 63, 65 -> "ic_rain"
            66, 67 -> "ic_freezing_rain"
            71, 73, 75 -> "ic_snow"
            77 -> "ic_snow_grains"
            80, 81, 82 -> "ic_rain_showers"
            85, 86 -> "ic_snow_showers"
            95 -> "ic_thunderstorm"
            96, 99 -> "ic_thunderstorm_hail"
            else -> "ic_weather_placeholder"
        }
    }
}

/**
 * Hourly forecast data
 */
data class HourlyForecast(
    val time: Long,
    val temperature: Double,
    val condition: String,
    val conditionCode: Int
)

/**
 * Daily forecast data
 */
data class DailyForecast(
    val date: Long,
    val highTemp: Double,
    val lowTemp: Double,
    val condition: String,
    val conditionCode: Int
)
