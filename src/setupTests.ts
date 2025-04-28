// This file is automatically loaded by Jest before running tests
import '@testing-library/jest-dom';

// Extend Jest matchers with @testing-library/jest-dom
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(className: string): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveTextContent(text: string | RegExp): R;
      // Add other matchers as needed
    }
  }
} 