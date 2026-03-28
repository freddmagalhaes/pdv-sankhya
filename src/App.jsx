import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Coleta from './pages/Coleta';
import AdminDashboard from './pages/Admin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/compras" element={<Coleta />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
