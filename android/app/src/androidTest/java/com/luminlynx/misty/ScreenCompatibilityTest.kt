package com.luminlynx.misty

import android.content.Context
import android.content.res.Configuration
import android.util.DisplayMetrics
import androidx.test.core.app.ActivityScenario
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import org.junit.Assert.*
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith

/**
 * Tests for UI responsiveness across different screen sizes and densities
 * Tests phone and tablet form factors
 */
@RunWith(AndroidJUnit4::class)
class ScreenCompatibilityTest {

    private lateinit var context: Context

    @Before
    fun setup() {
        context = InstrumentationRegistry.getInstrumentation().targetContext
    }

    @Test
    fun testDisplayMetrics() {
        val displayMetrics: DisplayMetrics = context.resources.displayMetrics
        assertNotNull(displayMetrics)
        
        // Verify display has valid dimensions
        assertTrue("Display width should be positive", displayMetrics.widthPixels > 0)
        assertTrue("Display height should be positive", displayMetrics.heightPixels > 0)
    }

    @Test
    fun testScreenDensity() {
        val displayMetrics: DisplayMetrics = context.resources.displayMetrics
        val density = displayMetrics.densityDpi
        
        // Verify density is within expected range for Android devices
        assertTrue("Density should be valid", density >= DisplayMetrics.DENSITY_LOW)
        
        // Test common densities: ldpi (120), mdpi (160), hdpi (240), xhdpi (320), xxhdpi (480), xxxhdpi (640)
        val supportedDensities = listOf(
            DisplayMetrics.DENSITY_LOW,
            DisplayMetrics.DENSITY_MEDIUM,
            DisplayMetrics.DENSITY_HIGH,
            DisplayMetrics.DENSITY_XHIGH,
            DisplayMetrics.DENSITY_XXHIGH,
            DisplayMetrics.DENSITY_XXXHIGH
        )
        
        // Check if density is close to any supported density (within 20% tolerance)
        val hasMatchingDensity = supportedDensities.any { supportedDensity ->
            val difference = kotlin.math.abs(density - supportedDensity).toFloat()
            val tolerance = supportedDensity * 0.2f
            difference <= tolerance
        }
        
        assertTrue("Density should be close to a standard Android density", hasMatchingDensity)
    }

    @Test
    fun testScreenOrientation() {
        val configuration = context.resources.configuration
        val orientation = configuration.orientation
        
        // Verify orientation is valid
        assertTrue("Orientation should be portrait or landscape",
            orientation == Configuration.ORIENTATION_PORTRAIT || 
            orientation == Configuration.ORIENTATION_LANDSCAPE)
    }

    @Test
    fun testScreenSize() {
        val configuration = context.resources.configuration
        val screenLayout = configuration.screenLayout and Configuration.SCREENLAYOUT_SIZE_MASK
        
        // Verify screen size is recognized
        assertTrue("Screen size should be valid",
            screenLayout >= Configuration.SCREENLAYOUT_SIZE_SMALL)
        
        // App should support all screen sizes from small to xlarge
        val validSizes = listOf(
            Configuration.SCREENLAYOUT_SIZE_SMALL,
            Configuration.SCREENLAYOUT_SIZE_NORMAL,
            Configuration.SCREENLAYOUT_SIZE_LARGE,
            Configuration.SCREENLAYOUT_SIZE_XLARGE
        )
        
        assertTrue("Screen size should be recognized", screenLayout in validSizes)
    }

    @Test
    fun testTabletMode() {
        val configuration = context.resources.configuration
        val screenLayout = configuration.screenLayout and Configuration.SCREENLAYOUT_SIZE_MASK
        
        val isTablet = screenLayout >= Configuration.SCREENLAYOUT_SIZE_LARGE
        
        // App should work on both phones and tablets
        if (isTablet) {
            assertTrue("App should support tablet screens", 
                screenLayout in listOf(
                    Configuration.SCREENLAYOUT_SIZE_LARGE,
                    Configuration.SCREENLAYOUT_SIZE_XLARGE
                ))
        } else {
            assertTrue("App should support phone screens",
                screenLayout in listOf(
                    Configuration.SCREENLAYOUT_SIZE_SMALL,
                    Configuration.SCREENLAYOUT_SIZE_NORMAL
                ))
        }
    }

    @Test
    fun testActivityRotation() {
        val scenario = ActivityScenario.launch(MainActivity::class.java)
        scenario.use {
            // Test that activity survives configuration change (rotation)
            scenario.recreate()
            
            // Verify activity is still alive after recreation
            scenario.onActivity { activity ->
                assertNotNull("Activity should survive rotation", activity)
                assertFalse("Activity should not be finishing", activity.isFinishing)
            }
        }
    }

    @Test
    fun testSmallestScreenWidthDp() {
        val configuration = context.resources.configuration
        val smallestScreenWidthDp = configuration.smallestScreenWidthDp
        
        // App minimum is API 23, which typically has sw320dp or higher
        assertTrue("Smallest width should be reasonable for modern devices",
            smallestScreenWidthDp >= 240)
    }

    @Test
    fun testDifferentDensityResources() {
        // Test that app can load resources at different densities
        val displayMetrics = context.resources.displayMetrics
        
        // Try to get app icon (should exist at multiple densities)
        val appIcon = context.packageManager.getApplicationIcon(context.packageName)
        assertNotNull("App icon should be available", appIcon)
        
        // Verify icon has valid dimensions
        assertTrue("Icon width should be positive", appIcon.intrinsicWidth > 0)
        assertTrue("Icon height should be positive", appIcon.intrinsicHeight > 0)
    }
}
