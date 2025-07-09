import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { AuthProvider } from "./auth/AuthContext";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <PayPalScriptProvider options={{ "client-id": "AQ2ByBtWUqWORMonUwblwgL-oEpaOvqvhn50n7l4MGT1YnPgo6KTimOqNXD8wV-gIxb-gKNsf_uuiTnE", currency: "EUR" }}>
        <App />
      </PayPalScriptProvider>
    </AuthProvider>
  </StrictMode>,
)
