import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const vendorNav = [
  { to: '/vendor', label: 'Home', end: true, icon: '⌂' },
  { to: '/vendor/services', label: 'Services', icon: '◇' },
  { to: '/vendor/history', label: 'History', icon: '↺' },
  { to: '/vendor/profile', label: 'Profile', icon: '○' },
];

const adminNav = [
  { to: '/admin', label: 'Overview', end: true, icon: '◆' },
  { to: '/admin/create-batch', label: 'Create PIN Batch', icon: '◆' },
  { to: '/admin/upload-pins', label: 'Upload PINs', icon: '◆' },
  { to: '/admin/inventory', label: 'Inventory', icon: '◆' },
  { to: '/admin/vendors', label: 'Vendors', icon: '◆' },
  { to: '/admin/sales', label: 'Sales', icon: '◆' },
  { to: '/admin/reports', label: 'Revenue & Profit', icon: '◆' },
];

export function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const nav = user?.role === 'ADMIN' ? adminNav : vendorNav;
  const isVendor = user?.role === 'VENDOR';

  return (
    <div className="app-shell flex min-h-screen bg-slate-50">
      <aside className="sidebar hidden w-64 shrink-0 flex-col sm:flex">
        <div className="brand-lockup flex h-20 items-center gap-3 px-6">
          <span className="brand-diamond" aria-hidden="true">◆</span>
          <span className="text-lg font-extrabold tracking-tight text-white">KC TELECOM</span>
        </div>
        <nav className="flex-1 space-y-1 px-4 py-5">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `sidebar-link flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                  isActive ? 'sidebar-link-active' : 'text-slate-400 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <span className="text-base opacity-80" aria-hidden="true">{item.icon ?? '◆'}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="topbar flex h-20 items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3 sm:hidden">
            <span className="brand-diamond brand-diamond-small" aria-hidden="true">◆</span>
            <span className="text-base font-extrabold tracking-tight text-brand-700">KC TELECOM</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold text-slate-900">{user?.fullName}</p>
              <p className="text-xs text-slate-500">{user?.role === 'ADMIN' ? 'Administrator' : 'Vendor account'}</p>
            </div>
            <button
              onClick={logout}
              className="logout-button rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Log out
            </button>
          </div>
        </header>

        {!isVendor && <nav className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-white px-3 py-2 sm:hidden">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>}

        <main className={`page-content flex-1 p-5 sm:p-8 ${isVendor ? 'pb-24 sm:pb-8' : ''}`}>
          <Outlet />
        </main>
        {isVendor && <nav className="mobile-nav fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-slate-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur sm:hidden">
          {vendorNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `flex flex-col items-center gap-1 py-1 text-[10px] font-bold ${isActive || (item.to === '/vendor/history' && location.pathname.includes('history')) ? 'text-brand-600' : 'text-slate-400'}`}
            >
              <span className="text-lg leading-none" aria-hidden="true">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>}
      </div>
    </div>
  );
}
