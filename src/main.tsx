
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import Library from './pages/Library.tsx';
import { SidebarProvider } from './components/ui/sidebar.tsx';
import AppLayout from './layouts/AppLayout.tsx';
import NotFound from './pages/NotFound.tsx';

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <SidebarProvider>
      <Routes>
        {/* App routes with sidebar layout - no auth required now */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<App />} />
          <Route path="library" element={<Library />} />
        </Route>
        
        {/* Not found route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </SidebarProvider>
  </BrowserRouter>
);
