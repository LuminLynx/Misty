package com.luminlynx.misty.widget

import android.appwidget.AppWidgetManager
import android.content.Context
import android.util.Log
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetManager
import androidx.glance.appwidget.GlanceAppWidgetReceiver
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch

/**
 * AppWidget receiver for weather widget
 * Uses Jetpack Glance for modern widget implementation
 */
class WeatherWidgetReceiver : GlanceAppWidgetReceiver() {

    companion object {
        private const val TAG = "WeatherWidgetReceiver"

        /**
         * Update all widget instances
         */
        fun updateAllWidgets(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetIds: IntArray
        ) {
            Log.d(TAG, "Updating ${appWidgetIds.size} widgets")
            
            // Glance widgets are automatically updated through the GlanceAppWidget
            // This method is called from WorkManager to trigger updates
            val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main)
            scope.launch {
                val glanceManager = GlanceAppWidgetManager(context)
                val weatherWidget = WeatherWidget()
                appWidgetIds.forEach { widgetId ->
                    try {
                        // Get GlanceId for this widget and update
                        val glanceId = glanceManager.getGlanceIdBy(widgetId)
                        weatherWidget.update(context, glanceId)
                    } catch (e: Exception) {
                        Log.e(TAG, "Error updating widget $widgetId", e)
                    }
                }
            }
        }
    }

    override val glanceAppWidget: GlanceAppWidget = WeatherWidget()

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        super.onUpdate(context, appWidgetManager, appWidgetIds)
        Log.d(TAG, "onUpdate called for ${appWidgetIds.size} widgets")
    }

    override fun onEnabled(context: Context) {
        super.onEnabled(context)
        Log.d(TAG, "First widget enabled, scheduling updates")
        
        // Schedule periodic updates when first widget is added
        WeatherWidgetWorker.schedulePeriodicUpdate(context, 30L)
    }

    override fun onDisabled(context: Context) {
        super.onDisabled(context)
        Log.d(TAG, "Last widget disabled, cancelling updates")
        
        // Cancel periodic updates when last widget is removed
        WeatherWidgetWorker.cancelPeriodicUpdate(context)
    }
}
