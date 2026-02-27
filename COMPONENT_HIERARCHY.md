# DormSync Dashboard - Component Hierarchy

## 🏗️ Application Structure

```
App.jsx (Main Container)
│
├── Sidebar.jsx
│   ├── Logo & Title
│   ├── Navigation Menu
│   │   ├── Dashboard (Active)
│   │   ├── Students
│   │   ├── Reports
│   │   ├── Notifications
│   │   └── Settings
│   └── User Profile
│
└── Main Content Area
    │
    ├── Header.jsx
    │   ├── Search Input
    │   ├── Search Button
    │   └── Date Selector
    │
    ├── Stats Grid
    │   ├── StatsCard.jsx (Total Scans)
    │   ├── StatsCard.jsx (Peak Time)
    │   ├── StatsCard.jsx (Late Entries)
    │   └── StatsCard.jsx (Invalid)
    │
    ├── Table Container
    │   ├── LoadingSpinner.jsx (Conditional)
    │   └── LogsTable.jsx
    │       ├── Table Header (Sortable)
    │       └── Table Body
    │           └── Table Rows (Clickable)
    │
    └── ImageModal.jsx (Conditional)
        ├── Modal Header
        ├── Scan Image
        ├── Student Info Card
        ├── Details Grid
        └── Close Button
```

## 📦 Component Details

### App.jsx
**Purpose**: Main application logic and state management

**State**:
- `logs` - All scan records
- `allotments` - Student allotment data
- `loading` - Loading state
- `searchTerm` - Search input value
- `selectedDate` - Date filter
- `activeTab` - Current navigation tab
- `selectedLog` - Selected log for modal
- `statusFilter` - Active status filter
- `sortConfig` - Current sort configuration

**Key Functions**:
- `loadData()` - Fetch and parse CSV files
- `handleSearch()` - Trigger search with toast
- `handleSort()` - Update sort configuration
- `handleStatClick()` - Toggle status filter

**Memoized Values**:
- `dateFilteredLogs` - Logs filtered by date
- `filteredLogs` - Logs after all filters
- `sortedLogs` - Final sorted logs
- `stats` - Calculated statistics

---

### Sidebar.jsx
**Props**:
- `activeTab` - Current active tab
- `setActiveTab` - Function to change tab

**Features**:
- Navigation menu with 5 items
- Active state highlighting
- User profile display
- Gradient active state

---

### Header.jsx
**Props**:
- `selectedDate` - Current date filter
- `setSelectedDate` - Update date
- `searchTerm` - Search input value
- `setSearchTerm` - Update search term
- `onSearch` - Search trigger function

**Features**:
- Search input with icon
- Enter key support
- Search button
- Date picker with calendar icon

---

### StatsCard.jsx
**Props**:
- `label` - Card title
- `value` - Display value
- `icon` - Lucide icon component
- `gradient` - Gradient colors
- `onClick` - Click handler
- `isActive` - Active state

**Features**:
- Interactive (clickable)
- Gradient background when active
- Icon with background
- Hover effects
- Scale animation

---

### LogsTable.jsx
**Props**:
- `logs` - Array of log records
- `allotments` - Student data map
- `onRowClick` - Row click handler
- `sortConfig` - Current sort state
- `onSort` - Sort change handler

**Features**:
- Sortable columns
- Status color coding
- Late entry indicators
- Hover effects
- Mess status display
- Responsive layout

---

### LoadingSpinner.jsx
**Props**: None

**Features**:
- Centered overlay
- Backdrop blur
- Spinning icon
- Loading text
- Semi-transparent background

---

### ImageModal.jsx
**Props**:
- `log` - Selected log record
- `student` - Student data
- `onClose` - Close handler

**Features**:
- Full-screen overlay
- Landscape image display
- Student info card
- Details grid
- Close button
- Gradient header
- Responsive layout

---

### ComingSoon.jsx
**Props**:
- `title` - Page title
- `description` - Page description

**Features**:
- Centered layout
- Construction icon
- Animated dots
- Gradient icon background

---

## 🔄 Data Flow

### 1. Initial Load
```
App.jsx
  ↓ (useEffect)
loadData()
  ↓ (fetch)
CSV Files
  ↓ (PapaParse)
State Update
  ↓
Re-render
```

### 2. Date Filter
```
Header.jsx
  ↓ (onChange)
setSelectedDate()
  ↓
App.jsx (useMemo)
  ↓
dateFilteredLogs
  ↓
LogsTable.jsx
```

### 3. Search Flow
```
Header.jsx
  ↓ (Enter/Click)
onSearch()
  ↓
toast.info()
  ↓
App.jsx (useMemo)
  ↓
filteredLogs
  ↓
LogsTable.jsx
```

### 4. Status Filter
```
StatsCard.jsx
  ↓ (onClick)
handleStatClick()
  ↓
setStatusFilter()
  ↓
App.jsx (useMemo)
  ↓
filteredLogs
  ↓
LogsTable.jsx
```

### 5. Sort Flow
```
LogsTable.jsx
  ↓ (column click)
onSort()
  ↓
setSortConfig()
  ↓
App.jsx (useMemo)
  ↓
sortedLogs
  ↓
LogsTable.jsx
```

### 6. Modal Flow
```
LogsTable.jsx
  ↓ (row click)
onRowClick()
  ↓
setSelectedLog()
  ↓
ImageModal.jsx
  ↓ (close)
setSelectedLog(null)
```

## 🎨 Styling Approach

### Global Styles (index.css)
- Base styles
- Scrollbar customization
- Animations
- Dark mode variables

### Component Styles
- Tailwind utility classes
- Conditional classes
- Gradient backgrounds
- Responsive breakpoints

### Color System
```
Cyan:   Primary actions, icons
Orange: Secondary actions, accents
Green:  Success, boarder status
Red:    Error, invalid status
Yellow: Warning, non-boarder status
Slate:  Text, backgrounds, borders
```

## 🔧 Utility Functions

### toast.js
```javascript
toast.success(message)  // Green notification
toast.error(message)    // Red notification
toast.warning(message)  // Orange notification
toast.info(message)     // Blue notification
```

**Features**:
- Auto-dismiss (3s)
- Bottom-right position
- Stacking support
- Smooth animations
- No external dependencies

## 📊 Performance Optimizations

### Memoization Strategy
```javascript
// Date filtering
const dateFilteredLogs = useMemo(() => {
  // Filter by date
}, [logs, selectedDate]);

// Search & status filtering
const filteredLogs = useMemo(() => {
  // Apply filters
}, [dateFilteredLogs, searchTerm, statusFilter]);

// Sorting
const sortedLogs = useMemo(() => {
  // Sort data
}, [filteredLogs, sortConfig]);

// Statistics
const stats = useMemo(() => {
  // Calculate stats
}, [dateFilteredLogs]);
```

### Why This Matters
- Prevents unnecessary recalculations
- Improves render performance
- Reduces CPU usage
- Smoother user experience

## 🎯 Component Responsibilities

### App.jsx
- State management
- Data fetching
- Business logic
- Filter orchestration

### Sidebar.jsx
- Navigation
- Tab switching
- User info display

### Header.jsx
- Search input
- Date selection
- User actions

### StatsCard.jsx
- Display statistics
- Filter trigger
- Visual feedback

### LogsTable.jsx
- Data display
- Sorting
- Row interactions

### LoadingSpinner.jsx
- Loading state
- User feedback

### ImageModal.jsx
- Detail view
- Image display
- Student info

### ComingSoon.jsx
- Placeholder pages
- Future features

## 🔐 Props Validation

All components use proper prop types:
- Functions: `onClick`, `onClose`, `onSort`
- Data: `logs`, `allotments`, `student`
- State: `isActive`, `loading`, `selectedDate`
- Config: `sortConfig`, `gradient`, `icon`

## 📱 Responsive Behavior

### Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

### Responsive Components
- Stats grid: 2 cols → 4 cols
- Table: Horizontal scroll on mobile
- Modal: Full width on mobile
- Sidebar: Collapsible (future)

---

**Component Count**: 8
**Total Props**: ~30
**State Variables**: 8
**Memoized Values**: 4
**Custom Hooks**: 0 (using built-in)
