import './App.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import ProtectedRoute  from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';

    
function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
