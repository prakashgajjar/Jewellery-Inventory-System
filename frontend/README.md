# Frontend Setup Guide

## Prerequisites

- Node.js 18+
- npm or yarn

## Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The app will be available at **http://localhost:5173**

### 3. Build for Production

```bash
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components
│   ├── layouts/         # Layout components
│   ├── services/        # API service layer
│   ├── context/         # React context (Auth)
│   ├── utils/           # Utility functions
│   ├── styles/          # Global styles
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── public/              # Static assets
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── README.md            # This file
```

## Features

✅ User Authentication (Login/Signup)
✅ Protected Routes with JWT
✅ Responsive Dashboard
✅ Product Management
✅ Customer Management
✅ Order & Billing System
✅ Reports & Analytics
✅ Role-based Access Control

## Pages

- **Dashboard** - Overview with charts and statistics
- **Products** - Inventory management
- **Customers** - Customer list and management
- **Billing** - Create orders and generate invoices
- **Orders** - View and manage orders
- **Reports** - Sales analytics and reports
- **Settings** - Admin settings for rates

## Key Components

- `ProtectedRoute` - Route protection with JWT
- `MainLayout` - Main app layout with sidebar
- `LoadingSpinner` - Loading indicator
- `Toast` - Notification component
- `Sidebar` - Navigation sidebar

## API Integration

All API calls are made through the `/services/index.js` file using Axios. The API client includes:

- Automatic JWT token injection in headers
- Base URL configuration
- Error handling and 401 redirect

## Styling

- **Framework**: Tailwind CSS
- **Colors**: 
  - Primary: #6B7280
  - Light backgrounds: #F5F5F5, #E0E0E0
- **Icons**: Lucide React

## Environment Variables

Create a `.env.local` file (optional):

```
VITE_API_URL=http://localhost:8080/api
```

## Common Commands

```bash
# Development
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Lint
npm run lint
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### CORS Errors

Ensure the backend is running on `http://localhost:8080` with CORS enabled for `http://localhost:5173`.

### Token Not Working

Check if:
- Token is stored in localStorage
- Backend is returning valid JWT tokens
- Token header format is correct: `Bearer <token>`

### API Connection Issues

- Verify backend is running: `curl http://localhost:8080/api/auth/health`
- Check network tab in browser DevTools
- Verify API URLs in `services/index.js`

## Production Notes

- Replace `VITE_API_URL` with production API endpoint
- Enable HTTPS/SSL
- Configure production-ready CORS origins
- Implement proper error boundaries
- Add comprehensive logging

## Support

See the main [README.md](../README.md) for more information.
