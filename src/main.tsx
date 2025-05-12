
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import Library from './pages/Library.tsx';
import { SidebarProvider } from './components/ui/sidebar.tsx';
import AppLayout from './layouts/AppLayout.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import NotFound from './pages/NotFound.tsx';

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <SidebarProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* App routes with sidebar layout */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<App />} />
          <Route path="library" element={<Library />} />
        </Route>
        
        {/* Not found route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </SidebarProvider>
  </BrowserRouter>
);
