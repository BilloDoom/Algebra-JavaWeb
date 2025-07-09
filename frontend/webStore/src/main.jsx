import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PayPalScriptProvider options={{ "client-id": "AQ2ByBtWUqWORMonUwblwgL-oEpaOvqvhn50n7l4MGT1YnPgo6KTimOqNXD8wV-gIxb-gKNsf_uuiTnE" }}>
      <App />
    </PayPalScriptProvider>
  </StrictMode>,
)
