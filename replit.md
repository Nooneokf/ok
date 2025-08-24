# replit.md

## Overview

This is a modern temporary email service application built with Next.js 15 that provides disposable email addresses with custom domain options. The application offers both anonymous and authenticated user experiences, with Pro features available through Discord authentication. The platform is internationalized, supports multiple themes, and includes a comprehensive blog system for content marketing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 15 with App Router and TypeScript
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: React hooks with SWR for data fetching
- **Animations**: Framer Motion for smooth transitions and micro-interactions
- **Form Handling**: React Hook Form with validation

### Internationalization (i18n)
- **Library**: next-intl for comprehensive internationalization
- **Supported Locales**: English, German, Chinese, Spanish, Hindi, French, Russian
- **Routing Strategy**: Locale-prefixed routes with middleware-based redirection
- **Content Structure**: JSON-based translation files with type safety

### Authentication & Authorization
- **Provider**: NextAuth.js with Discord OAuth integration
- **Session Management**: Server-side session handling with JWT tokens
- **User Tiers**: Anonymous, Free (Discord), and Pro plans with feature gating
- **Security**: Cookie-based authentication with secure token handling

### Email Management System
- **Core Feature**: Dynamic temporary email generation with custom usernames
- **Domain Support**: Multiple predefined domains for anonymous users, custom domains for Pro users
- **Storage Strategy**: Tiered storage (12-hour for anonymous, permanent cloud for Pro)
- **Real-time Updates**: WebSocket connections for live email notifications

### Content Management
- **Blog System**: Static markdown files with frontmatter processing
- **Build-time Generation**: Pre-generated blog manifest for optimal performance
- **SEO Optimization**: Automated sitemap generation and structured data
- **Content Rendering**: React Markdown with rehype/remark plugins

### Data Architecture
- **Database**: MongoDB for user profiles, custom domains, and Pro features
- **External API**: Dedicated service API for email processing and management
- **Caching Strategy**: Edge caching with Cloudflare integration
- **File Storage**: Public directory for static assets and blog content

### Performance Optimizations
- **Deployment**: OpenNext configuration for Cloudflare Workers
- **Image Optimization**: Next.js Image component with remote patterns
- **Bundle Optimization**: Tree shaking and code splitting
- **SEO**: Comprehensive meta tags, Open Graph, and JSON-LD structured data

## External Dependencies

### Core Services
- **MongoDB**: Primary database for user data, custom domains, and Pro features
- **Service API**: External REST API for email processing (tempmail.encorebot.me)
- **Cloudflare**: CDN, edge caching, and Workers deployment platform

### Authentication & Social
- **Discord OAuth**: Primary authentication provider for user accounts
- **NextAuth.js**: Authentication framework with session management

### Development & Analytics
- **Google Analytics**: User behavior tracking and analytics
- **Vercel/Cloudflare**: Deployment and hosting infrastructure
- **GitHub**: Source code repository and version control

### UI & Experience
- **Radix UI**: Unstyled, accessible component primitives
- **Lucide React**: Icon library for consistent iconography
- **React Icons**: Additional brand and social media icons
- **QR Code Generation**: qrcode.react for email sharing functionality

### Content & SEO
- **Gray Matter**: Frontmatter parsing for blog content
- **React Markdown**: Markdown rendering with plugin support
- **Next Sitemap**: Automated sitemap generation for SEO
- **Structured Data**: JSON-LD for search engine optimization

### Monitoring & User Experience
- **React Hot Toast/Sonner**: Toast notification system
- **SWR**: Data fetching with caching and revalidation
- **Framer Motion**: Animation library for enhanced UX
- **Theme Support**: next-themes for dark/light mode switching