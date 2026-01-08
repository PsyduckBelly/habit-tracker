import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Showcase from './pages/Showcase';

export default function AppRouter() {
  return (
    <BrowserRouter basename="/habit-tracker">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/showcase" element={<Showcase />} />
      </Routes>
    </BrowserRouter>
  );
}

