# Weather Widget User Guide

## Getting Started

### Adding the Widget to Your Home Screen

#### Android 12-15:
1. Long-press on empty space on your home screen
2. Tap "Widgets"
3. Find "Misty Weather Widget"
4. Drag the widget to your desired location
5. Configuration screen will appear automatically

#### Alternative Method:
1. Open the app drawer
2. Long-press on "Misty Weather Widget"
3. Drag to home screen
4. Release to place widget

### Initial Configuration

When you first add the widget, you'll see the configuration screen where you can customize:

- **Theme**: Choose Light, Dark, or Auto (follows system theme)
- **Color Scheme**: Select from Blue, Purple, Green, Orange, or Pink
- **Temperature Unit**: Celsius or Fahrenheit
- **Font Size**: Small, Medium, or Large
- **Update Frequency**: How often the widget refreshes (15min to 3hr)
- **Transparency**: Adjust background opacity (0-100%)
- **Display Options**: Toggle individual weather metrics on/off

Tap "Save" when finished to add the widget.

## Widget Features

### Display Elements

The widget shows:

- **Location Name**: Your current location or selected city
- **Temperature**: Large, easy-to-read current temperature
- **Weather Icon**: Visual representation of current conditions
- **Weather Condition**: Text description (Sunny, Cloudy, Rain, etc.)
- **High/Low**: Today's high and low temperatures
- **Feels Like**: Apparent temperature (optional)
- **Humidity**: Current humidity percentage (optional)
- **Wind Speed**: Current wind speed (optional)
- **UV Index**: UV radiation level (optional)
- **Last Updated**: Time of last data refresh

### Widget Sizes

The widget supports multiple sizes:

#### Small (2×2 cells)
- Basic info: Temperature, icon, and location
- Perfect for compact layouts

#### Medium (4×2 cells) - Default
- Full current conditions
- High/low temperatures
- Humidity and wind speed
- Most popular size

#### Large (4×4 cells)
- All current conditions
- Hourly forecast (coming soon)
- Extended metrics

#### Extra Large (6×4 cells)
- Complete weather overview
- Weekly forecast (coming soon)
- All available metrics

### Resizing the Widget

1. Long-press the widget
2. Release, and resize handles will appear
3. Drag the edges to resize
4. The widget will adapt its content to the new size

## Customization

### Changing Widget Settings

#### Method 1: Long-Press Menu
1. Long-press the widget
2. Tap "Reconfigure" or gear icon
3. Adjust settings
4. Tap "Save"

#### Method 2: From Main App (if integrated)
1. Open Misty Weather app
2. Go to Settings → Widget Configuration
3. Adjust settings
4. Changes apply automatically

### Theme Options

**Light Theme**
- Bright, vibrant colors
- Best for daytime use
- High contrast for outdoor visibility

**Dark Theme**
- Deeper, muted colors
- Easy on eyes at night
- Saves battery on OLED screens

**Auto Theme**
- Follows system dark/light mode
- Switches automatically based on time or system settings
- Recommended option

### Color Schemes

Choose a color scheme that matches your home screen:

- **Blue**: Classic weather app look (default)
- **Purple**: Modern, elegant appearance
- **Green**: Nature-inspired, calming
- **Orange**: Warm, energetic vibe
- **Pink**: Soft, distinctive style

### Temperature Units

Toggle between Celsius and Fahrenheit:
- **Celsius**: Used in most of the world
- **Fahrenheit**: Used primarily in the United States

All displayed temperatures will update immediately when changed.

### Font Size

Adjust text size for readability:
- **Small**: Compact, fits more information
- **Medium**: Balanced (default)
- **Large**: Enhanced readability, accessibility-friendly

### Update Frequency

Choose how often the widget refreshes:

- **15 minutes**: Most current data, higher battery use
- **30 minutes**: Good balance (recommended)
- **1 hour**: Less battery use, still frequent
- **3 hours**: Minimal battery impact

*Note: Updates are automatically reduced when battery is low*

### Transparency

Adjust background transparency (0-100%):
- **0%**: Opaque, best visibility
- **50%**: Semi-transparent, blends with wallpaper
- **100%**: Fully transparent, shows only text/icons

Experiment to find what looks best with your wallpaper.

### Display Options

Toggle individual metrics on/off:

- ✓ **Feels Like**: Shows apparent temperature
- ✓ **Humidity**: Displays moisture percentage
- ✓ **Wind Speed**: Shows wind information
- ☐ **UV Index**: Solar UV radiation level
- ☐ **Sunrise/Sunset**: Sun times for the day

Disabled metrics save space and simplify the widget.

## Interactions

### Tapping the Widget

**Single Tap**
- Opens main Misty Weather app
- Shows full forecast and details

**Tap Location** (coming soon)
- Opens location selection
- Choose different cities

**Tap Refresh Icon** (coming soon)
- Forces immediate weather update
- Overrides update frequency setting

### Long Press

**Android 15 Quick Configuration**
- Long-press → Quick settings menu
- Change theme without full configuration
- Toggle key metrics on/off

## Location

### Setting Your Location

The widget uses your location from the main app:

1. Open Misty Weather app
2. Allow location permission when prompted
3. App will detect your location
4. Widget will use this location automatically

### Multiple Locations (coming soon)

Create multiple widgets for different locations:
1. Add new widget to home screen
2. Configure with different location
3. Each widget can have unique settings

## Troubleshooting

### Widget Not Showing Data

**"Loading weather..."**
- Location may not be set
- Open main app and allow location access
- Check internet connection

**"Unable to load weather"**
- No internet connection
- API service temporarily unavailable
- Check device connectivity

### Widget Not Updating

**Check Update Frequency**
- Verify update interval in settings
- Try manual refresh (tap widget)

**Battery Saver Mode**
- Widget updates are paused when battery is low
- Charge device or disable battery saver

**Background Restrictions**
- Go to Settings → Apps → Misty Weather
- Ensure "Background restriction" is off
- Enable "Unrestricted battery usage"

### Widget Looks Wrong

**Text Too Small/Large**
- Adjust font size in widget settings

**Colors Don't Match**
- Try different color scheme
- Adjust transparency

**Layout Seems Crowded**
- Disable some display options
- Use larger widget size

### Configuration Not Saving

1. Try removing and re-adding widget
2. Clear app cache: Settings → Apps → Misty Weather → Clear Cache
3. Restart device

## Accessibility

### Screen Reader Support

The widget is optimized for TalkBack:
- All elements have descriptive labels
- Weather conditions are announced clearly
- Navigation is logical and intuitive

### High Contrast

Use dark theme with 0% transparency for maximum contrast.

### Large Text

1. Set widget font size to "Large"
2. Enable system-wide large text if needed:
   - Settings → Display → Font Size → Large

## Battery Usage

### Expected Impact

- **15min updates**: ~3-5% per day
- **30min updates**: ~2-3% per day
- **1hr updates**: ~1-2% per day
- **3hr updates**: <1% per day

### Optimization Tips

1. Use longer update intervals (1-3 hours)
2. Enable auto theme (saves power on OLED)
3. Reduce transparency for simpler rendering
4. Disable optional metrics you don't need

The widget automatically:
- Pauses updates when battery is below 15%
- Uses cached data when possible
- Minimizes network requests

## Privacy

### Data Collection

The widget only collects:
- Location (for weather data)
- Update timestamps (for caching)

Your data:
- Is not shared with third parties
- Is stored locally on device
- Is used only for weather display

### Permissions Used

- **Location**: To get weather for your area
- **Internet**: To fetch weather data
- **Network State**: To check connectivity
- **Background Location**: For automatic updates
- **Wake Lock**: For scheduled updates (WorkManager)

## Tips & Tricks

1. **Multiple Widgets**: Add several widgets with different color schemes
2. **Theme Matching**: Use transparency to blend with wallpaper
3. **Night Mode**: Set to auto theme for automatic day/night switching
4. **Battery Life**: Use 1-hour updates for great balance
5. **Clean Look**: Disable all optional metrics for minimal design
6. **Accessibility**: Use large font + high contrast for easy reading
7. **Travel**: Manually update location when traveling

## Frequently Asked Questions

**Q: Can I have multiple widgets?**
A: Yes! Add as many as you want, each with different settings.

**Q: Does the widget work offline?**
A: Yes, it shows cached data when offline with a timestamp.

**Q: How accurate is the weather data?**
A: Data comes from reliable meteorological sources, typically accurate within 1-2°.

**Q: Can I customize colors further?**
A: Currently limited to preset schemes. More options coming soon!

**Q: Why isn't my widget updating?**
A: Check battery saver, background restrictions, and internet connection.

**Q: Does it support Celsius and Fahrenheit?**
A: Yes! Toggle in widget settings or main app.

**Q: Can I resize the widget?**
A: Yes, long-press and drag the corners to resize.

**Q: What weather icons are available?**
A: Clear, partly cloudy, cloudy, rain, snow, thunderstorm, fog, and more.

## Getting Help

**In-App Support**
- Open Misty Weather app
- Go to Settings → Help & Support
- Check FAQ or contact support

**Community**
- Join our Discord/Reddit community
- Share widget configurations
- Get tips from other users

**Reporting Issues**
- Settings → Help → Report a Problem
- Include widget size and settings
- Describe the issue clearly

## What's New

### Version 1.0
- Initial release
- Jetpack Glance implementation
- Multiple size support
- 5 color schemes
- Customizable metrics
- Battery optimization
- Offline support

### Coming Soon
- Widget pinning suggestions
- Weather alerts
- Multiple locations
- Animated icons
- More color schemes
- Hourly/weekly forecasts

---

Enjoy your Misty Weather Widget! 🌤️
