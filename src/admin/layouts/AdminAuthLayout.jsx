import { Outlet } from 'react-router-dom';
import { AdminAuthProvider } from '../context/AdminAuthContext.jsx';

/** Wraps all `/admin/*` routes with shared auth state. */
export function AdminAuthLayout() {
  return (
    <AdminAuthProvider>
      <Outlet />
    </AdminAuthProvider>
  );
}
