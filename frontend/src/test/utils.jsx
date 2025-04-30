import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Custom render function to include router
export function renderWithRouter(ui, { route = '/' } = {}) {
  window.history.pushState({}, 'Test page', route);
  
  return {
    ...render(ui, { wrapper: BrowserRouter }),
  };
}