# DormSync - Hostel Warden Dashboard

A professional Single Page Application (SPA) dashboard for hostel wardens, part of the UOG Hostel Management System.

## Features

### Core Functionality
- **Real-time Scan Logs**: View and filter student entry/exit records
- **Date-based Filtering**: Automatically shows today's records with date selector
- **Smart Search**: Search by student name or roll number (triggered by Enter key or Search button)
- **Interactive Stats Cards**: Click to filter table by specific status
- **Peak Time Analysis**: Identifies the hour with most scan activity
- **Late Entry Detection**: Flags entries after 10:00 PM
- **Sortable Table**: Sort by Identity, Time, Room, or Status
- **Student Details Modal**: Click any row to view scan image and complete student information
- **Mess Status Integration**: Shows dining hall access permissions

### Design System
- **Colors**: 
  - Backgrounds: #F9FAFB (Light) / #0F172A (Dark)
  - Primary: #06B6D4 (Cyan) and #F97316 (Orange)
  - Text: #1E293B (Slate-800)
- **Rounded Corners**: Minimal (rounded-xl)
- **Custom Scrollbar**: Orange-themed, only in table container
- **No Main Scrollbar**: Strict SPA layout with h-screen overflow-hidden

### Status Colors
- **Boarder**: Green
- **Non-Boarder**: Orange/Yellow
- **Invalid QR Code**: Red

## Tech Stack
- React 19
- Tailwind CSS 4
- Lucide React (icons)
- Moment.js (date/time formatting)
- PapaParse (CSV parsing)

## Project Structure

```
src/
├── components/
│   ├── Header.jsx          # Search bar and date selector
│   ├── Sidebar.jsx         # Navigation sidebar
│   ├── StatsCard.jsx       # Interactive stat cards
│   ├── LogsTable.jsx       # Main data table with sorting
│   ├── LoadingSpinner.jsx  # Loading overlay
│   └── ImageModal.jsx      # Student details popup
├── utils/
│   └── toast.js            # Custom toast notifications
├── App.jsx                 # Main application logic
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

1. **Dashboard loads with today's records automatically**
2. **Search**: Type name/roll number and press Enter or click Search button
3. **Filter by Date**: Use the date picker in the header
4. **Filter by Status**: Click any stat card to filter the table
5. **Sort**: Click column headers to sort
6. **View Details**: Click any table row to see scan image and student info

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
