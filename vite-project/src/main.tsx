import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import './lib/amplify'
import Layout from './components/Layout'
import AuthGuard from './components/AuthGuard'
import Home from './pages/Home'
import Schedule from './pages/Schedule'
import Naming from './pages/Naming'
import History from './pages/History'
import Login from './pages/Login'
import Callback from './pages/Callback'
import './index.css'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/callback',
    element: <Callback />,
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <Layout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: 'schedule', element: <Schedule /> },
      { path: 'naming/:date', element: <Naming /> },
      { path: 'history', element: <History /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
