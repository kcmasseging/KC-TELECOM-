import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { airtimeApi, dataApi, walletApi, ApiError } from '../../lib/api';
import { formatDate, formatNaira } from '../../lib/format';
import { Badge, Banner, EmptyState, Spinner } from '../../components/ui';
import type { AirtimePurchase, DataSubscription, WalletTransaction } from '../../types';

type Activity = { id: string; date: string; title: string; detail: string; amount: string; status: string; tone: 'green' | 'amber' | 'red' | 'slate' };

export default function History() {
  const [items, setItems] = useState<Activity[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([walletApi.getTransactions(), airtimeApi.myPurchases(), dataApi.history()])
      .then(([transactions, airtime, data]) => {
        const walletItems: Activity[] = transactions.map((item: WalletTransaction) => ({ id: item.id, date: item.createdAt, title: item.type === 'FUNDING' ? 'Wallet funding' : 'Wallet debit', detail: item.description ?? item.reference, amount: formatNaira(item.amount), status: item.status, tone: item.status === 'SUCCESS' ? 'green' : item.status === 'PENDING' ? 'amber' : 'red' }));
        const airtimeItems: Activity[] = airtime.map((item: AirtimePurchase) => ({ id: item.id, date: item.createdAt, title: 'Airtime purchase', detail: `${item.network} · ${item.phone}`, amount: formatNaira(item.amount), status: item.status, tone: item.status === 'COMPLETED' ? 'green' : item.status === 'PENDING' ? 'amber' : 'red' }));
        const dataItems: Activity[] = data.map((item: DataSubscription) => ({ id: item.id, date: item.createdAt, title: 'Data purchase', detail: `${item.network} · ${item.plan}`, amount: formatNaira(item.amount), status: item.status, tone: item.status === 'COMPLETED' ? 'green' : item.status === 'PENDING' ? 'amber' : 'red' }));
        setItems([...walletItems, ...airtimeItems, ...dataItems].sort((a, b) => b.date.localeCompare(a.date)));
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load history'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  return (
    <div className="space-y-6">
      <div className="page-heading"><p className="eyebrow">Your activity</p><h1>History</h1><p className="page-subtitle">A unified view of wallet and service activity.</p></div>
      {error && <Banner kind="error" message={error} />}
      {items.length === 0 ? <div className="surface-card rounded-xl border border-slate-200 bg-white"><EmptyState message="No activity yet." /></div> : <div className="surface-card overflow-hidden rounded-xl border border-slate-200 bg-white"><div className="divide-y divide-slate-100">{items.map((item) => <div key={item.id} className="flex items-center justify-between gap-4 px-5 py-4"><div className="min-w-0"><p className="truncate text-sm font-bold text-slate-900">{item.title}</p><p className="mt-1 truncate text-xs text-slate-500">{item.detail} · {formatDate(item.date)}</p></div><div className="shrink-0 text-right"><p className="text-sm font-bold text-slate-900">{item.amount}</p><Badge tone={item.tone}>{item.status}</Badge></div></div>)}</div></div>}
      <div className="text-center text-xs text-slate-500"><Link to="/vendor/transactions" className="font-bold text-brand-600">View detailed wallet transactions →</Link></div>
    </div>
  );
}
