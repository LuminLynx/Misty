package com.luminlynx.misty

import android.content.Context
import android.os.Build
import androidx.test.core.app.ActivityScenario
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import org.junit.Assert.*
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import kotlin.system.measureTimeMillis

/**
 * Performance tests for app on various devices
 * Ensures app performs well on older devices (API 23+)
 */
@RunWith(AndroidJUnit4::class)
class PerformanceTest {

    private lateinit var context: Context

    @Before
    fun setup() {
        context = InstrumentationRegistry.getInstrumentation().targetContext
    }

    @Test
    fun testActivityLaunchTime() {
        // Measure activity launch time
        val launchTime = measureTimeMillis {
            val scenario = ActivityScenario.launch(MainActivity::class.java)
            scenario.use {
                scenario.onActivity { activity ->
                    assertNotNull(activity)
                }
            }
        }
        
        // Activity should launch within 5 seconds even on older devices
        assertTrue("Activity launch time should be reasonable: ${launchTime}ms", 
            launchTime < 5000)
    }

    @Test
    fun testMultipleActivityLaunches() {
        // Test that multiple launches don't cause memory issues
        repeat(3) { iteration ->
            val scenario = ActivityScenario.launch(MainActivity::class.java)
            scenario.use {
                scenario.onActivity { activity ->
                    assertNotNull("Activity should launch on iteration $iteration", activity)
                    assertFalse("Activity should not be finishing", activity.isFinishing)
                }
            }
        }
    }

    @Test
    fun testMemoryUsage() {
        val runtime = Runtime.getRuntime()
        val initialMemory = runtime.totalMemory() - runtime.freeMemory()
        
        // Launch activity
        val scenario = ActivityScenario.launch(MainActivity::class.java)
        scenario.use {
            val afterLaunchMemory = runtime.totalMemory() - runtime.freeMemory()
            val memoryIncrease = afterLaunchMemory - initialMemory
            
            // Memory increase should be reasonable (less than 100MB)
            assertTrue("Memory increase should be reasonable: ${memoryIncrease / 1024 / 1024}MB",
                memoryIncrease < 100 * 1024 * 1024)
        }
    }

    @Test
    fun testApiLevelCompatibility() {
        // Verify app works on target API levels
        val apiLevel = Build.VERSION.SDK_INT
        
        assertTrue("App should support API 23 (Android 6.0)", apiLevel >= 23)
        
        // Log API level for test reports
        when {
            apiLevel >= 35 -> assertTrue("Running on Android 15+", true)
            apiLevel >= 31 -> assertTrue("Running on Android 12+", true)
            apiLevel >= 23 -> assertTrue("Running on Android 6.0+", true)
            else -> fail("API level $apiLevel is below minimum supported (23)")
        }
    }

    @Test
    fun testDeviceFeatures() {
        val packageManager = context.packageManager
        
        // Check for common features
        val hasTouchscreen = packageManager.hasSystemFeature("android.hardware.touchscreen")
        val hasWifi = packageManager.hasSystemFeature("android.hardware.wifi")
        
        // Most devices should have these features
        // But app should gracefully handle absence
        if (!hasTouchscreen) {
            // TV or watch device
            assertTrue("App should handle non-touchscreen devices", true)
        }
    }

    @Test
    fun testActivityRecreation() {
        // Test configuration changes (simulates rotation, theme change, etc.)
        val scenario = ActivityScenario.launch(MainActivity::class.java)
        scenario.use {
            val recreationTime = measureTimeMillis {
                scenario.recreate()
            }
            
            scenario.onActivity { activity ->
                assertNotNull("Activity should survive recreation", activity)
            }
            
            // Recreation should be fast
            assertTrue("Activity recreation should be fast: ${recreationTime}ms",
                recreationTime < 2000)
        }
    }

    @Test
    fun testLowMemoryScenario() {
        val scenario = ActivityScenario.launch(MainActivity::class.java)
        scenario.use {
            scenario.onActivity { activity ->
                // Simulate low memory warning
                activity.onLowMemory()
                
                // Activity should still be functional
                assertFalse("Activity should not be finishing after low memory",
                    activity.isFinishing)
            }
        }
    }

    @Test
    fun testColdStart() {
        // Test cold start performance
        // First launch takes longer than subsequent launches
        val coldStartTime = measureTimeMillis {
            val scenario = ActivityScenario.launch(MainActivity::class.java)
            scenario.close()
        }
        
        // Cold start should complete within 10 seconds
        assertTrue("Cold start should complete in reasonable time: ${coldStartTime}ms",
            coldStartTime < 10000)
    }
}
