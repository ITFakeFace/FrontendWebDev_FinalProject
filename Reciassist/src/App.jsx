import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'

function Dashboard() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">📊 Dashboard</h2>
      <p>Welcome to the GitHub-like layout demo!</p>
    </div>
  );
}

function App() {

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
      </Route>
    </Routes>
  )
}

export default App
