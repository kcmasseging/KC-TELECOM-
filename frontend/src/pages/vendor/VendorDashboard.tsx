import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { reportsApi, walletApi } from '../../lib/api';
import { formatNaira } from '../../lib/format';
import { Banner, Card, Spinner, StatCard } from '../../components/ui';
import type { VendorSummary, Wallet } from '../../types';

export default function VendorDashboard() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [summary, setSummary] = useState<VendorSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([walletApi.getWallet(), reportsApi.vendorSummary()])
      .then(([w, s]) => {
        setWallet(w);
        setSummary(s);
      })
      .catch((err) => setError(err.message ?? 'Failed to load dashboard'))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="page-heading">
        <p className="eyebrow">Vendor workspace</p>
        <h1>Good to see you back.</h1>
        <p className="page-subtitle">Manage your telecom services and keep your business moving.</p>
      </div>
      {error && <Banner kind="error" message={error} />}

      <div className="wallet-hero">
        <div>
          <p className="wallet-label">Available wallet balance</p>
          <p className="wallet-amount">{wallet ? formatNaira(wallet.balance) : '—'}</p>
          <Link to="/vendor/wallet" className="wallet-link">Fund wallet <span aria-hidden="true">→</span></Link>
        </div>
        <span className="wallet-mark" aria-hidden="true">◆</span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="PINs purchased" value={summary ? String(summary.totalPinsBought) : '—'} />
        <StatCard label="Total spent" value={summary ? formatNaira(summary.totalSpent) : '—'} />
      </div>

      <section>
        <div className="section-heading"><h2>Quick actions</h2><Link to="/vendor/services">View all services</Link></div>
        <div className="service-grid">
          <Link to="/vendor/buy-airtime" className="service-card service-card-blue"><span className="service-icon">◒</span><span><strong>Airtime</strong><small>Recharge a number</small></span><span className="service-arrow">→</span></Link>
          <Link to="/vendor/buy-data" className="service-card service-card-cyan"><span className="service-icon">◈</span><span><strong>Data</strong><small>Browse data plans</small></span><span className="service-arrow">→</span></Link>
          <Link to="/vendor/history" className="service-card service-card-dark"><span className="service-icon">↺</span><span><strong>History</strong><small>Review activity</small></span><span className="service-arrow">→</span></Link>
        </div>
      </section>
    </div>
  );
}
