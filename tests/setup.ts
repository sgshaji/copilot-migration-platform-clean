
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}))

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />
  },
}))

// Mock environment variables
process.env.NEXT_PUBLIC_APP_URL = 'https://test.example.com'
process.env.REPLIT_DEV_DOMAIN = 'test.replit.dev'
