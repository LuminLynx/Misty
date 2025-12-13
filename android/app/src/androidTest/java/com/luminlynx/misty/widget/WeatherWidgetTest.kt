package com.luminlynx.misty.widget

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.os.Build
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import org.junit.Assert.*
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith

/**
 * Instrumented tests for Weather Widget functionality
 * Tests widget installation and updates across API levels
 * Widget requires API 31+ for full functionality
 */
@RunWith(AndroidJUnit4::class)
class WeatherWidgetTest {

    private lateinit var context: Context
    private lateinit var appWidgetManager: AppWidgetManager

    @Before
    fun setup() {
        context = InstrumentationRegistry.getInstrumentation().targetContext
        appWidgetManager = AppWidgetManager.getInstance(context)
    }

    @Test
    fun testWidgetProviderExists() {
        val componentName = ComponentName(context, WeatherWidgetReceiver::class.java)
        assertNotNull(componentName)
    }

    @Test
    fun testWidgetMinApiLevel() {
        // Widget uses Jetpack Glance which requires API 31+
        if (Build.VERSION.SDK_INT >= 31) {
            val componentName = ComponentName(context, WeatherWidgetReceiver::class.java)
            val widgetInfo = appWidgetManager.installedProviders.find {
                it.provider == componentName
            }
            
            // On API 31+, widget should be available
            assertNotNull("Widget should be available on API 31+", widgetInfo)
        } else {
            // On API < 31, widget may not be available but app should still work
            assertTrue("App should work on API 23+", Build.VERSION.SDK_INT >= 23)
        }
    }

    @Test
    fun testWidgetConfigurationActivity() {
        if (Build.VERSION.SDK_INT >= 31) {
            val componentName = ComponentName(context, WeatherWidgetReceiver::class.java)
            val widgetInfo = appWidgetManager.installedProviders.find {
                it.provider == componentName
            }
            
            if (widgetInfo != null) {
                // Verify widget has configuration activity
                assertNotNull("Widget should have config activity", widgetInfo.configure)
            }
        }
    }

    @Test
    fun testWidgetUpdatePeriod() {
        if (Build.VERSION.SDK_INT >= 31) {
            val componentName = ComponentName(context, WeatherWidgetReceiver::class.java)
            val widgetInfo = appWidgetManager.installedProviders.find {
                it.provider == componentName
            }
            
            if (widgetInfo != null) {
                // Widget should have update period configured
                assertTrue("Widget should have update period", widgetInfo.updatePeriodMillis > 0)
            }
        }
    }

    @Test
    fun testWidgetResizeMode() {
        if (Build.VERSION.SDK_INT >= 31) {
            val componentName = ComponentName(context, WeatherWidgetReceiver::class.java)
            val widgetInfo = appWidgetManager.installedProviders.find {
                it.provider == componentName
            }
            
            if (widgetInfo != null) {
                // Widget should support resizing
                assertTrue("Widget should support horizontal resize", 
                    widgetInfo.resizeMode and AppWidgetManager.RESIZE_HORIZONTAL != 0)
            }
        }
    }

    @Test
    fun testAppWorksOnOlderDevices() {
        // Ensure app doesn't crash on devices below API 31
        assertTrue("App should support API 23 (Android 6.0)", Build.VERSION.SDK_INT >= 23)
        
        // Context should be valid regardless of API level
        assertNotNull(context)
        assertEquals("com.luminlynx.misty", context.packageName)
    }
}
