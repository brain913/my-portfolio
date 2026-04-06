import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import Portfolio from './portfolio.jsx'
import PortfolioGlass from './portfolio-glass.jsx'

function App() {
  const [isGlass, setIsGlass] = useState(false)
  return isGlass
    ? <PortfolioGlass onToggle={() => setIsGlass(false)} />
    : <Portfolio      onToggle={() => setIsGlass(true)}  />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
