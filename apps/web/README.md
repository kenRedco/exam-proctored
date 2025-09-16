# TopProctor Web Application

This is the web application for TopProctor, a platform for ethical proctored/tutoring sessions.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB (for the API)
- Redis (for queues and caching)

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Copy the example environment file and update the values:

```bash
cp .env.example .env.local
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
.
├── app/                    # App Router
├── components/             # Reusable UI components
│   ├── ui/                 # Shadcn/ui components
│   └── ...
├── lib/                    # Utility functions and configurations
├── public/                 # Static files
├── styles/                 # Global styles
└── types/                  # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Environment Variables

Create a `.env.local` file in the root directory and add the following environment variables:

```env
# Next.js
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Authentication
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling with the following plugins:

- `@tailwindcss/typography` - For beautiful typography
- `@tailwindcss/forms` - For better form element styling
- `tailwindcss-animate` - For animations

## State Management

- React Context for global state
- React Query for server state management
- Zustand for client state management (if needed)

## API Integration

API requests are handled using Axios with interceptors for authentication and error handling.

## Testing

To run tests:

```bash
npm test
# or
yarn test
```

## Deployment

### Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

### Docker

You can also deploy using Docker:

```bash
docker build -t topproctor-web .
docker run -p 3000:3000 topproctor-web
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
