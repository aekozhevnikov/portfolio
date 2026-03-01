# Personal Portfolio - Anton Kozhevnikov

A modern, responsive developer portfolio built with **Quasar Framework (Vue 3)** and **TypeScript**.

## Technologies

### Core Framework
- **Vue 3** - Progressive JavaScript framework with Composition API
- **Quasar Framework v2** - Full-featured Vue 3 framework for building responsive web applications
- **TypeScript** - Type-safe JavaScript (strict mode enabled)
- **Vue Router** - Official router for Vue.js (history mode)
- **Pinia** - Intuitive state management library for Vue

### UI & Styling
- **Quasar Components** - Pre-built, accessible UI components (QAvatar, QTooltip, etc.)
- **Font Awesome v6** - Comprehensive icon library
- **Devicons** - Technology-specific SVG icons
- **SCSS** - CSS preprocessor with Quasar's styling system

### Data & Configuration
- **Pinia Store** - Reactive state management for site configuration
- **Type-safe configs** - Centralized configuration with TypeScript interfaces
- **Theme System** - Centralized color palette (primary: indigo, secondary: pink, accent: teal)

### Content Management
- **i18n (Vue I18n)** - Internationalization with Russian and English support
- **Site Config** - Content stored in TypeScript configs (projects, skills, services, reviews)
- **Dynamic PDF Generation** - Resume generation with **pdfmake** (supports dark/light themes)

### Backend Integration
- **Supabase** - Backend-as-a-Service for future data persistence (client initialized but optional)

### Build & Deployment
- **Vite** - Fast build tool and dev server
- **GitHub Actions** - CI/CD pipeline with automated testing and deployment
- **GitHub Pages** - Automatic deployment on push to `main` branch

## Features

- **Fully Responsive** - Optimized for all device sizes (mobile, tablet, desktop)
- **Multi-language Support** - Russian and English with instant language switching
- **Dark/Light Theme** - User-toggleable theme with smooth transitions
- **Skills Visualization** - Icon-based tech stack display with tooltips
- **Projects Showcase** - Filterable project portfolio with modal details view
- **Services Section** - Highlight offered services in a structured table format
- **Testimonials** - Client reviews and testimonials section
- **Social Links** - Integrated social media links with custom icons
- **Resume PDF** - One-click resume download in A4 format (dark/light theme aware)
- **Smooth Animations** - CSS transitions and Quasar animations
- **SEO-friendly** - Meta tags management via Quasar

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── ui/                         # UI components
│   │   │   ├── NavBar.vue              # Navigation bar with language switcher
│   │   │   ├── HeroSection.vue         # Hero section + About info
│   │   │   ├── ExpertiseSection.vue    # Skills/tech stack display
│   │   │   ├── ProjectsSection.vue     # Projects grid with filtering
│   │   │   ├── ProjectModal.vue        # Project details modal
│   │   │   ├── ServicesSection.vue     # Services table
│   │   │   ├── ReviewsSection.vue      # Client testimonials
│   │   │   ├── FindMe.vue              # Contact + Social links
│   │   │   ├── Footer.vue              # Footer component
│   │   │   └── ProjectHolder.vue       # Individual project card
│   │   └── LanguageSwitcher.vue        # Language toggle component
│   ├── layouts/
│   │   └── MainLayout.vue              # Main application layout
│   ├── router/
│   │   └── index.ts                    # Vue Router configuration
│   ├── stores/
│   │   └── siteStore.ts                # Pinia store for site config
│   └── App.vue                         # Root component
├── pages/
│   └── portfolio/
│       ├── index.ts                    # Portfolio page route
│       └── ui/
│           └── HomePage.vue            # Main portfolio page
├── config/
│   ├── site.config.ts                  # TypeScript interfaces
│   ├── site.config.en.ts               # English content
│   ├── site.config.ru.ts               # Russian content
│   ├── projects.config.ts              # Project configuration types
│   └── theme.config.ts                 # Centralized theme colors
├── i18n/
│   ├── index.ts                        # i18n initialization
│   └── locales/
│       ├── en.json                     # English translations
│       └── ru.json                     # Russian translations
├── utils/
│   ├── techIcons.ts                    # Devicon URL generator
│   ├── socialIcons.ts                  # Social icon mappings
│   └── resumePDF.ts                    # PDF generation logic
├── boot/
│   ├── i18n.ts                         # i18n boot file
│   ├── components.ts                   # Auto-import components
│   └── supabase.ts                     # Supabase client initialization
└── styles/
    └── app.scss                        # Global styles
```

## How to Run

### Prerequisites

- **Node.js** v18 or higher (v20+ recommended)
- **npm** or **yarn**

### Install Dependencies

```bash
npm install
```

### Development Mode

```bash
npm run dev
```

This starts the development server at `http://localhost:8080` with hot module replacement.

### Production Build

```bash
npm run build
```

Build artifacts will be generated in the `dist/spa/` directory.

### Run Tests

```bash
npm test
```

Runs Jest unit tests with coverage.

## Deployment

### GitHub Pages (Automatic)

This project uses **GitHub Actions** for CI/CD. When you push to the `main` branch:

1. ✅ Tests are executed
2. ✅ Project is built
3. ✅ Automatically deployed to GitHub Pages

No manual steps required!

### Manual Deployment (Optional)

If you need to deploy manually, you can use the legacy script:

```bash
npm run deploy
```

Or build and deploy manually:

```bash
npm run build
```

Then upload the `dist/spa` folder to your GitHub Pages branch.

## Configuration

### Environment Variables

Create a `.env` file in the project root (optional, only needed for Supabase features):

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Customize Content

Edit the configuration files in `src/config/`:

- **`site.config.en.ts`** - English content (personal info, projects, skills, services, reviews)
- **`site.config.ru.ts`** - Russian content
- **`theme.config.ts`** - Color scheme and theme variables

### Adding New Projects

Add projects to `src/config/site.config.en.ts` and/or `site.config.ru.ts`:

```typescript
{
  id: 'unique-id',
  title: 'Project Name',
  description: 'Short description',
  technologies: {
    frontend: [{ language: 'Vue.js', icon: 'vuejs', variant: 'original' }],
    backend: [{ language: 'Node.js', icon: 'nodejs', variant: 'original' }],
    // ... other categories
  },
  link: 'https://demo-url.com',
  codeLink: 'https://github.com/...',
  image: 'path/to/image.jpg',
  featured: true,
  order: 1,
  highlights: ['Key achievement 1', 'Key achievement 2'],
}
```

## Testing

This project uses **Jest** with **Vue Test Utils** for unit testing.

- Test files are located in `tests/unit/`
- Run tests: `npm test` or `npm test -- --watch`
- Coverage reports are generated in `coverage/`

## License

MIT

## Deploy to GitHub Pages

This project uses GitHub Actions for automatic deployment. When you push to the `main` branch, the workflow will:

1. Run tests
2. Build the project
3. Deploy to GitHub Pages automatically

No manual deployment is required.

If you need to trigger a manual deployment, you can use the GitHub Actions interface:
- Go to the "Actions" tab in your repository
- Select the "Deploy to GitHub Pages" workflow
- Click "Run workflow" and select the `main` branch

Alternatively, you can build the project manually:
```bash
npm run build
```
The built files will be in `dist/spa`.

### Legacy deployment scripts

Note: The following scripts exist but are not used in the current CI/CD setup:
- `npm run deploy` - Uses gh-pages package (legacy)
- `npm run build:gh-pages` - Builds the project (legacy)