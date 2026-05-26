import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute  from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import CommitDetails from './pages/commit-details';
import { Toaster } from "@/components/ui/sonner";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute><Home /></ProtectedRoute>
  },
  {
    path: "/login",
    element: <PublicRoute><Login /></PublicRoute>
  },
  {
    path: "/register",
    element: <PublicRoute><Register /></PublicRoute>
  },
  {
    path: "/commit/:id",
    element: <ProtectedRoute><CommitDetails /></ProtectedRoute>
  }
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  )
}

export default App
