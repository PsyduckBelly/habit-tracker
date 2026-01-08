import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import App from './App';
import Showcase from './pages/Showcase';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/showcase" element={<Showcase />} />
      </Routes>
    </BrowserRouter>
  );
}

