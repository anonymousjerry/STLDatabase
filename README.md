# 3D Database Pro 🎨

A comprehensive platform for discovering, managing, and sharing 3D models across multiple platforms including Printables, Thangs, and more. Built with Next.js, Sanity CMS, and a robust backend system.

## 🌟 Features

### 🏠 **Frontend (Next.js)**
- **Modern UI/UX**: Responsive design with Tailwind CSS and dark mode support
- **Advanced Search**: Real-time search with filters and suggestions
- **User Authentication**: NextAuth.js integration with multiple providers
- **Model Management**: Browse, favorite, and download 3D models
- **Advertisement System**: Comprehensive ad management with multiple positions
- **Responsive Design**: Mobile-first approach with tablet and desktop optimization

### 🔧 **Backend (Node.js)**
- **RESTful API**: Express.js server with comprehensive endpoints
- **Database Integration**: Prisma ORM with PostgreSQL
- **Web Scraping**: Automated data collection from Printables and Thangs
- **User Management**: Authentication and authorization system
- **Category Management**: Dynamic category and subcategory system

### 📊 **Admin Panel (Sanity CMS)**
- **Content Management**: Visual editor for all content types
- **Ad Management**: Complete ad position and client management system
- **User Management**: Admin interface for user oversight
- **Analytics Dashboard**: Performance monitoring and insights
- **Custom Components**: React-based admin interface

### 💰 **Advertisement System**
- **Multiple Ad Types**: Banner, sidebar, and sponsored model ads
- **Position Management**: 15+ predefined ad positions across all pages
- **Client Portal**: Dedicated forms for advertiser inquiries
- **Admin Controls**: Full CRUD operations for ad management
- **Fallback Content**: Graceful handling of ad blockers

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL
- Sanity CLI
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd 3D-model-pro
```

2. **Install dependencies**
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install

# Admin Panel
cd ../admin
npm install
```

3. **Environment Setup**

Create `.env` files in each directory:

**Frontend (.env.local)**
```env
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
SANITY_PROJECT_ID=your-sanity-project-id
SANITY_DATASET=production
SANITY_API_TOKEN=your-sanity-token
```

**Backend (.env)**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/3dmodelpro"
JWT_SECRET=your-jwt-secret
PORT=5000
```

**Admin (.env)**
```env
SANITY_PROJECT_ID=your-sanity-project-id
SANITY_DATASET=production
SANITY_API_TOKEN=your-sanity-token
```

4. **Database Setup**
```bash
cd backend
npx prisma generate
npx prisma db push
```

5. **Sanity Setup**
```bash
cd admin
npx sanity dev
```

6. **Run the application**
```bash
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Backend
cd backend
npm run dev

# Terminal 3 - Admin Panel
cd admin
npx sanity dev
```

## 📁 Project Structure

```
3D-model-pro/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App router pages
│   ├── components/          # React components
│   │   ├── ads/            # Advertisement system components
│   │   ├── context/        # React context providers
│   │   └── ...
│   ├── lib/                # Utility libraries and API clients
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Helper functions
├── backend/                 # Node.js backend server
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middlewares/    # Express middlewares
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   ├── crawler/            # Web scraping scripts
│   └── prisma/             # Database schema and migrations
└── admin/                  # Sanity CMS admin panel
    ├── components/         # Custom admin components
    ├── sanity/             # Sanity configuration
    │   ├── schemaTypes/    # Content type definitions
    │   └── ...
    └── lib/                # Admin API utilities
```

## 🎯 Advertisement System

### Ad Positions Available

**Homepage (5 positions)**
- Header Banner (728x90)
- Mid-Content Banner (728x90)
- Right Sidebar (300x250)
- Sponsored Models (Native)

**Detail Page (4 positions)**
- Header Banner (728x90)
- Mid-Content Banner (728x90)
- Sponsored Similar Models (Native)

**Explore Page (5 positions)**
- Header Banner (728x90)
- Mid-Content Banner (728x90)
- Right Sidebar (300x250)
- Sponsored Listings (Native)

### Ad Types Supported

1. **Google AdSense**: Standard AdSense integration
2. **Custom Code**: HTML/JavaScript ad code
3. **Sponsored Models**: Native model listings

### Admin Management

Access the ad management system through Sanity Studio:
- Create and edit ad positions
- Manage client information
- Set campaign dates
- Configure fallback content
- Enable/disable ads

### For Advertisers

Advertisers can submit inquiries through:
- Contact form with ad-specific fields
- Dedicated advertising inquiry form
- Direct email to admin

**Required Information:**
- Company name and website
- Ad type preference
- Budget range
- Campaign duration
- Target audience
- Ad creative materials

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Models
- `GET /api/models` - Get all models
- `GET /api/models/:id` - Get specific model
- `POST /api/models` - Create new model
- `PUT /api/models/:id` - Update model
- `DELETE /api/models/:id` - Delete model

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get specific category
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get specific user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🎨 UI Components

### Core Components
- `Header` - Main navigation with search
- `Footer` - Site footer with links
- `Navbar` - Mobile navigation menu
- `SearchBar` - Advanced search functionality
- `ModelItem` - Individual model display
- `CategoryItem` - Category display

### Advertisement Components
- `AdPositionManager` - Main ad management component
- `BannerAd` - Banner advertisement component
- `SidebarAd` - Sidebar advertisement component
- `SponsoredModelAd` - Native sponsored model component
- `GoogleAd` - Google AdSense integration

### Admin Components
- `AdPositionTable` - Admin ad management interface
- `CategoryTable` - Category management
- `ModelTable` - Model management
- `UserTable` - User management

## 🛠️ Development

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Backend Development
```bash
cd backend
npm run dev          # Start development server
npm run start        # Start production server
npm run test         # Run tests
```

### Admin Panel Development
```bash
cd admin
npx sanity dev       # Start Sanity Studio
npx sanity build     # Build for production
npx sanity deploy    # Deploy to Sanity
```

## 🗄️ Database Schema

### Core Tables
- `users` - User accounts and profiles
- `models` - 3D model information
- `categories` - Model categories
- `subcategories` - Model subcategories
- `source_sites` - External model sources
- `likes` - User model likes
- `favorites` - User model favorites

### Sanity Content Types
- `user` - User profiles
- `model` - Model information
- `category` - Categories
- `subCategory` - Subcategories
- `sourceSite` - Source sites
- `adPosition` - Advertisement positions
- `like` - User likes
- `scrapeJob` - Scraping jobs

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation and sanitization
- Rate limiting
- Environment variable protection

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel --prod
```

### Backend (Railway/Heroku)
```bash
cd backend
npm run build
# Deploy to your preferred platform
```

### Admin Panel (Sanity)
```bash
cd admin
npx sanity deploy
```

## 📊 Monitoring & Analytics

- Google Analytics integration
- Error tracking with Sentry
- Performance monitoring
- User behavior analytics
- Ad performance tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Roadmap

- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] AI-powered model recommendations
- [ ] Social features (comments, sharing)
- [ ] Advanced search filters
- [ ] Model versioning system
- [ ] Integration with more platforms
- [ ] Advanced ad targeting
- [ ] Revenue sharing system

---

**Built with ❤️ using Next.js, Sanity CMS, and Node.js**
