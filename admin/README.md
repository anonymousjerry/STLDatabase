# Admin Panel - Sanity CMS 🛠️

The admin panel for 3D Model Pro built with Sanity CMS, providing a powerful content management system with custom React components for managing models, categories, users, and advertisements.

## 🌟 Features

### 📊 **Content Management**
- **Visual Editor**: Rich text editing with real-time collaboration
- **Media Management**: Upload and organize images, files, and assets
- **Version Control**: Track changes and revert to previous versions
- **Custom Fields**: Advanced field types and validation

### 🎯 **Advertisement Management**
- **Ad Position Control**: Manage 15+ predefined ad positions
- **Client Management**: Store and manage advertiser information
- **Campaign Scheduling**: Set start and end dates for ad campaigns
- **Fallback Content**: Configure content for ad blocker scenarios
- **Performance Tracking**: Monitor ad performance and engagement

### 👥 **User Management**
- **User Profiles**: View and manage user accounts
- **Role Management**: Assign admin roles and permissions
- **Activity Tracking**: Monitor user interactions and behavior
- **Account Status**: Enable/disable user accounts

### 📁 **Model Management**
- **Model Information**: Edit model details, descriptions, and metadata
- **Category Assignment**: Organize models into categories and subcategories
- **Source Site Integration**: Link models to external platforms
- **Media Assets**: Manage model images and files

### 🏷️ **Category System**
- **Hierarchical Categories**: Create main categories and subcategories
- **Platform-Specific**: Separate categories for Printables and Thangs
- **SEO Optimization**: Meta descriptions and keywords
- **Visual Organization**: Drag-and-drop category management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Sanity CLI
- Git

### Installation

1. **Navigate to admin directory**
```bash
cd admin
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**

Create `.env` file:
```env
SANITY_PROJECT_ID=your-sanity-project-id
SANITY_DATASET=production
SANITY_API_TOKEN=your-sanity-token
```

4. **Start development server**
```bash
npx sanity dev
```

5. **Access admin panel**
Open [http://localhost:3333](http://localhost:3333) in your browser

## 📁 Project Structure

```
admin/
├── components/              # Custom React components
│   ├── adPositionTable.tsx  # Ad management interface
│   ├── categoryTable.tsx    # Category management
│   ├── modelTable.tsx       # Model management
│   └── userTable.tsx        # User management
├── sanity/                  # Sanity configuration
│   ├── schema.ts           # Main schema file
│   ├── schemaTypes/        # Content type definitions
│   │   ├── adPosition.ts   # Advertisement schema
│   │   ├── category.ts     # Category schema
│   │   ├── model.ts        # Model schema
│   │   ├── user.ts         # User schema
│   │   └── index.ts        # Schema exports
│   ├── structure.ts        # Studio structure
│   └── types.ts            # TypeScript types
├── lib/                     # API utilities
│   ├── adPositionApi.ts    # Ad position API functions
│   ├── categoryApi.ts      # Category API functions
│   ├── modelApi.ts         # Model API functions
│   ├── userApi.ts          # User API functions
│   └── axiosInstance.ts    # HTTP client configuration
├── static/                  # Static assets
│   └── data/               # Static data files
└── package.json            # Dependencies and scripts
```

## 🎯 Advertisement Management

### Ad Position Schema

The `adPosition` content type includes:

```typescript
interface AdPosition {
  _id: string;
  _type: 'adPosition';
  title: string;
  page: 'homepage' | 'detail' | 'explore';
  position: string;
  adType: 'banner' | 'sidebar' | 'sponsored-model';
  size: string;
  enabled: boolean;
  priority: number;
  adSlot: string;
  fallbackContent: string;
  clientName: string;
  clientEmail: string;
  startDate: string;
  endDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
```

### Available Ad Positions

**Homepage (5 positions)**
- `homepage-header-banner` - Header banner (728x90)
- `homepage-mid-content-banner` - Mid-content banner (728x90)
- `homepage-sidebar-right` - Right sidebar (300x250)
- `homepage-sponsored-models` - Sponsored models (Native)
- `homepage-footer-banner` - Footer banner (728x90)

**Detail Page (4 positions)**
- `detail-header-banner` - Header banner (728x90)
- `detail-mid-content-banner` - Mid-content banner (728x90)
- `detail-sidebar-right` - Right sidebar (300x250)
- `detail-sponsored-similar` - Sponsored similar models (Native)

**Explore Page (5 positions)**
- `explore-header-banner` - Header banner (728x90)
- `explore-mid-content-banner` - Mid-content banner (728x90)
- `explore-sidebar-right` - Right sidebar (300x250)
- `explore-sidebar-left` - Left sidebar (300x250)
- `explore-sponsored-listings` - Sponsored listings (Native)

### Ad Management Features

1. **Create New Ad Position**
   - Select page and position
   - Choose ad type (banner, sidebar, sponsored-model)
   - Set size and priority
   - Configure ad slot and fallback content

2. **Client Information**
   - Store client name and email
   - Set campaign start and end dates
   - Add notes and special requirements

3. **Enable/Disable Ads**
   - Toggle ad visibility
   - Set priority for multiple ads
   - Schedule campaigns

4. **Fallback Content**
   - Configure content for ad blockers
   - Custom HTML/JavaScript
   - Branded placeholder content

## 👥 User Management

### User Schema

```typescript
interface User {
  _id: string;
  _type: 'user';
  username: string;
  email: string;
  name: string;
  avatar: string;
  role: 'user' | 'admin' | 'moderator';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### User Management Features

1. **View All Users**
   - List all registered users
   - Search and filter users
   - Sort by various criteria

2. **User Details**
   - View user profile information
   - Check user activity
   - Manage user roles

3. **Account Management**
   - Enable/disable user accounts
   - Reset user passwords
   - Delete user accounts

## 📁 Model Management

### Model Schema

```typescript
interface Model {
  _id: string;
  _type: 'model';
  title: string;
  description: string;
  category: Reference;
  subCategory: Reference;
  sourceSite: Reference;
  sourceUrl: string;
  thumbnailUrl: string;
  fileUrl: string;
  price: string;
  downloads: number;
  rating: number;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Model Management Features

1. **Model Information**
   - Edit model titles and descriptions
   - Update metadata and tags
   - Manage media assets

2. **Category Assignment**
   - Assign models to categories
   - Set subcategories
   - Link to source sites

3. **Content Moderation**
   - Review and approve models
   - Flag inappropriate content
   - Manage model status

## 🏷️ Category Management

### Category Schema

```typescript
interface Category {
  _id: string;
  _type: 'category';
  name: string;
  description: string;
  slug: string;
  platform: 'printables' | 'thangs' | 'both';
  parentCategory?: Reference;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Category Features

1. **Hierarchical Structure**
   - Create main categories
   - Add subcategories
   - Platform-specific organization

2. **SEO Optimization**
   - Custom slugs
   - Meta descriptions
   - Keywords and tags

3. **Visual Management**
   - Drag-and-drop organization
   - Bulk operations
   - Category statistics

## 🔧 API Integration

### Available API Functions

```typescript
// Ad Position APIs
getAllAdPositions()
getAdPositionsByPage(page: string)
getAdPositionById(id: string)
createAdPosition(data: AdPositionInput)
updateAdPosition(id: string, data: Partial<AdPositionInput>)
deleteAdPosition(id: string)
toggleAdPosition(id: string)
getActiveAdPositions()

// Category APIs
getAllCategories()
getCategoryById(id: string)
createCategory(data: CategoryInput)
updateCategory(id: string, data: Partial<CategoryInput>)
deleteCategory(id: string)

// Model APIs
getAllModels()
getModelById(id: string)
createModel(data: ModelInput)
updateModel(id: string, data: Partial<ModelInput>)
deleteModel(id: string)

// User APIs
getAllUsers()
getUserById(id: string)
updateUser(id: string, data: Partial<UserInput>)
deleteUser(id: string)
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Sanity Commands
npx sanity dev       # Start Sanity Studio
npx sanity build     # Build Sanity Studio
npx sanity deploy    # Deploy to Sanity
npx sanity init      # Initialize new Sanity project
```

### Custom Components

The admin panel includes custom React components:

1. **AdPositionTable**
   - Full CRUD operations for ad positions
   - Search and filter functionality
   - Bulk operations
   - Real-time updates

2. **CategoryTable**
   - Category management interface
   - Hierarchical display
   - Platform filtering
   - SEO tools

3. **ModelTable**
   - Model listing and management
   - Content moderation tools
   - Media asset management
   - Category assignment

4. **UserTable**
   - User management interface
   - Role assignment
   - Account status management
   - Activity tracking

## 🔒 Security

- **Authentication**: Sanity authentication system
- **Authorization**: Role-based access control
- **API Security**: Token-based API access
- **Data Validation**: Input validation and sanitization
- **Audit Trail**: Track all changes and modifications

## 📊 Analytics & Monitoring

- **Content Analytics**: Track content performance
- **User Activity**: Monitor user interactions
- **Ad Performance**: Track advertisement metrics
- **System Health**: Monitor API performance
- **Error Tracking**: Log and track errors

## 🚀 Deployment

### Deploy to Sanity

```bash
# Build the project
npm run build

# Deploy to Sanity
npx sanity deploy
```

### Environment Variables

Set up environment variables in your deployment platform:

```env
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production
SANITY_API_TOKEN=your-api-token
```

## 🆘 Support

For admin panel support:
- Check Sanity documentation
- Review component documentation
- Contact development team
- Create GitHub issues

## 🔮 Future Enhancements

- [ ] Advanced analytics dashboard
- [ ] Bulk import/export functionality
- [ ] Advanced search and filtering
- [ ] Custom workflow automation
- [ ] Integration with external tools
- [ ] Advanced user permissions
- [ ] Content scheduling
- [ ] Multi-language support

---

**Built with Sanity CMS and React** 🚀
