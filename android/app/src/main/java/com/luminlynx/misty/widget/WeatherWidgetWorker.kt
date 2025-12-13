package com.luminlynx.misty.widget

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.os.BatteryManager
import android.util.Log
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import com.luminlynx.misty.widget.config.WidgetPreferences
import com.luminlynx.misty.widget.data.WeatherWidgetRepository
import kotlinx.coroutines.flow.first
import java.util.concurrent.TimeUnit

/**
 * WorkManager worker for periodic weather widget updates
 * Handles background updates with battery optimization
 */
class WeatherWidgetWorker(
    context: Context,
    params: WorkerParameters
) : CoroutineWorker(context, params) {

    companion object {
        private const val TAG = "WeatherWidgetWorker"
        private const val WORK_NAME = "weather_widget_update_work"
        private const val LOW_BATTERY_THRESHOLD = 15

        /**
         * Schedule periodic widget updates
         */
        fun schedulePeriodicUpdate(context: Context, intervalMinutes: Long) {
            // Minimum interval is 15 minutes per WorkManager constraints
            val actualInterval = maxOf(intervalMinutes, 15L)
            
            val workRequest = PeriodicWorkRequestBuilder<WeatherWidgetWorker>(
                actualInterval,
                TimeUnit.MINUTES
            ).build()

            WorkManager.getInstance(context).enqueueUniquePeriodicWork(
                WORK_NAME,
                ExistingPeriodicWorkPolicy.UPDATE,
                workRequest
            )

            Log.d(TAG, "Scheduled periodic update every $actualInterval minutes")
        }

        /**
         * Cancel scheduled updates
         */
        fun cancelPeriodicUpdate(context: Context) {
            WorkManager.getInstance(context).cancelUniqueWork(WORK_NAME)
            Log.d(TAG, "Cancelled periodic updates")
        }
    }

    override suspend fun doWork(): Result {
        return try {
            Log.d(TAG, "Starting widget update work")

            // Check battery level and skip update if battery is low
            if (isBatteryLow()) {
                Log.d(TAG, "Battery is low, skipping widget update")
                return Result.success()
            }

            // Get widget preferences
            val preferences = WidgetPreferences(applicationContext)
            val config = preferences.widgetConfig.first()

            // Check if location is set
            if (config.latitude.isEmpty() || config.longitude.isEmpty()) {
                Log.w(TAG, "Location not set, skipping update")
                return Result.success()
            }

            // Fetch weather data
            val repository = WeatherWidgetRepository(applicationContext)
            val isMetric = config.temperatureUnit == "Celsius"
            
            val result = repository.getWeatherData(
                config.latitude,
                config.longitude,
                isMetric,
                forceRefresh = true
            )

            if (result.isSuccess) {
                Log.d(TAG, "Weather data fetched successfully")
                
                // Trigger widget update
                updateAllWidgets()
                
                Result.success()
            } else {
                Log.e(TAG, "Failed to fetch weather data", result.exceptionOrNull())
                // Return success anyway to avoid retries, widget will show cached data
                Result.success()
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error in doWork", e)
            Result.failure()
        }
    }

    /**
     * Check if battery level is low
     */
    private fun isBatteryLow(): Boolean {
        val batteryManager = applicationContext.getSystemService(Context.BATTERY_SERVICE) as? BatteryManager
        return batteryManager?.let {
            val level = it.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY)
            level < LOW_BATTERY_THRESHOLD
        } ?: false
    }

    /**
     * Trigger update for all widget instances
     */
    private fun updateAllWidgets() {
        val appWidgetManager = AppWidgetManager.getInstance(applicationContext)
        val componentName = ComponentName(applicationContext, WeatherWidgetReceiver::class.java)
        val appWidgetIds = appWidgetManager.getAppWidgetIds(componentName)

        if (appWidgetIds.isNotEmpty()) {
            Log.d(TAG, "Updating ${appWidgetIds.size} widget instances")
            // The widget receiver will handle the actual update
            WeatherWidgetReceiver.updateAllWidgets(applicationContext, appWidgetManager, appWidgetIds)
        }
    }
}
