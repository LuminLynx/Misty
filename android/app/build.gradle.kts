plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.luminlynx.misty"
    compileSdk = 35 // Android 15

    defaultConfig {
        applicationId = "com.luminlynx.misty"
        minSdk = 26 // Android 8.0
        targetSdk = 35 // Android 15
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }

    kotlinOptions {
        jvmTarget = "11"
    }
}

dependencies {
    // AndroidX Core
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.appcompat:appcompat:1.7.0")
    
    // Material Design for Android 15
    implementation("com.google.android.material:material:1.12.0")
    
    // Constraint Layout
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
    
    // Work Manager for periodic updates
    implementation("androidx.work:work-runtime-ktx:2.9.0")
    
    // Testing dependencies
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.2.1")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.6.1")
}
