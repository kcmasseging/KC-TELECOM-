import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();
  return (
    <div className="space-y-6">
      <div className="page-heading"><p className="eyebrow">Account settings</p><h1>Profile</h1><p className="page-subtitle">Your KC TELECOM account information.</p></div>
      <div className="surface-card max-w-2xl rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6"><div className="profile-avatar">{user?.fullName?.charAt(0).toUpperCase()}</div><div><h2 className="text-lg font-extrabold text-slate-900">{user?.fullName}</h2><p className="text-sm text-slate-500">Vendor account</p></div></div>
        <dl className="grid gap-5 py-6 sm:grid-cols-2"><div><dt className="profile-label">Email address</dt><dd className="profile-value">{user?.email}</dd></div><div><dt className="profile-label">Phone number</dt><dd className="profile-value">{user?.phone}</dd></div></dl>
        <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5"><Link to="/vendor/wallet" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700">Open wallet</Link><button onClick={logout} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50">Log out</button></div>
      </div>
    </div>
  );
}
