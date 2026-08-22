import { Link } from 'react-router-dom';

const services = [
  { to: '/vendor/buy-airtime', title: 'Airtime', detail: 'Recharge any supported network instantly.', tone: 'service-card-blue', icon: '◒' },
  { to: '/vendor/buy-data', title: 'Data', detail: 'Purchase data plans for your customers.', tone: 'service-card-cyan', icon: '◈' },
  { to: '/vendor/buy-pins', title: 'Recharge PINs', detail: 'Buy PIN stock from available batches.', tone: 'service-card-dark', icon: '◆' },
];

export default function Services() {
  return (
    <div className="space-y-6">
      <div className="page-heading"><p className="eyebrow">What do you need today?</p><h1>Services</h1><p className="page-subtitle">Choose a service to get started.</p></div>
      <div className="service-grid">
        {services.map((service) => (
          <Link key={service.to} to={service.to} className={`service-card ${service.tone}`}>
            <span className="service-icon">{service.icon}</span>
            <span><strong>{service.title}</strong><small>{service.detail}</small></span>
            <span className="service-arrow">→</span>
          </Link>
        ))}
      </div>
      <section>
        <div className="section-heading"><h2>Manage your account</h2></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link to="/vendor/wallet" className="surface-card rounded-xl border border-slate-200 bg-white p-5 hover:border-brand-500"><strong className="text-sm text-slate-900">Wallet & funding</strong><p className="mt-1 text-xs text-slate-500">View your balance and fund securely with Paystack.</p></Link>
          <Link to="/vendor/purchases" className="surface-card rounded-xl border border-slate-200 bg-white p-5 hover:border-brand-500"><strong className="text-sm text-slate-900">My PIN purchases</strong><p className="mt-1 text-xs text-slate-500">Access PINs you have purchased.</p></Link>
        </div>
      </section>
    </div>
  );
}
