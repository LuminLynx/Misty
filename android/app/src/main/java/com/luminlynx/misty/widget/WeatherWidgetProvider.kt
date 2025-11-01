package com.luminlynx.misty.widget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews
import com.luminlynx.misty.R

/**
 * Weather Widget Provider for Android 15
 * Displays weather information in a card-style widget
 */
class WeatherWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        // Update each widget instance
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    override fun onEnabled(context: Context) {
        // Called when the first widget is created
        super.onEnabled(context)
    }

    override fun onDisabled(context: Context) {
        // Called when the last widget is removed
        super.onDisabled(context)
    }

    companion object {
        /**
         * Updates a single widget instance
         */
        fun updateAppWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int
        ) {
            // Create RemoteViews object
            val views = RemoteViews(context.packageName, R.layout.weather_widget_layout)

            // Set default placeholder data
            views.setTextViewText(R.id.widget_location, "Your Location")
            views.setTextViewText(R.id.widget_temperature, "--°")
            views.setTextViewText(R.id.widget_condition, "Loading...")
            views.setTextViewText(R.id.widget_feels_like, "Feels like --°")
            views.setTextViewText(R.id.widget_humidity, "Humidity: --%")
            views.setTextViewText(R.id.widget_wind, "Wind: -- km/h")

            // Set up click intent to open the main app (placeholder)
            val intent = Intent(context, WeatherWidgetProvider::class.java)
            intent.action = AppWidgetManager.ACTION_APPWIDGET_UPDATE
            intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, intArrayOf(appWidgetId))
            
            val pendingIntent = PendingIntent.getBroadcast(
                context,
                appWidgetId,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_root, pendingIntent)

            // Update the widget
            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
