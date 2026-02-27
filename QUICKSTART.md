# DormSync Dashboard - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
log-dashboard/
├── public/
│   ├── scan_logs.csv       # Scan entry records
│   ├── allotments.csv      # Student allotment data
│   └── captured/           # Scan images directory
├── src/
│   ├── components/         # React components
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StatsCard.jsx
│   │   ├── LogsTable.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── ImageModal.jsx
│   │   └── ComingSoon.jsx
│   ├── utils/
│   │   └── toast.js        # Toast notification system
│   ├── App.jsx             # Main application
│   ├── index.css           # Global styles
│   └── main.jsx            # Entry point
├── README.md
├── FEATURES.md
└── package.json
```

## 🎯 Key Features at a Glance

### 1. Dashboard View
- **Auto-loads today's records**
- **4 interactive stat cards**: Total Scans, Peak Time, Late Entries, Invalid
- **Sortable table** with 5 columns
- **Click any row** to view details

### 2. Search & Filter
- Search by name or roll number
- Filter by date using date picker
- Click stat cards to filter by status
- Sort by clicking column headers

### 3. Student Details
- Click table row to open modal
- View scan image (landscape format)
- See complete student information
- Check mess status and arrears

### 4. Toast Notifications
- Bottom-right positioned
- Auto-dismiss after 3 seconds
- 4 types: Success, Error, Warning, Info

## 🎨 Customization

### Colors
Edit `src/index.css` to change theme colors:
```css
:root {
  --primary-cyan: #06B6D4;
  --primary-orange: #F97316;
}
```

### Data Sources
Place your CSV files in `public/` directory:
- `scan_logs.csv`: DateTime, QR Code, Status, Image Path
- `allotments.csv`: Name, Room, Hostel, Contact, Roll No., Arrears, Mess Status

### Images
Place scan images in `public/captured/` directory

## 🔧 Configuration

### CSV Format

#### scan_logs.csv
```csv
DateTime,QR Code,Status,Image Path
1/24/2026 10:09:31 PM,25021553-088,Boarder,C:\...\BOARDER_2026-01-24_22-09-31.png
```

#### allotments.csv
```csv
Sr. #,Hostel,Room,Roll No.,Name,Contact,Arrears,Mess Status,Batch
1,H1-ABH,A-01,25011519-014,John Doe,0336-4563610,(4090),ON,25
```

## 📱 Usage Tips

### Daily Workflow
1. Open dashboard (auto-shows today)
2. Review stat cards for overview
3. Check late entries
4. Search specific students
5. Click rows for detailed view

### Filtering
- **By Date**: Use date picker in header
- **By Status**: Click stat cards
- **By Search**: Type and press Enter
- **Reset**: Click "Total Scans" card

### Sorting
- Click column headers to sort
- Click again to reverse order
- Arrow icon shows current sort

## 🐛 Troubleshooting

### Images Not Loading
- Ensure images are in `public/captured/`
- Check file names match CSV paths
- Verify image file extensions

### CSV Not Loading
- Check file encoding (UTF-8)
- Verify CSV format matches expected structure
- Check browser console for errors

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

Output will be in `dist/` directory.

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

## 📊 Performance

- **Initial Load**: ~2-3 seconds (depends on CSV size)
- **Search**: Instant (memoized)
- **Filtering**: Instant (memoized)
- **Sorting**: Instant (memoized)
- **Modal Open**: <100ms

## 🔐 Security Notes

- CSV files are loaded client-side
- No sensitive data should be in public directory
- Images are served statically
- No authentication implemented (add as needed)

## 📞 Support

For issues or questions:
1. Check FEATURES.md for detailed documentation
2. Review browser console for errors
3. Verify CSV format matches expected structure

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Moment.js](https://momentjs.com)
- [Lucide Icons](https://lucide.dev)

## 📝 License

Part of DormSync - UOG Hostel Management System
