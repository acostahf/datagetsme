# DataGetsMe 📊

**Privacy-first web analytics that gives you actionable insights.**

DataGetsMe is a modern web analytics platform built with Next.js 15, Supabase, and TypeScript. Get real-time visitor insights without compromising your users' privacy.

## ✨ Features

- 🔒 **Privacy-First**: No cookies, respects Do Not Track, GDPR compliant
- ⚡ **Real-Time Analytics**: Live visitor tracking and instant updates
- 👥 **Team Management**: Role-based permissions for site collaboration
- 🌙 **Dark/Light Theme**: System-aware theme switching
- 🔗 **Magic Links**: Passwordless authentication option
- 📱 **Responsive Design**: Works on all devices
- 🚀 **Fast & Lightweight**: Minimal impact on your website performance

## 🚀 Quick Start

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/datagetsme.git
   cd datagetsme
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

### Complete Setup Guide

For detailed setup instructions including Supabase configuration, see [SETUP.md](./SETUP.md)

## 🚢 Production Deployment

Deploy to Vercel in minutes! See our comprehensive [DEPLOYMENT.md](./DEPLOYMENT.md) guide.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/datagetsme)

### Required Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_random_secret
```

## 📖 Usage

### Adding Analytics to Your Site

1. **Create an account** and log in
2. **Add your website** in the dashboard
3. **Copy the tracking script**:
   ```html
   <script async src="https://your-app.com/api/script/SITE_ID"></script>
   ```
4. **Paste it in your website's `<head>`**
5. **View real-time analytics** in your dashboard

### Team Collaboration

- **Invite team members** with different permission levels
- **Owner**: Full control over site and team
- **Admin**: Can view analytics and manage team
- **Viewer**: Can only view analytics

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth with magic links
- **Deployment**: [Vercel](https://vercel.com/)
- **Charts**: [Recharts](https://recharts.org/)

## 📁 Project Structure

```
datagetsme/
├── app/                   # Next.js App Router pages
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Dashboard pages
│   └── (auth)/           # Public auth pages
├── components/           # React components
├── lib/                  # Utilities and configurations
│   ├── auth/            # Authentication helpers
│   ├── database/        # Database queries
│   ├── supabase/        # Supabase client configs
│   └── types/           # TypeScript type definitions
├── supabase/            # Database migrations
└── public/              # Static assets
```

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database Migrations

Migrations are located in `supabase/migrations/`. Run them in order in your Supabase SQL editor.

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines and submit pull requests to our GitHub repository.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📚 [Documentation](./SETUP.md)
- 🚀 [Deployment Guide](./DEPLOYMENT.md)
- 🐛 [Issues](https://github.com/your-username/datagetsme/issues)
- 💬 [Discussions](https://github.com/your-username/datagetsme/discussions)

## 🙏 Acknowledgments

Built with modern web technologies and inspired by privacy-focused analytics solutions.

---

**DataGetsMe** - Your data gets you actionable insights, privately and efficiently.
