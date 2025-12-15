package com.luminlynx.misty.widget.config

import android.app.Activity
import android.appwidget.AppWidgetManager
import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.glance.appwidget.GlanceAppWidgetManager
import androidx.lifecycle.lifecycleScope
import com.luminlynx.misty.widget.WeatherWidget
import com.luminlynx.misty.widget.WeatherWidgetWorker
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

/**
 * Configuration activity for the weather widget
 * Allows users to customize widget appearance and behavior
 */
class WeatherWidgetConfigActivity : ComponentActivity() {

    private var appWidgetId = AppWidgetManager.INVALID_APPWIDGET_ID
    private lateinit var preferences: WidgetPreferences

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Set result to CANCELED initially
        setResult(Activity.RESULT_CANCELED)

        // Get widget ID from intent
        appWidgetId = intent?.extras?.getInt(
            AppWidgetManager.EXTRA_APPWIDGET_ID,
            AppWidgetManager.INVALID_APPWIDGET_ID
        ) ?: AppWidgetManager.INVALID_APPWIDGET_ID

        // If invalid widget ID, finish
        if (appWidgetId == AppWidgetManager.INVALID_APPWIDGET_ID) {
            finish()
            return
        }

        preferences = WidgetPreferences(this)

        setContent {
            MaterialTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    WeatherWidgetConfigScreen(
                        preferences = preferences,
                        onSaveClick = { saveConfiguration() },
                        onCancelClick = { finish() }
                    )
                }
            }
        }
    }

    private fun saveConfiguration() {
        lifecycleScope.launch {
            // Update widget
            val glanceId = GlanceAppWidgetManager(this@WeatherWidgetConfigActivity).getGlanceIdBy(appWidgetId)
            WeatherWidget().update(this@WeatherWidgetConfigActivity, glanceId)

            // Get update frequency and schedule worker
            val config = preferences.widgetConfig.first()
            WeatherWidgetWorker.schedulePeriodicUpdate(
                this@WeatherWidgetConfigActivity,
                config.updateFrequency.toLong()
            )

            // Set result and finish
            val resultValue = Intent().apply {
                putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId)
            }
            setResult(Activity.RESULT_OK, resultValue)
            finish()
        }
    }
}

/**
 * Configuration screen composable
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WeatherWidgetConfigScreen(
    preferences: WidgetPreferences,
    onSaveClick: () -> Unit,
    onCancelClick: () -> Unit
) {
    val config by preferences.widgetConfig.collectAsState(initial = WidgetPreferences.WidgetConfig(
        theme = "Auto",
        colorScheme = "Blue",
        temperatureUnit = "Celsius",
        updateFrequency = 30,
        transparency = 0,
        fontSize = "Medium",
        showFeelsLike = true,
        showHumidity = true,
        showWind = true,
        showUvIndex = false,
        showSunriseSunset = false,
        location = "",
        latitude = "",
        longitude = ""
    ))

    val scope = rememberCoroutineScope()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Configure Weather Widget") },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer,
                    titleContentColor = MaterialTheme.colorScheme.onPrimaryContainer
                )
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Theme Section
            Text("Theme", style = MaterialTheme.typography.titleMedium)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                listOf("Light", "Dark", "Auto").forEach { theme ->
                    FilterChip(
                        selected = config.theme == theme,
                        onClick = {
                            scope.launch { preferences.setTheme(theme) }
                        },
                        label = { Text(theme) }
                    )
                }
            }

            // Color Scheme Section
            Text("Color Scheme", style = MaterialTheme.typography.titleMedium)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                listOf("Blue", "Purple", "Green", "Orange", "Pink").forEach { color ->
                    FilterChip(
                        selected = config.colorScheme == color,
                        onClick = {
                            scope.launch { preferences.setColorScheme(color) }
                        },
                        label = { Text(color) }
                    )
                }
            }

            // Temperature Unit
            Text("Temperature Unit", style = MaterialTheme.typography.titleMedium)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                listOf("Celsius", "Fahrenheit").forEach { unit ->
                    FilterChip(
                        selected = config.temperatureUnit == unit,
                        onClick = {
                            scope.launch { preferences.setTemperatureUnit(unit) }
                        },
                        label = { Text(unit) }
                    )
                }
            }

            // Font Size
            Text("Font Size", style = MaterialTheme.typography.titleMedium)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                listOf("Small", "Medium", "Large").forEach { size ->
                    FilterChip(
                        selected = config.fontSize == size,
                        onClick = {
                            scope.launch { preferences.setFontSize(size) }
                        },
                        label = { Text(size) }
                    )
                }
            }

            // Update Frequency
            Text("Update Frequency", style = MaterialTheme.typography.titleMedium)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                listOf(15 to "15min", 30 to "30min", 60 to "1hr", 180 to "3hr").forEach { (minutes, label) ->
                    FilterChip(
                        selected = config.updateFrequency == minutes,
                        onClick = {
                            scope.launch { preferences.setUpdateFrequency(minutes) }
                        },
                        label = { Text(label) }
                    )
                }
            }

            // Transparency
            Text("Transparency: ${config.transparency}%", style = MaterialTheme.typography.titleMedium)
            Slider(
                value = config.transparency.toFloat(),
                onValueChange = { value ->
                    scope.launch { preferences.setTransparency(value.toInt()) }
                },
                valueRange = 0f..100f,
                steps = 9
            )

            // Display Options
            Text("Display Options", style = MaterialTheme.typography.titleMedium)
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("Feels Like", modifier = Modifier.weight(1f))
                Switch(
                    checked = config.showFeelsLike,
                    onCheckedChange = { scope.launch { preferences.setShowFeelsLike(it) } }
                )
            }

            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("Humidity", modifier = Modifier.weight(1f))
                Switch(
                    checked = config.showHumidity,
                    onCheckedChange = { scope.launch { preferences.setShowHumidity(it) } }
                )
            }

            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("Wind Speed", modifier = Modifier.weight(1f))
                Switch(
                    checked = config.showWind,
                    onCheckedChange = { scope.launch { preferences.setShowWind(it) } }
                )
            }

            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("UV Index", modifier = Modifier.weight(1f))
                Switch(
                    checked = config.showUvIndex,
                    onCheckedChange = { scope.launch { preferences.setShowUvIndex(it) } }
                )
            }

            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("Sunrise/Sunset", modifier = Modifier.weight(1f))
                Switch(
                    checked = config.showSunriseSunset,
                    onCheckedChange = { scope.launch { preferences.setShowSunriseSunset(it) } }
                )
            }

            // Save and Cancel Buttons
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                OutlinedButton(
                    onClick = onCancelClick,
                    modifier = Modifier.weight(1f)
                ) {
                    Text("Cancel")
                }
                Button(
                    onClick = onSaveClick,
                    modifier = Modifier.weight(1f)
                ) {
                    Text("Save")
                }
            }
        }
    }
}
