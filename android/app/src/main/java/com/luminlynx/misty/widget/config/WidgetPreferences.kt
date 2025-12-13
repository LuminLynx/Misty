package com.luminlynx.misty.widget.config

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

/**
 * Widget preferences using DataStore
 * Manages widget configuration and customization settings
 */
class WidgetPreferences(private val context: Context) {

    companion object {
        private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "widget_preferences")

        // Preference keys
        private val THEME_KEY = stringPreferencesKey("theme")
        private val COLOR_SCHEME_KEY = stringPreferencesKey("color_scheme")
        private val TEMPERATURE_UNIT_KEY = stringPreferencesKey("temperature_unit")
        private val UPDATE_FREQUENCY_KEY = intPreferencesKey("update_frequency")
        private val TRANSPARENCY_KEY = intPreferencesKey("transparency")
        private val FONT_SIZE_KEY = stringPreferencesKey("font_size")
        private val SHOW_FEELS_LIKE_KEY = booleanPreferencesKey("show_feels_like")
        private val SHOW_HUMIDITY_KEY = booleanPreferencesKey("show_humidity")
        private val SHOW_WIND_KEY = booleanPreferencesKey("show_wind")
        private val SHOW_UV_INDEX_KEY = booleanPreferencesKey("show_uv_index")
        private val SHOW_SUNRISE_SUNSET_KEY = booleanPreferencesKey("show_sunrise_sunset")
        private val LOCATION_KEY = stringPreferencesKey("location")
        private val LATITUDE_KEY = stringPreferencesKey("latitude")
        private val LONGITUDE_KEY = stringPreferencesKey("longitude")
    }

    /**
     * Get theme preference (Light, Dark, Auto)
     */
    val theme: Flow<String> = context.dataStore.data.map { preferences ->
        preferences[THEME_KEY] ?: "Auto"
    }

    /**
     * Get color scheme preference
     */
    val colorScheme: Flow<String> = context.dataStore.data.map { preferences ->
        preferences[COLOR_SCHEME_KEY] ?: "Blue"
    }

    /**
     * Get temperature unit (Celsius/Fahrenheit)
     */
    val temperatureUnit: Flow<String> = context.dataStore.data.map { preferences ->
        preferences[TEMPERATURE_UNIT_KEY] ?: "Celsius"
    }

    /**
     * Get update frequency in minutes
     */
    val updateFrequency: Flow<Int> = context.dataStore.data.map { preferences ->
        preferences[UPDATE_FREQUENCY_KEY] ?: 30
    }

    /**
     * Get background transparency (0-100)
     */
    val transparency: Flow<Int> = context.dataStore.data.map { preferences ->
        preferences[TRANSPARENCY_KEY] ?: 0
    }

    /**
     * Get font size (Small, Medium, Large)
     */
    val fontSize: Flow<String> = context.dataStore.data.map { preferences ->
        preferences[FONT_SIZE_KEY] ?: "Medium"
    }

    /**
     * Get metric visibility settings
     */
    val showFeelsLike: Flow<Boolean> = context.dataStore.data.map { preferences ->
        preferences[SHOW_FEELS_LIKE_KEY] ?: true
    }

    val showHumidity: Flow<Boolean> = context.dataStore.data.map { preferences ->
        preferences[SHOW_HUMIDITY_KEY] ?: true
    }

    val showWind: Flow<Boolean> = context.dataStore.data.map { preferences ->
        preferences[SHOW_WIND_KEY] ?: true
    }

    val showUvIndex: Flow<Boolean> = context.dataStore.data.map { preferences ->
        preferences[SHOW_UV_INDEX_KEY] ?: false
    }

    val showSunriseSunset: Flow<Boolean> = context.dataStore.data.map { preferences ->
        preferences[SHOW_SUNRISE_SUNSET_KEY] ?: false
    }

    /**
     * Get location preferences
     */
    val location: Flow<String> = context.dataStore.data.map { preferences ->
        preferences[LOCATION_KEY] ?: ""
    }

    val latitude: Flow<String> = context.dataStore.data.map { preferences ->
        preferences[LATITUDE_KEY] ?: ""
    }

    val longitude: Flow<String> = context.dataStore.data.map { preferences ->
        preferences[LONGITUDE_KEY] ?: ""
    }

    /**
     * Save theme preference
     */
    suspend fun setTheme(theme: String) {
        context.dataStore.edit { preferences ->
            preferences[THEME_KEY] = theme
        }
    }

    /**
     * Save color scheme preference
     */
    suspend fun setColorScheme(colorScheme: String) {
        context.dataStore.edit { preferences ->
            preferences[COLOR_SCHEME_KEY] = colorScheme
        }
    }

    /**
     * Save temperature unit
     */
    suspend fun setTemperatureUnit(unit: String) {
        context.dataStore.edit { preferences ->
            preferences[TEMPERATURE_UNIT_KEY] = unit
        }
    }

    /**
     * Save update frequency
     */
    suspend fun setUpdateFrequency(minutes: Int) {
        context.dataStore.edit { preferences ->
            preferences[UPDATE_FREQUENCY_KEY] = minutes
        }
    }

    /**
     * Save transparency level
     */
    suspend fun setTransparency(level: Int) {
        context.dataStore.edit { preferences ->
            preferences[TRANSPARENCY_KEY] = level
        }
    }

    /**
     * Save font size
     */
    suspend fun setFontSize(size: String) {
        context.dataStore.edit { preferences ->
            preferences[FONT_SIZE_KEY] = size
        }
    }

    /**
     * Save metric visibility settings
     */
    suspend fun setShowFeelsLike(show: Boolean) {
        context.dataStore.edit { preferences ->
            preferences[SHOW_FEELS_LIKE_KEY] = show
        }
    }

    suspend fun setShowHumidity(show: Boolean) {
        context.dataStore.edit { preferences ->
            preferences[SHOW_HUMIDITY_KEY] = show
        }
    }

    suspend fun setShowWind(show: Boolean) {
        context.dataStore.edit { preferences ->
            preferences[SHOW_WIND_KEY] = show
        }
    }

    suspend fun setShowUvIndex(show: Boolean) {
        context.dataStore.edit { preferences ->
            preferences[SHOW_UV_INDEX_KEY] = show
        }
    }

    suspend fun setShowSunriseSunset(show: Boolean) {
        context.dataStore.edit { preferences ->
            preferences[SHOW_SUNRISE_SUNSET_KEY] = show
        }
    }

    /**
     * Save location preferences
     */
    suspend fun setLocation(location: String, latitude: String, longitude: String) {
        context.dataStore.edit { preferences ->
            preferences[LOCATION_KEY] = location
            preferences[LATITUDE_KEY] = latitude
            preferences[LONGITUDE_KEY] = longitude
        }
    }

    /**
     * Get all preferences as a combined flow
     */
    data class WidgetConfig(
        val theme: String,
        val colorScheme: String,
        val temperatureUnit: String,
        val updateFrequency: Int,
        val transparency: Int,
        val fontSize: String,
        val showFeelsLike: Boolean,
        val showHumidity: Boolean,
        val showWind: Boolean,
        val showUvIndex: Boolean,
        val showSunriseSunset: Boolean,
        val location: String,
        val latitude: String,
        val longitude: String
    )

    val widgetConfig: Flow<WidgetConfig> = context.dataStore.data.map { preferences ->
        WidgetConfig(
            theme = preferences[THEME_KEY] ?: "Auto",
            colorScheme = preferences[COLOR_SCHEME_KEY] ?: "Blue",
            temperatureUnit = preferences[TEMPERATURE_UNIT_KEY] ?: "Celsius",
            updateFrequency = preferences[UPDATE_FREQUENCY_KEY] ?: 30,
            transparency = preferences[TRANSPARENCY_KEY] ?: 0,
            fontSize = preferences[FONT_SIZE_KEY] ?: "Medium",
            showFeelsLike = preferences[SHOW_FEELS_LIKE_KEY] ?: true,
            showHumidity = preferences[SHOW_HUMIDITY_KEY] ?: true,
            showWind = preferences[SHOW_WIND_KEY] ?: true,
            showUvIndex = preferences[SHOW_UV_INDEX_KEY] ?: false,
            showSunriseSunset = preferences[SHOW_SUNRISE_SUNSET_KEY] ?: false,
            location = preferences[LOCATION_KEY] ?: "",
            latitude = preferences[LATITUDE_KEY] ?: "",
            longitude = preferences[LONGITUDE_KEY] ?: ""
        )
    }
}
