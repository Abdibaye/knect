# Knect

**Knect** is a modern community and social networking platform built with [Next.js](https://nextjs.org/). It is designed to help users connect, join groups, discover events, and share resources efficiently.

## 🚀 Features

- **Authentication**: Secure Login and Registration pages with support for OAuth providers (Google/GitHub).
- **Community Hub**: Dedicated spaces for community interactions.
- **Groups**: Create and join interest-based groups.
- **Events**: Discover and manage community events.
- **Resources**: Share and access helpful resources.
- **Modern UI**: Built with a responsive and accessible design system using Tailwind CSS and Radix UI.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide React](https://lucide.dev/) (Icons)
- **Utilities**: `clsx`, `class-variance-authority` (for component variants)

## 📂 Project Structure

```bash
src/
├── app/                  # Next.js App Router pages
│   ├── auth/             # Authentication routes (Login, Register)
│   ├── community/        # Community main page
│   ├── events/           # Events page
│   ├── groups/           # Groups page
│   └── settings/         # User settings
├── components/           # Reusable UI components
│   ├── auth/             # Auth-specific forms
│   ├── ui/               # Base UI elements (Button, Input, Card, etc.)
│   └── shared/           # Shared layout components (Navbar, Sidebar, Footer)
└── lib/                  # Utility functions
```

## ⚡ Getting Started

Follow these steps to set up the project locally.

### 1. Clone the repository
```bash
git clone https://github.com/Abdibaye/knect.git
cd knect
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Run the development server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.