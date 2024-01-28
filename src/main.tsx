import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { inject as injectWebAnalytics } from '@vercel/analytics';
import { injectSpeedInsights } from "@vercel/speed-insights"

import '@/index.css'
import App from './App'
import { store } from '@/store/index.ts'
import { ThemeProvider } from "@/components/ui/theme-provider"

injectWebAnalytics();
injectSpeedInsights()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
)
