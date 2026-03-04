# TasteHealth Web Application 

## 🍎 Project Overview

**Taste Health Harmony Hub** is a comprehensive meal planning and nutrition tracking web application designed to train users how to schedule healthy meal planning daily. Whether you're looking to establish sustainable eating habits, track nutritional intake, or discover balanced meal options, Taste Health empowers you to take control of your dietary wellness.

### 🎯 Vision
To make healthy eating accessible, actionable, and enjoyable through intelligent meal planning, personalized nutrition guidance, and community support.

---

## ✨ Key Features

### 📅 Meal Planning
- **Weekly Meal Planning**: Design balanced meal plans for the entire week
- **Daily Meal Scheduling**: Organize breakfast, lunch, dinner, and snacks
- **Meal Templates**: Use pre-designed meal templates or create custom ones
- **Flexible Customization**: Adjust portions, ingredients, and preparation methods

### 📊 Nutrition Tracking
- **Macronutrient Tracking**: Monitor protein, carbs, fats, and fiber intake
- **Calorie Counter**: Track daily caloric consumption vs. goals
- **Nutritional Insights**: View detailed breakdowns of nutrients per meal
- **Historical Data**: Review past meal plans and nutrition trends

### 🔍 Recipe Discovery
- **Search & Filter**: Find recipes by cuisine, ingredients, dietary restrictions
- **Dietary Preferences**: Support for vegetarian, vegan, gluten-free, keto, and more
- **Ratings & Reviews**: Community feedback on recipes
- **Easy-to-Follow Instructions**: Clear preparation steps and ingredient lists

### 👤 User Profile & Goals
- **Health Goals**: Set personal nutrition targets (weight management, fitness, health conditions)
- **Dietary Restrictions**: Specify allergies and food preferences
- **Progress Tracking**: Monitor your wellness journey over time
- **Personalized Recommendations**: Get AI-powered meal suggestions based on your goals

### 💾 Data Management
- **Cloud Storage**: All your meal plans and preferences saved securely
- **Export Options**: Download meal plans as PDF or printable formats
- **Sync Across Devices**: Access your plans on desktop, tablet, or mobile

---

## 🛠️ Tech Stack

**Frontend:**
- **Vite** - Lightning-fast build tool and dev server
- **React** - UI component library
- **TypeScript** - Type-safe JavaScript for better code quality
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **shadcn-ui** - High-quality React components built on Radix UI

**Backend & Database:**
- **Supabase** - PostgreSQL database with real-time capabilities
- **Authentication** - Secure user account management

**Development Tools:**
- **ESLint** - Code quality and consistency
- **PostCSS** - CSS transformations
- **Bun** - Fast JavaScript runtime (optional)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

**1. Clone the Repository**
```bash
git clone https://github.com/le-arch/tastehealth-harmony-hub.git
cd tastehealth-harmony-hub
```

**2. Install Dependencies**
```bash
npm install
# or
yarn install
```

**3. Set Up Environment Variables**
Create a `.env` file in the root directory and add your Supabase credentials:
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**4. Run Development Server**
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

```bash
npm run dev       # Start development server with hot reload
npm run build     # Build for production
npm run preview   # Preview production build locally
npm run lint      # Run ESLint to check code quality
```

---

## 📁 Project Structure

```
tastehealth-harmony-hub/
├── src/
│   ├── components/      # Reusable React components
│   ├── pages/          # Page components and routes
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API and business logic
│   ├── styles/         # Global styles and Tailwind config
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript type definitions
│   └── App.tsx         # Main app component
├── public/             # Static assets
├── dist/               # Production build output
├── supabase/           # Supabase configuration and migrations
├── components.json     # shadcn/ui configuration
├── tailwind.config.ts  # Tailwind CSS configuration
├── vite.config.ts      # Vite build configuration
├── tsconfig.json       # TypeScript configuration
├── package.json        # Project dependencies
└── README.md          # This file
```

---

## 🌐 Live Demo

Visit the live application: [https://tastehealth-harmony-hub.vercel.app](https://tastehealth-harmony-hub.vercel.app)

---

## 📝 How to Edit This Code

There are several ways to work on this project:

### **Option 1: Use Your Preferred IDE**
Clone the repo locally and make changes:
```bash
git clone https://github.com/le-arch/tastehealth-harmony-hub.git
cd tastehealth-harmony-hub
npm install
npm run dev
```

### **Option 2: Edit Directly on GitHub**
- Navigate to any file in the repository
- Click the "Edit" button (pencil icon) in the top-right corner
- Make your changes and commit directly

### **Option 3: Use GitHub Codespaces**
- Go to the repository main page
- Click the green "Code" button
- Select "Codespaces" tab
- Click "New codespace" to launch a cloud-based IDE
- Edit files and commit changes directly

---

## 🚀 Deployment

### Deploy to Vercel

**Step 1: Prepare Your Application**
Ensure your build is production-ready:
```bash
npm run build
```

**Step 2: Push Code to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

**Step 3: Connect to Vercel**
1. Go to [https://vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Select this repository
5. Vercel will auto-detect React/Vite settings

**Step 4: Deploy**
- Vercel will automatically deploy your changes on every push to main
- Your app will be live at: `https://your-app-name.vercel.app`

**Step 5: Custom Domain (Optional)**
- Go to project settings in Vercel
- Add your custom domain
- Update DNS records as directed

---

## 🔒 Security

For security vulnerabilities and responsible disclosure, please refer to our [SECURITY.md](SECURITY.md) policy.

---

## 📖 Features Documentation

- **Meal Planning Guide**: Learn how to create and manage your weekly meal plans
- **Nutrition Tracking**: Understand macronutrient and calorie tracking
- **Goal Setting**: Set up your personal health goals
- **API Documentation**: For developers integrating with Taste Health

---

## 🤝 Contributing

We welcome contributions! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature idea? Please:
1. Check [existing issues](https://github.com/le-arch/tastehealth-harmony-hub/issues)
2. Create a [new issue](https://github.com/le-arch/tastehealth-harmony-hub/issues/new) with:
   - Clear title and description
   - Steps to reproduce (for bugs)
   - Expected vs. actual behavior
   - Screenshots if applicable

---

## 📄 License

This project is currently unlicensed. See the repository for more details.

---

## 👨‍💻 Author

**Le Arch** - [GitHub Profile](https://github.com/le-arch)

---

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Backend powered by [Supabase](https://supabase.com/)
- Deployed on [Vercel](https://vercel.com/)

---

## 📧 Support

Have questions or need help? 
- Check the [documentation](./docs)
- Open an [issue](https://github.com/le-arch/tastehealth-harmony-hub/issues)
- Contact: [basilleonora@gmail.com]

---

**Last Updated**: 2026-03-04 09:51:29
**Version**: 1.0.0
