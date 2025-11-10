import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Layout from './components/layout/Layout'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><h1>Hello World</h1></Layout>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
