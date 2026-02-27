# DormSync - Smart Warden Dashboard

A professional Single Page Application (SPA) dashboard for hostel wardens, part of the UOG Hostel Management System.

## Features

### Dashboard (Main Page)
- **Scan Logs Display**: View all student entry/exit records with filtering
- **Date Filtering**: Shows all records by default, with date selector to filter by specific date
- **Tab Navigation**: Filter by All Scans, Boarders, Non-Boarders, Late Entries, Invalid
- **Smart Search**: Search by student name or roll number (Enter key or Search button)
- **Static Stats Cards**: Display-only cards showing Total Scans, Peak Time, Late Entries, Invalid Scans
- **Sortable Table**: Sort by Identity, Time, Room, or Status
- **Loading States**: Centered spinner with "Loading Records..." message during data processing
- **Empty States**: Contextual "No Records Found" message when filters return no results
- **Image Modal**: Click any row to view scan image and complete student information
- **Collapsible Sidebar**: Toggle between full (256px) and icon-only (64px) view

### Students Page
- **All Allotments**: Grid view of all student hostel allotments
- **Advanced Filters**:
  - Hostel dropdown (select from all available hostels)
  - Room dropdown (dynamically populated based on selected hostel)
  - Search input (filter by name or roll number)
  - Clear Filters button
- **Results Counter**: Shows number of filtered students
- **Student Cards**: Display name, roll number, hostel, room, contact, mess status, batch, and arrears

### Reports Page
- **Summary Stats**: Peak Hour, Avg Per Day, Late Entries, Invalid Scans
- **Status Distribution**: Pie chart showing boarders, non-boarders, and invalid entries with percentages
- **7-Day Entry Trend**: Line chart showing daily entries for the last week
- **Peak Entry Times**: Bar chart showing hourly distribution of scan entries
- **On-Time vs Late**: Pie chart comparing entries before/after 10 PM
- **No Overflow**: Fixed header and stats, only charts container scrolls

### Notifications Page
- **Template with dummy notifications** (6 sample notifications)
- **Types**: Error, Warning, Success, Info

### Settings Page
- **Editable File Paths**: Configure paths for scan_logs.csv and allotments.csv
- **Supports**: Local paths (/file.csv) and remote URLs (https://...)
- **Persistent**: Saves to localStorage

### Design System (shadcn/ui)
- **Primary Color**: #06B6D4 (Cyan only, no orange gradients)
- **Components**: Button, Input, Card, Badge, Tabs, Select, Toast
- **Sidebar**: Clean cyan background for active state (no gradients)
- **Toast**: Bottom-right positioned, shadcn-style
- **No Main Scrollbar**: Strict SPA layout with internal container scrolling only

### Status Colors
- **Boarder**: Green
- **Non-Boarder**: Orange/Yellow
- **Invalid QR Code**: Red

## Tech Stack
- React 19
- Tailwind CSS 4
- shadcn/ui (design system)
- Lucide React (icons)
- Moment.js (date/time formatting)
- PapaParse (CSV parsing)
- Recharts (charts and analytics)

## Project Structure

```
src/
├── components/
│   ├── Header.jsx          # Search bar and date selector
│   ├── Sidebar.jsx         # Collapsible navigation sidebar
│   ├── StatsCard.jsx       # Static display stat cards
│   ├── LogsTable.jsx       # Main data table with sorting
│   ├── LoadingSpinner.jsx  # Loading overlay
│   ├── ImageModal.jsx      # Student details popup
│   ├── ComingSoon.jsx      # Placeholder component
│   └── ui/                 # shadcn/ui components
│       ├── button.jsx
│       ├── input.jsx
│       ├── card.jsx
│       ├── badge.jsx
│       ├── tabs.jsx
│       ├── select.jsx
│       └── toast.jsx
├── pages/
│   ├── Students.jsx        # Student allotments with advanced filters
│   ├── Reports.jsx         # Charts and analytics
│   ├── Notifications.jsx   # Notification template
│   └── Settings.jsx        # File path configuration
├── lib/
│   └── utils.js            # Utility functions (cn)
├── utils/
│   └── toast.js            # Toast notification system
├── App.jsx                 # Main application logic and routing
├── index.css               # Global styles and animations
└── main.jsx                # Entry point
```

## Data Files
- `public/scan_logs.csv`: Contains DateTime, QR Code, Status, Image Path
- `public/allotments.csv`: Contains Name, Room, Hostel, Contact, Roll No., Arrears, Mess Status

## Installation

```bash
npm install
npm run dev
```

## Usage

### Dashboard
1. **Shows all records by default** (no date filter on initial load)
2. **Search**: Type name/roll number and press Enter or click Search button
3. **Filter by Date**: Use the date picker in the header, click "View All Time" to clear
4. **Filter by Tab**: Use tabs above table (All Scans, Boarders, Non-Boarders, Late Entries, Invalid)
5. **Sort**: Click column headers to sort
6. **View Details**: Click any table row to see scan image and student info
7. **Collapse Sidebar**: Click chevron icon to toggle sidebar width

### Students
1. **Select Hostel**: Choose from dropdown to filter by hostel
2. **Select Room**: Choose from dynamically populated room dropdown
3. **Search**: Filter by name or roll number
4. **Clear Filters**: Reset all filters at once

### Reports
1. **View Summary Stats**: Peak hour, average per day, late entries, invalid scans
2. **Analyze Charts**: Status distribution, 7-day trend, peak times, on-time vs late
3. **Scroll Charts**: Only charts container scrolls, header and stats remain fixed

### Settings
1. **Edit Paths**: Configure scan_logs.csv and allotments.csv paths
2. **Save**: Paths are saved to localStorage
3. **Supports**: Local paths (/file.csv) and remote URLs (https://...)

## Toast Notifications
- Bottom-right positioned
- Auto-dismiss after 3 seconds
- Types: Success, Error, Warning, Info
- Smooth slide-in/out animations

## Key Features Implementation

### Peak Time Calculation
Analyzes all scans for the selected date and identifies the hour with the highest number of entries, displayed in 12-hour format (e.g., "09:00 PM").

### Late Entry System
Automatically flags any scan occurring at or after 22:00 (10:00 PM) with a red "Late Entry" label in the table.

### Image Modal
Displays the captured scan image in landscape format with:
- Student information card
- Hostel and room details
- Contact information
- Mess status (Allowed/Not Allowed)
- Arrears information (if applicable)

### Modular Architecture
All components are separated into individual files for maintainability and reusability.

## Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License
Part of the DormSync UOG Hostel Management System
