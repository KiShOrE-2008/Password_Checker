import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="bg-grid"></div>
    <div className="bg-radial"></div>
    <App />
  </React.StrictMode>,
)
