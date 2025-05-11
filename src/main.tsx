
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import Library from './pages/Library.tsx';
import { SidebarProvider } from './components/ui/sidebar.tsx';
import AppLayout from './layouts/AppLayout.tsx';

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <SidebarProvider>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route path="/app" element={<App />} />
          <Route path="/library" element={<Library />} />
          <Route path="*" element={<Navigate to="/app" replace />} />
        </Route>
      </Routes>
    </SidebarProvider>
  </BrowserRouter>
);
