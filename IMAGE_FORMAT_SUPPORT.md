# Multi-Format Image Support

## Overview
The application now supports multiple image formats with automatic fallback detection. When loading profile images, the system will automatically try different formats until one loads successfully.

## Supported Formats
The following image formats are supported (in order of preference):
1. `.png`
2. `.jpg`
3. `.jpeg`
4. `.PNG`
5. `.JPG`
6. `.JPEG`
7. `.webp`
8. `.WEBP`
9. `.heic`
10. `.HEIC`

## How It Works

### Automatic Format Detection
When an image fails to load, the system automatically tries the next format in the list. This happens seamlessly without any user intervention.

**Example:**
- System tries: `23021519-147.png` → fails
- System tries: `23021519-147.jpg` → fails
- System tries: `23021519-147.jpeg` → fails
- System tries: `23021519-147.PNG` → succeeds ✓

### Fallback Behavior
If all formats fail to load, the system displays a placeholder image with the text "Image Not Available" or "Profile Not Available".

## Implementation Details

### New Utility: `src/utils/imageLoader.js`
Created a centralized utility for handling image loading with multiple format support:

**Key Functions:**
- `handleImageErrorSimple(e, basePath)` - Simple error handler for image tags
- `getPlaceholderImage(text)` - Generates placeholder SVG
- `getImageUrl(path, filename)` - Async function to detect working format
- `IMAGE_FORMATS` - Array of supported formats

### Updated Components

#### 1. ImageModal Component (`src/components/ImageModal.jsx`)
- Imports `handleImageErrorSimple` and `getPlaceholderImage`
- Uses `profileImageBasePath` without extension
- Applies `handleImageErrorSimple` to profile image `onError` handler
- Automatically tries all formats on error

#### 2. Students Page (`src/pages/Students.jsx`)
- Imports `handleImageErrorSimple`
- Uses `profileImageBasePath` without extension
- Applies `handleImageErrorSimple` to profile image `onError` handler
- Automatically tries all formats on error

#### 3. Settings Page (`src/pages/Settings.jsx`)
- Updated documentation to list all supported formats
- Added note about automatic format detection
- Updated placeholder text to reflect multi-format support

## Usage Example

### Before (Old Code)
```jsx
const profileImageUrl = `${profileImagesPath}${rollNo}.png`;

<img
  src={profileImageUrl}
  onError={(e) => {
    if (e.target.src.endsWith('.png')) {
      e.target.src = `${profileImagesPath}${rollNo}.jpg`;
    } else {
      e.target.src = placeholderSVG;
    }
  }}
/>
```

### After (New Code)
```jsx
import { handleImageErrorSimple } from '../utils/imageLoader';

const profileImageBasePath = `${profileImagesPath}${rollNo}`;
const profileImageUrl = `${profileImageBasePath}.png`;

<img
  src={profileImageUrl}
  onError={(e) => handleImageErrorSimple(e, profileImageBasePath)}
/>
```

## Benefits

1. **Flexibility**: Supports 10 different image formats including modern formats like HEIC
2. **Automatic**: No manual intervention needed - system tries all formats automatically
3. **Graceful Degradation**: Shows placeholder if no format works
4. **Maintainable**: Centralized logic in utility file
5. **Extensible**: Easy to add new formats by updating `IMAGE_FORMATS` array

## File Naming Convention

Profile images should be named using the roll number without extension:
- ✓ `23021519-147.png`
- ✓ `23021519-147.jpg`
- ✓ `23021519-147.HEIC`
- ✓ `23021519-147.webp`

The system will automatically detect which format exists.

## HEIC Format Support

HEIC (High Efficiency Image Container) is a modern image format used by Apple devices. The system now supports both lowercase (`.heic`) and uppercase (`.HEIC`) extensions.

**Note**: Browser support for HEIC varies. Some browsers may require the image to be converted to a more compatible format (like JPEG) on the server side.

## Testing

To test the multi-format support:
1. Place images with different formats in the profile images folder
2. Use the same roll number with different extensions
3. The system will automatically find and load the first available format
4. Check browser console for any loading errors

## Future Enhancements

Potential improvements:
- Add support for `.svg` format
- Add support for `.gif` format
- Implement image caching to reduce repeated format checks
- Add format preference configuration in Settings
- Pre-check available formats on page load for better performance
