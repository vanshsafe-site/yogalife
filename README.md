# Yoga Life Website

A full-featured yoga website with user authentication, attendance tracking, referral program, reward system, and dashboards for users and administrators.

## Features

- **Static Pages**: Home, About, and Pricing pages with responsive design
- **User Authentication**: Sign up and login with secure authentication
- **User Dashboard**: Track attendance, view points, manage referrals
- **Admin Dashboard**: Monitor users, activity, and statistics
- **Attendance System**: Track user session duration via mouse movement detection
- **Referral System**: Generate and track referral codes for new member acquisition
- **Reward System**: Points for attendance and referrals, badges for attendance milestones

## Tech Stack

- **Frontend & Backend**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas/database)
- **Deployment**: [Vercel](https://vercel.com/)

## Project Structure

```
yoga-website/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── (auth)/       # Authentication routes (grouped)
│   │   │   ├── login/    # Login page
│   │   │   └── signup/   # Signup page
│   │   ├── (dashboard)/  # Dashboard routes (grouped)
│   │   │   ├── dashboard/# User dashboard
│   │   │   └── admin/    # Admin dashboard
│   │   ├── about/        # About page
│   │   ├── pricing/      # Pricing page
│   │   ├── api/          # API routes
│   │   └── page.tsx      # Home page
│   ├── components/       # Reusable UI components
│   ├── lib/              # Utility functions and libraries
│   │   └── db/           # Database connection utilities
│   └── models/           # Database models
└── public/               # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- MongoDB Atlas account (for database)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd yoga-website
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with the following environment variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Deployment

The app can be easily deployed to Vercel:

1. Push your code to a GitHub repository
2. Import the project to Vercel
3. Set the environment variables in the Vercel dashboard:
   - Go to your project on Vercel
   - Navigate to Settings > Environment Variables
   - Add the following variables:
     ```
     MONGODB_URI=your_mongodb_connection_string
     ```
4. Deploy

### Troubleshooting Login Issues on Vercel

If the login functionality works locally but not on Vercel, check the following:

1. **Environment Variables**: Ensure `MONGODB_URI` is properly set in Vercel's environment variables.

2. **Cookie Settings**: The application uses HTTP-only cookies for authentication. Make sure third-party cookies are not blocked in your browser.

3. **Database Connection**: Check the function logs in Vercel to see if there are any MongoDB connection errors.

4. **Debug Mode**: You can enable debug logs by adding `DEBUG=true` to your Vercel environment variables.

## Demo Credentials

For testing purposes, you can use the following credentials:

- **Email**: demo@example.com
- **Password**: password123

## Future Enhancements

- Email verification
- Password reset functionality
- Notifications system
- Class scheduling and booking
- Payment integration
- Mobile app

## Testing

This project uses Jest and React Testing Library for testing components, pages, and API routes.

### Running Tests

To run all tests:

```bash
npm test
# or
yarn test
```

To run tests in watch mode:

```bash
npm run test:watch
# or
yarn test:watch
```

To run tests with coverage:

```bash
npm run test:coverage
# or
yarn test:coverage
```

### Test Structure

- Component tests: `src/components/__tests__/`
- API tests: `src/app/api/**/route.test.ts`
- Page tests: `src/app/**/__tests__/`

### Writing Tests

#### Component Tests

Use React Testing Library to test components:

```tsx
import { render, screen } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

#### API Tests

Use Jest to test API routes:

```tsx
import { NextRequest } from 'next/server';
import { GET, POST } from './route';

describe('API Route', () => {
  it('handles valid requests', async () => {
    const req = new NextRequest('http://localhost:3000/api/example', {
      method: 'POST',
      body: JSON.stringify({ key: 'value' })
    });
    
    const response = await POST(req);
    expect(response.status).toBe(200);
  });
});
```

## Built With

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Jest](https://jestjs.io/) - Testing framework
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) - Testing utilities

## Latest Update
Last updated: May 2, 2024
