import './App.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import ProtectedRoute  from './components/ProtectedRoute';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';

    
function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
