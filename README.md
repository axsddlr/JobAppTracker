# Job Application Tracker

A modern web application built with Next.js to help job seekers track and manage their job applications efficiently.

## Features

- 📝 Track job applications with detailed information
- 📊 Visual statistics and insights
- 🌓 Dark/Light mode support
- 📱 Responsive design
- 🔍 Search and filter applications
- 📥 Export data to Excel/JSON
- 📤 Import data from JSON backups
- ⌨️ Keyboard shortcuts for quick actions

## Technology Stack

- **Framework**: Next.js 13 with App Router
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **State Management**: React Hooks
- **Form Handling**: React Hook Form

## Storage Implementation

The application currently uses **IndexedDB** for data storage, which means:

### How it Works

1. **Local Storage**: All data is stored locally in your browser's IndexedDB database
   - Database name: `job-applications-db`
   - Store name: `applications`
   - Current version: 3

2. **Data Persistence**:
   - Data persists across browser sessions
   - Data is isolated to each browser/device
   - Data does not sync across devices
   - Data will be lost if browser data is cleared

3. **Implementation Details**:
   - Uses the `idb` library for IndexedDB interactions
   - Database operations are handled in `lib/db/` directory
   - Automatic schema migrations through version control
   - CRUD operations are wrapped in a clean API

### Important Notes

- **Browser Support**: Works in all modern browsers that support IndexedDB
- **Privacy**: All data stays on your device
- **Limitations**:
  - No cloud synchronization
  - No data sharing between browsers/devices
  - Data is tied to the browser's storage

### Data Backup

To prevent data loss, the application provides:

1. **Export Options**:
   - Export to Excel (.xlsx)
   - Export to JSON (complete backup)

2. **Import Options**:
   - Import from JSON backup files

## Project Structure

```
├── app/                  # Next.js app directory
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   └── ...             # Application components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
│   ├── data/          # Data import/export
│   ├── db/            # Database operations
│   └── utils/         # Helper functions
└── types/             # TypeScript type definitions
```

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000)

## Building for Production

```bash
npm run build
```

## Docker Support

The application includes Docker support for containerized deployment:

```bash
# Build the container
docker build -t job-app-tracker .

# Run the container
docker run -p 3000:3000 job-app-tracker
```

Or using Docker Compose:

```bash
docker-compose up
```

## Future Improvements

1. **Cloud Storage**:
   - Integration with Supabase or similar service
   - Multi-device synchronization
   - User authentication

2. **Features**:
   - Email notifications
   - Application deadlines
   - Interview scheduling
   - Resume tracking
   - Company notes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT license.