# DormSync Dashboard - Feature Guide

## 🎯 Core Features

### 1. Automatic Today's Filter
- Dashboard loads with current date's records by default
- Date selector in header allows viewing any date
- Real-time filtering without page reload

### 2. Smart Search System
- Search by student name or roll number
- Triggers on:
  - Enter key press
  - Search button click
- Toast notification confirms search
- Prevents lag on large datasets

### 3. Interactive Statistics Cards

#### Total Scans
- Shows all scans for selected date
- Click to reset all filters
- Gradient: Cyan

#### Peak Time
- Calculates busiest hour of the day
- Displays in 12-hour format (e.g., "09:00 PM")
- Shows "N/A" if no data
- Gradient: Orange

#### Late Entries
- Counts entries after 10:00 PM (22:00)
- Click to filter table for late entries only
- Shows "Late from 10:00 PM" subtitle
- Gradient: Red

#### Invalid Entries
- Counts non-Boarder and non-valid QR codes
- Click to filter invalid scans
- Gradient: Dark Red

### 4. Advanced Table Features

#### Sortable Columns
- **Identity**: Sort by student name
- **Scan Time**: Sort by date/time
- **Hostel & Room**: Sort by room number
- **Status**: Sort by status type
- Click column header to toggle ascending/descending
- Visual indicator shows current sort

#### Status Color Coding
- **Boarder**: Green badge
- **Non-Boarder**: Orange badge
- **Invalid QR Code**: Red badge

#### Late Entry Indicator
- Red "Late Entry" label appears below time
- Automatically shown for scans after 10 PM

#### Mess Status Column
- Shows "ON" (green) or "OFF" (gray)
- Indicates dining hall access permission

### 5. Student Details Modal

Click any table row to open detailed view:

#### Scan Image
- Landscape format display
- Shows captured photo from scan
- Fallback placeholder if image unavailable

#### Student Information Card
- Name and Roll Number
- Gradient background (Cyan to Orange)
- Profile icon

#### Details Grid
- **Hostel**: Student's hostel name
- **Room**: Room number
- **Contact**: Phone number
- **Batch**: Academic batch year
- **Mess Status**: Dining access with visual indicator
- **Arrears**: Outstanding fees (if any)

#### Scan Status
- Large status badge
- Color-coded by type
- Timestamp display

### 6. Toast Notification System

Bottom-right positioned notifications:

- **Success** (Green): Data loaded, operations completed
- **Error** (Red): Failed operations
- **Warning** (Orange): Missing input
- **Info** (Blue): Filter applied, search initiated

Features:
- Auto-dismiss after 3 seconds
- Smooth slide-in/out animations
- Multiple toasts stack vertically
- Non-blocking (doesn't prevent interaction)

### 7. Sidebar Navigation

Functional sections:
- **Dashboard**: Main view (active)
- **Students**: Coming soon
- **Reports**: Coming soon
- **Notifications**: Coming soon
- **Settings**: Coming soon

User profile display at bottom

### 8. Responsive Design

- Mobile-friendly layout
- Adaptive grid for stat cards
- Horizontal scroll for table on small screens
- Touch-friendly buttons and interactions

### 9. Dark Mode Support

- Automatic theme detection
- Consistent colors across themes
- Proper contrast ratios
- Smooth transitions

### 10. Performance Optimizations

- **useMemo** for expensive calculations
- Efficient filtering and sorting
- Component-level loading states
- Minimal re-renders
- CSV parsing with PapaParse

## 🎨 Design System

### Color Palette
```
Primary Cyan: #06B6D4
Primary Orange: #F97316
Background Light: #F9FAFB
Background Dark: #0F172A
Text: #1E293B
Success: Green-500
Warning: Orange-500
Error: Red-500
```

### Typography
- Font: Inter, Segoe UI, System UI
- Weights: Regular (400), Medium (500), Semibold (600), Bold (700)

### Spacing
- Consistent padding: 4, 6, 8 units
- Gap spacing: 2, 3, 4, 6 units
- Border radius: rounded-xl (12px)

### Shadows
- Cards: shadow-lg
- Modal: shadow-2xl
- Hover states: Enhanced shadows

## 🔧 Technical Implementation

### State Management
- React hooks (useState, useEffect, useMemo)
- Efficient filtering pipeline
- Memoized calculations for stats

### Data Flow
1. CSV files loaded on mount
2. Parsed with PapaParse
3. Stored in state
4. Filtered by date → status → search
5. Sorted by user preference
6. Rendered in table

### Performance
- Only table container scrolls
- Main layout: h-screen overflow-hidden
- Custom orange scrollbar
- Lazy calculations with useMemo

## 📱 User Workflows

### View Today's Activity
1. Dashboard loads automatically
2. See stats at a glance
3. Scroll through table

### Search for Student
1. Type name or roll number
2. Press Enter or click Search
3. View filtered results
4. Click row for details

### Check Late Entries
1. Click "Late Entries" stat card
2. Table filters to show only late scans
3. See "Late Entry" labels in table
4. Click card again to reset

### View Historical Data
1. Click date selector
2. Choose past date
3. Stats and table update automatically

### Investigate Specific Scan
1. Click table row
2. View scan image
3. Check student details
4. Verify mess status
5. Close modal

## 🚀 Future Enhancements

- Export to PDF/Excel
- Real-time updates via WebSocket
- Advanced analytics dashboard
- Student attendance reports
- Mess billing integration
- Mobile app companion
