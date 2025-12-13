package com.luminlynx.misty.widget

import android.content.Context
import android.content.Intent
import android.content.res.Configuration
import android.os.Build
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.glance.GlanceId
import androidx.glance.GlanceModifier
import androidx.glance.GlanceTheme
import androidx.glance.Image
import androidx.glance.ImageProvider
import androidx.glance.action.clickable
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.provideContent
import androidx.glance.appwidget.action.actionStartActivity
import androidx.glance.background
import androidx.glance.layout.Alignment
import androidx.glance.layout.Box
import androidx.glance.layout.Column
import androidx.glance.layout.Row
import androidx.glance.layout.Spacer
import androidx.glance.layout.fillMaxSize
import androidx.glance.layout.fillMaxWidth
import androidx.glance.layout.height
import androidx.glance.layout.padding
import androidx.glance.layout.size
import androidx.glance.layout.width
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import com.luminlynx.misty.R
import com.luminlynx.misty.widget.config.WidgetPreferences
import com.luminlynx.misty.widget.data.WeatherWidgetRepository
import kotlinx.coroutines.flow.first

/**
 * Weather Widget using Jetpack Glance
 * Modern widget implementation for Android 12+
 */
class WeatherWidget : GlanceAppWidget() {

    override suspend fun provideGlance(context: Context, id: GlanceId) {
        // Load preferences and data
        val preferences = WidgetPreferences(context)
        val config = preferences.widgetConfig.first()
        
        // Fetch weather data
        val repository = WeatherWidgetRepository(context)
        val isMetric = config.temperatureUnit == "Celsius"
        
        val weatherResult = if (config.latitude.isNotEmpty() && config.longitude.isNotEmpty()) {
            repository.getWeatherData(config.latitude, config.longitude, isMetric)
        } else {
            null
        }

        provideContent {
            GlanceTheme {
                WeatherWidgetContent(
                    context = context,
                    weatherData = weatherResult?.getOrNull(),
                    config = config,
                    isDarkTheme = isDarkTheme(context, config.theme)
                )
            }
        }
    }

    /**
     * Determine if dark theme should be used
     */
    private fun isDarkTheme(context: Context, themePreference: String): Boolean {
        return when (themePreference) {
            "Light" -> false
            "Dark" -> true
            "Auto" -> {
                val uiMode = context.resources.configuration.uiMode and Configuration.UI_MODE_NIGHT_MASK
                uiMode == Configuration.UI_MODE_NIGHT_YES
            }
            else -> false
        }
    }
}

/**
 * Main widget content composable
 */
@Composable
private fun WeatherWidgetContent(
    context: Context,
    weatherData: com.luminlynx.misty.widget.model.WeatherData?,
    config: WidgetPreferences.WidgetConfig,
    isDarkTheme: Boolean
) {
    // Determine background color based on theme and color scheme
    val backgroundColor = getBackgroundColor(config.colorScheme, isDarkTheme, config.transparency)
    val textColor = if (isDarkTheme) Color.White else Color.Black
    val secondaryTextColor = if (isDarkTheme) Color(0xFFE0E0E0) else Color(0xFF606060)

    Box(
        modifier = GlanceModifier
            .fillMaxSize()
            .background(backgroundColor)
            .padding(16.dp)
            .clickable(actionStartActivity<MainActivity>()),
        contentAlignment = Alignment.Center
    ) {
        if (weatherData != null) {
            Column(
                modifier = GlanceModifier.fillMaxWidth(),
                verticalAlignment = Alignment.Top,
                horizontalAlignment = Alignment.Start
            ) {
                // Location
                Text(
                    text = weatherData.location,
                    style = TextStyle(
                        fontSize = getFontSize(config.fontSize, 16),
                        fontWeight = FontWeight.Bold,
                        color = androidx.glance.unit.ColorProvider(textColor)
                    )
                )

                Spacer(modifier = GlanceModifier.height(8.dp))

                // Temperature and icon
                Row(
                    modifier = GlanceModifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Weather icon - dynamically selected based on condition code
                    val iconResId = context.resources.getIdentifier(
                        weatherData.getWeatherIconName(),
                        "drawable",
                        context.packageName
                    )
                    Image(
                        provider = ImageProvider(
                            if (iconResId != 0) iconResId else R.drawable.ic_weather_placeholder
                        ),
                        contentDescription = weatherData.condition,
                        modifier = GlanceModifier.size(48.dp)
                    )

                    Spacer(modifier = GlanceModifier.width(12.dp))

                    // Temperature
                    Text(
                        text = weatherData.getFormattedTemperature(),
                        style = TextStyle(
                            fontSize = getFontSize(config.fontSize, 36),
                            fontWeight = FontWeight.Bold,
                            color = androidx.glance.unit.ColorProvider(textColor)
                        )
                    )

                    Spacer(modifier = GlanceModifier.width(8.dp))

                    // Condition
                    Text(
                        text = weatherData.condition,
                        style = TextStyle(
                            fontSize = getFontSize(config.fontSize, 14),
                            color = androidx.glance.unit.ColorProvider(secondaryTextColor)
                        )
                    )
                }

                Spacer(modifier = GlanceModifier.height(8.dp))

                // High/Low temperatures
                Text(
                    text = weatherData.getFormattedHighLow(),
                    style = TextStyle(
                        fontSize = getFontSize(config.fontSize, 12),
                        color = androidx.glance.unit.ColorProvider(secondaryTextColor)
                    )
                )

                // Feels like (if enabled)
                if (config.showFeelsLike) {
                    Spacer(modifier = GlanceModifier.height(4.dp))
                    Text(
                        text = weatherData.getFormattedFeelsLike(),
                        style = TextStyle(
                            fontSize = getFontSize(config.fontSize, 12),
                            color = androidx.glance.unit.ColorProvider(secondaryTextColor)
                        )
                    )
                }

                Spacer(modifier = GlanceModifier.height(8.dp))

                // Additional metrics
                Row(
                    modifier = GlanceModifier.fillMaxWidth()
                ) {
                    // Humidity
                    if (config.showHumidity) {
                        Text(
                            text = weatherData.getFormattedHumidity(),
                            style = TextStyle(
                                fontSize = getFontSize(config.fontSize, 12),
                                color = androidx.glance.unit.ColorProvider(secondaryTextColor)
                            ),
                            modifier = GlanceModifier.defaultWeight()
                        )
                    }

                    // Wind
                    if (config.showWind) {
                        Text(
                            text = weatherData.getFormattedWindSpeed(),
                            style = TextStyle(
                                fontSize = getFontSize(config.fontSize, 12),
                                color = androidx.glance.unit.ColorProvider(secondaryTextColor)
                            ),
                            modifier = GlanceModifier.defaultWeight()
                        )
                    }
                }

                // UV Index (if enabled and available)
                if (config.showUvIndex && weatherData.uvIndex != null) {
                    Spacer(modifier = GlanceModifier.height(4.dp))
                    Text(
                        text = "UV Index: ${weatherData.uvIndex}",
                        style = TextStyle(
                            fontSize = getFontSize(config.fontSize, 12),
                            color = androidx.glance.unit.ColorProvider(secondaryTextColor)
                        )
                    )
                }

                Spacer(modifier = GlanceModifier.height(8.dp))

                // Last update
                Text(
                    text = "Tap to refresh",
                    style = TextStyle(
                        fontSize = getFontSize(config.fontSize, 10),
                        color = androidx.glance.unit.ColorProvider(secondaryTextColor.copy(alpha = 0.6f))
                    )
                )
            }
        } else {
            // Loading or error state
            Column(
                modifier = GlanceModifier.fillMaxSize(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "Loading weather...",
                    style = TextStyle(
                        fontSize = getFontSize(config.fontSize, 14),
                        color = androidx.glance.unit.ColorProvider(textColor)
                    )
                )
                Spacer(modifier = GlanceModifier.height(8.dp))
                Text(
                    text = "Tap to configure",
                    style = TextStyle(
                        fontSize = getFontSize(config.fontSize, 12),
                        color = androidx.glance.unit.ColorProvider(secondaryTextColor)
                    )
                )
            }
        }
    }
}

/**
 * Get background color based on color scheme and theme
 */
private fun getBackgroundColor(colorScheme: String, isDarkTheme: Boolean, transparency: Int): Color {
    val alpha = 1f - (transparency / 100f)
    
    val baseColor = when (colorScheme) {
        "Blue" -> if (isDarkTheme) Color(0xFF1E3A8A) else Color(0xFF3B82F6)
        "Purple" -> if (isDarkTheme) Color(0xFF6B21A8) else Color(0xFF9333EA)
        "Green" -> if (isDarkTheme) Color(0xFF065F46) else Color(0xFF10B981)
        "Orange" -> if (isDarkTheme) Color(0xFF9A3412) else Color(0xFFF97316)
        "Pink" -> if (isDarkTheme) Color(0xFF9F1239) else Color(0xFFEC4899)
        else -> if (isDarkTheme) Color(0xFF1E3A8A) else Color(0xFF3B82F6)
    }
    
    return baseColor.copy(alpha = alpha)
}

/**
 * Get font size based on preference
 */
private fun getFontSize(sizePreference: String, baseSizeSp: Int): androidx.compose.ui.unit.TextUnit {
    val multiplier = when (sizePreference) {
        "Small" -> 0.875f
        "Large" -> 1.125f
        else -> 1f // Medium
    }
    return (baseSizeSp * multiplier).sp
}

/**
 * Placeholder MainActivity for widget click action
 * 
 * IMPORTANT: This is a placeholder that should be replaced with your actual main app activity.
 * 
 * To integrate with your main app:
 * 1. Replace the clickable action in WeatherWidgetContent:
 *    .clickable(actionStartActivity<YourMainActivity>())
 * 
 * 2. Or handle deep links to specific screens:
 *    .clickable(
 *        actionStartActivity(
 *            Intent(context, YourMainActivity::class.java).apply {
 *                action = "com.luminlynx.misty.OPEN_WEATHER"
 *                putExtra("LOCATION", weatherData.location)
 *            }
 *        )
 *    )
 * 
 * See WIDGET_INTEGRATION_GUIDE.md for detailed integration instructions.
 */
class MainActivity : android.app.Activity() {
    override fun onCreate(savedInstanceState: android.os.Bundle?) {
        super.onCreate(savedInstanceState)
        // TODO: Replace with actual main app launch intent
        // For now, just finish to avoid showing empty activity
        finish()
    }
}
