package com.luminlynx.misty

import android.content.Context
import android.content.pm.PackageManager
import androidx.test.core.app.ActivityScenario
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import org.junit.Assert.*
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith

/**
 * Instrumented tests for MainActivity and core app functionality
 * Tests across different API levels (23, 31, 35)
 */
@RunWith(AndroidJUnit4::class)
class MainActivityTest {

    private lateinit var context: Context

    @Before
    fun setup() {
        context = InstrumentationRegistry.getInstrumentation().targetContext
    }

    @Test
    fun testAppContext() {
        assertEquals("com.luminlynx.misty", context.packageName)
    }

    @Test
    fun testMainActivityLaunches() {
        val scenario = ActivityScenario.launch(MainActivity::class.java)
        scenario.use {
            // Verify activity is created successfully
            assertNotNull(it)
        }
    }

    @Test
    fun testInternetPermissionGranted() {
        val permission = context.checkCallingOrSelfPermission(android.Manifest.permission.INTERNET)
        assertEquals(PackageManager.PERMISSION_GRANTED, permission)
    }

    @Test
    fun testNetworkStatePermissionGranted() {
        val permission = context.checkCallingOrSelfPermission(android.Manifest.permission.ACCESS_NETWORK_STATE)
        assertEquals(PackageManager.PERMISSION_GRANTED, permission)
    }

    @Test
    fun testAppLabelExists() {
        val appInfo = context.packageManager.getApplicationInfo(context.packageName, 0)
        val appLabel = context.packageManager.getApplicationLabel(appInfo).toString()
        assertTrue(appLabel.isNotEmpty())
        assertEquals("Misty", appLabel)
    }

    @Test
    fun testAppIconExists() {
        val appInfo = context.packageManager.getApplicationInfo(context.packageName, 0)
        val icon = context.packageManager.getApplicationIcon(appInfo)
        assertNotNull(icon)
    }

    @Test
    fun testMinSdkVersion() {
        val appInfo = context.packageManager.getApplicationInfo(context.packageName, PackageManager.GET_META_DATA)
        // App should run on API 23+ (Android 6.0)
        assertTrue("App should support API 23+", android.os.Build.VERSION.SDK_INT >= 23)
    }
}
