import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { inject as injectWebAnalytics } from '@vercel/analytics';
import { injectSpeedInsights } from "@vercel/speed-insights"

import '@/index.css'
import App from './App'
import { store } from '@/store/index.ts'
import { ThemeProvider } from "@/components/ui/theme-provider"
import { SettingsProvider } from '@/components/settings';

if (!window.isElectronApp) {
  injectWebAnalytics();
  injectSpeedInsights()
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SettingsProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Provider store={store}>
          <App />
        </Provider>
      </ThemeProvider>
    </SettingsProvider>
  </React.StrictMode>,
)
