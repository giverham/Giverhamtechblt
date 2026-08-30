import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import AdminPage from '@/pages/AdminPage';
import AdminLoginPage from '@/pages/AdminLoginPage';

const SECTION_ROUTES = ['/', '/services', '/projects', '/tech', '/about', '/testimonials', '/blog', '/contact', '/privacy', '/terms'];

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {SECTION_ROUTES.map(path => (
          <Route key={path} path={path} element={<HomePage />} />
        ))}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
