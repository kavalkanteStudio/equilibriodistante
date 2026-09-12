import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import './App.css'

function App() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Other routes will be added here as we implement them */}
      </Routes>
    </main>
  )
}

export default App
