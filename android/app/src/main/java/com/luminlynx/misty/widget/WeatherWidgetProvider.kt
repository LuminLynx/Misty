package com.luminlynx.misty.widget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.os.Build
import android.util.Log
import android.widget.RemoteViews
import com.luminlynx.misty.R

/**
 * Weather Widget Provider for Android 15
 * Displays weather information in a card-style widget
 * Compatible with Android 8.0 (API 26) through Android 15 (API 35)
 */
class WeatherWidgetProvider : AppWidgetProvider() {

    companion object {
        private const val TAG = "WeatherWidgetProvider"
        private const val ACTION_WIDGET_REFRESH = "com.luminlynx.misty.WIDGET_REFRESH"
        
        /**
         * Updates a single widget instance
         */
        fun updateAppWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int
        ) {
            try {
                Log.d(TAG, "Updating widget $appWidgetId on Android ${Build.VERSION.SDK_INT}")
                
                // Create RemoteViews object
                val views = RemoteViews(context.packageName, R.layout.weather_widget_layout)

                // Set default placeholder data
                views.setTextViewText(R.id.widget_location, context.getString(R.string.widget_default_location))
                views.setTextViewText(R.id.widget_temperature, context.getString(R.string.widget_default_temperature))
                views.setTextViewText(R.id.widget_condition, context.getString(R.string.widget_default_condition))
                views.setTextViewText(R.id.widget_feels_like, context.getString(R.string.widget_default_feels_like))
                views.setTextViewText(R.id.widget_humidity, context.getString(R.string.widget_default_humidity))
                views.setTextViewText(R.id.widget_wind, context.getString(R.string.widget_default_wind))
                views.setTextViewText(R.id.widget_last_update, context.getString(R.string.widget_tap_to_refresh))

                // Set up click intent to refresh the widget
                val intent = Intent(context, WeatherWidgetProvider::class.java).apply {
                    action = ACTION_WIDGET_REFRESH
                    putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, intArrayOf(appWidgetId))
                }
                
                // Use FLAG_IMMUTABLE for Android 6.0+ (API 23+) for better security
                // Required for Android 12+ (API 31+)
                val flags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                } else {
                    PendingIntent.FLAG_UPDATE_CURRENT
                }
                
                val pendingIntent = PendingIntent.getBroadcast(
                    context,
                    appWidgetId,
                    intent,
                    flags
                )
                views.setOnClickPendingIntent(R.id.widget_root, pendingIntent)

                // Update the widget
                appWidgetManager.updateAppWidget(appWidgetId, views)
                Log.d(TAG, "Widget $appWidgetId updated successfully")
            } catch (e: Exception) {
                Log.e(TAG, "Error updating widget $appWidgetId", e)
            }
        }
    }

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        Log.d(TAG, "onUpdate called for ${appWidgetIds.size} widgets")
        // Update each widget instance
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)
        
        when (intent.action) {
            ACTION_WIDGET_REFRESH -> {
                Log.d(TAG, "Widget refresh requested")
                val appWidgetManager = AppWidgetManager.getInstance(context)
                val appWidgetIds = intent.getIntArrayExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS)
                if (appWidgetIds != null) {
                    onUpdate(context, appWidgetManager, appWidgetIds)
                }
            }
        }
    }

    override fun onEnabled(context: Context) {
        // Called when the first widget is created
        super.onEnabled(context)
        Log.d(TAG, "First widget enabled")
    }

    override fun onDisabled(context: Context) {
        // Called when the last widget is removed
        super.onDisabled(context)
        Log.d(TAG, "Last widget removed")
    }
}
