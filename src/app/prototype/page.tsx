'use client';

import { useState } from 'react';
import { X, Eye, Zap, TrendingUp, Search, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = 'seller' | 'buyer';
type Budget = 50 | 100 | 200;
type Duration = 7 | 14 | 30;

interface Campaign {
  budget: Budget;
  duration: Duration;
  dailyViews: number;
  chartData: number[];
}

interface SellerProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface SearchResult {
  id: string;
  name: string;
  seller: string;
  price: number;
  originalPrice?: number;
  promoted: boolean;
  image: string;
  rating: number;
  reviews: number;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const SELLER_PRODUCTS: SellerProduct[] = [
  { id: 'sp1', name: 'Sukienka Midi w Kwiaty', price: 189, image: '/images/products/product-14.jpg', category: 'Sukienki' },
  { id: 'sp2', name: 'Bluzka Oversize Lniana', price: 129, image: '/images/products/product-17.jpg', category: 'Bluzki' },
  { id: 'sp3', name: 'Spodnie Palazzo Czarne', price: 159, image: '/images/products/product-20.jpg', category: 'Spodnie' },
  { id: 'sp4', name: 'Żakiet Klasyczny Ecru', price: 249, image: '/images/products/product-23.jpg', category: 'Marynarki' },
  { id: 'sp5', name: 'Spódnica Midi Satynowa', price: 119, image: '/images/products/product-26.jpg', category: 'Spódnice' },
];

const ALL_SEARCH_RESULTS: SearchResult[] = [
  { id: 'r1', name: 'Sukienka Maxi Boho Premium', seller: 'LaModeStudio', price: 219, promoted: true, image: '/images/products/product-14.jpg', rating: 4.9, reviews: 234 },
  { id: 'r2', name: 'Sukienka Midi w Kwiaty', seller: 'TwójSklep', price: 189, promoted: true, image: '/images/products/product-17.jpg', rating: 4.7, reviews: 89 },
  { id: 'r3', name: 'Sukienka Letnia Boho', seller: 'BohoChic', price: 149, promoted: false, image: '/images/products/product-20.jpg', rating: 4.5, reviews: 67 },
  { id: 'r4', name: 'Sukienka Koktajlowa Czarna', seller: 'EleganceShop', price: 279, originalPrice: 349, promoted: false, image: '/images/products/product-23.jpg', rating: 4.6, reviews: 156 },
  { id: 'r5', name: 'Sukienka Dzianinowa Mini', seller: 'KnitLove', price: 129, promoted: false, image: '/images/products/product-26.jpg', rating: 4.3, reviews: 43 },
  { id: 'r6', name: 'Sukienka Wiosenna Pastele', seller: 'PastelWorld', price: 169, promoted: false, image: '/images/products/product-15.jpg', rating: 4.4, reviews: 91 },
  { id: 'r7', name: 'Sukienka Lniana Oversized', seller: 'NaturalWear', price: 199, promoted: false, image: '/images/products/product-18.jpg', rating: 4.2, reviews: 28 },
  { id: 'r8', name: 'Sukienka Plisowana Midi', seller: 'PleatHouse', price: 239, promoted: false, image: '/images/products/product-21.jpg', rating: 4.5, reviews: 112 },
];

const DAILY_VIEWS: Record<Budget, number> = { 50: 4200, 100: 8400, 200: 16800 };
const CHART_DAYS = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];
// Relative shape of a typical campaign ramp-up (sums ~100)
const CHART_SHAPE = [62, 79, 88, 95, 103, 110, 107];

// ─── Bar chart ────────────────────────────────────────────────────────────────

function MiniBarChart({ chartData, dailyViews }: { chartData: number[]; dailyViews: number }) {
  const max = Math.max(...chartData);
  const barW = 36;
  const gap = 8;
  const chartH = 72;
  const totalW = chartData.length * (barW + gap) - gap;

  return (
    <div className="overflow-x-auto">
      <svg width={totalW} height={chartH + 20}>
        {chartData.map((v, i) => {
          const barH = Math.max(4, (v / max) * chartH);
          const x = i * (barW + gap);
          const y = chartH - barH;
          const label = Math.round((v / 100) * dailyViews / 100) * 100;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={barH} rx={4} fill="#C2185B" opacity={0.85} />
              <text x={x + barW / 2} y={chartH + 14} textAnchor="middle" fontSize={10} fill="#9ca3af">
                {CHART_DAYS[i]}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="text-xs text-gray-400 mt-1">
        ~{CHART_SHAPE.map(v => Math.round((v / 100) * dailyViews)).reduce((a, b) => a + b, 0).toLocaleString('pl')} wyświetleń łącznie (7 dni)
      </p>
    </div>
  );
}

// ─── Campaign modal ───────────────────────────────────────────────────────────

interface ModalProps {
  product: SellerProduct;
  onClose: () => void;
  onLaunch: (budget: Budget, duration: Duration) => void;
}

function CampaignModal({ product, onClose, onLaunch }: ModalProps) {
  const [budget, setBudget] = useState<Budget>(100);
  const [duration, setDuration] = useState<Duration>(14);

  const dailyViews = DAILY_VIEWS[budget];
  const totalViews = dailyViews * duration;

  const budgets: Budget[] = [50, 100, 200];
  const durations: Duration[] = [7, 14, 30];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
            <div>
              <h2 className="text-base font-semibold text-gray-900">Promuj produkt</h2>
              <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[220px]">{product.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Budget */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2.5">
              Budżet kampanii
            </label>
            <div className="grid grid-cols-3 gap-2">
              {budgets.map(b => (
                <button
                  key={b}
                  onClick={() => setBudget(b)}
                  className={cn(
                    'py-3 rounded-xl border-2 text-sm font-semibold transition-all',
                    budget === b
                      ? 'border-[#C2185B] text-[#C2185B] bg-pink-50'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  )}
                >
                  {b} PLN
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2.5">
              Czas trwania
            </label>
            <div className="grid grid-cols-3 gap-2">
              {durations.map(d => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={cn(
                    'py-3 rounded-xl border-2 text-sm font-semibold transition-all',
                    duration === d
                      ? 'border-[#C2185B] text-[#C2185B] bg-pink-50'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  )}
                >
                  {d} dni
                </button>
              ))}
            </div>
          </div>

          {/* Estimated reach */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Szacowany zasięg</p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-lg font-bold text-gray-900">{(dailyViews / 1000).toFixed(1)}K</p>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">wyświetleń<br/>dziennie</p>
              </div>
              <div className="border-x border-gray-200">
                <p className="text-lg font-bold text-gray-900">{Math.round(totalViews / 1000)}K</p>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">łączny<br/>zasięg</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[#C2185B]">{budget} PLN</p>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">całkowity<br/>koszt</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={() => onLaunch(budget, duration)}
            className="w-full py-3.5 rounded-xl text-white text-sm font-semibold bg-[#C2185B] hover:bg-[#a8154f] transition-colors active:scale-[0.99]"
          >
            Uruchom kampanię →
          </button>
          <p className="text-[11px] text-gray-400 text-center mt-2">
            Możesz zatrzymać kampanię w dowolnym momencie
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Product card (buyer view) ────────────────────────────────────────────────

function SearchCard({ result }: { result: SearchResult }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden group cursor-pointer hover:shadow-md transition-shadow">
      <div className="relative">
        <img
          src={result.image}
          alt={result.name}
          className="w-full aspect-[3/4] object-cover bg-gray-100 group-hover:scale-[1.02] transition-transform duration-300"
        />
        {result.promoted && (
          <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-medium rounded-full bg-white/90 text-gray-500 border border-gray-200 backdrop-blur-sm">
            Promowane
          </span>
        )}
        {result.originalPrice && (
          <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-[#C2185B] text-white">
            SALE
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="text-[11px] text-gray-400 mb-0.5">{result.seller}</p>
        <p className="text-sm font-medium text-gray-900 leading-tight line-clamp-2">{result.name}</p>
        <div className="flex items-center gap-1 mt-1.5">
          <Star size={10} className="fill-amber-400 text-amber-400" />
          <span className="text-[11px] text-gray-500">{result.rating} ({result.reviews})</span>
        </div>
        <div className="flex items-baseline gap-1.5 mt-1.5">
          <span className="text-sm font-bold text-gray-900">{result.price} PLN</span>
          {result.originalPrice && (
            <span className="text-xs text-gray-400 line-through">{result.originalPrice} PLN</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function PromotedListingsPrototype() {
  const [tab, setTab] = useState<Tab>('seller');
  const [campaigns, setCampaigns] = useState<Record<string, Campaign>>({});
  const [promotingId, setPromotingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('sukienka');

  const promotingProduct = SELLER_PRODUCTS.find(p => p.id === promotingId);

  function handleLaunch(budget: Budget, duration: Duration) {
    if (!promotingId) return;
    setCampaigns(prev => ({
      ...prev,
      [promotingId]: {
        budget,
        duration,
        dailyViews: DAILY_VIEWS[budget],
        chartData: CHART_SHAPE,
      },
    }));
    setPromotingId(null);
  }

  const activeCampaigns = Object.keys(campaigns).length;
  const totalDailyViews = Object.values(campaigns).reduce((s, c) => s + c.dailyViews, 0);
  const totalBudget = Object.values(campaigns).reduce((s, c) => s + c.budget, 0);

  // Promoted items always first in results
  const sortedResults = [...ALL_SEARCH_RESULTS].sort((a, b) => {
    if (a.promoted === b.promoted) return 0;
    return a.promoted ? -1 : 1;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 tracking-tight text-lg">
              Fashion<span className="text-[#C2185B]">Hero</span>
            </span>
            <span className="text-xs text-gray-400 font-normal">Prototyp: Promowane Oferty</span>
          </div>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {(['seller', 'buyer'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap',
                  tab === t ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                )}
              >
                {t === 'seller' ? 'Panel Sprzedawcy' : 'Wyniki Wyszukiwania'}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Seller Panel ── */}
      {tab === 'seller' && (
        <main className="max-w-3xl mx-auto px-6 py-10">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Twoje produkty</h1>
            <p className="text-gray-500 mt-1 text-sm">
              Promuj produkty, żeby zwiększyć widoczność wśród 2,4 mln kupujących.
            </p>
          </div>

          {/* Summary stats (visible once any campaign is active) */}
          {activeCampaigns > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Aktywne kampanie', value: activeCampaigns, icon: Zap },
                { label: 'Wyświetlenia dziś', value: totalDailyViews.toLocaleString('pl'), icon: Eye },
                { label: 'Łączny budżet', value: `${totalBudget} PLN`, icon: TrendingUp },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Icon size={13} className="text-gray-400" />
                    <span className="text-xs text-gray-400">{label}</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Product list */}
          <div className="space-y-3">
            {SELLER_PRODUCTS.map(product => {
              const campaign = campaigns[product.id];
              return (
                <div key={product.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  {/* Product row */}
                  <div className="flex items-center gap-4 p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-14 h-14 rounded-xl object-cover bg-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-sm text-gray-400 mt-0.5">{product.category} · {product.price} PLN</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {campaign && (
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-pink-50 text-[#C2185B]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C2185B] animate-pulse" />
                          Aktywna
                        </span>
                      )}
                      <button
                        onClick={() => !campaign && setPromotingId(product.id)}
                        disabled={!!campaign}
                        className={cn(
                          'px-4 py-2 rounded-xl text-sm font-semibold transition-all',
                          campaign
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-[#C2185B] text-white hover:bg-[#a8154f] active:scale-95'
                        )}
                      >
                        {campaign ? 'Promowane' : 'Promuj'}
                      </button>
                    </div>
                  </div>

                  {/* Campaign stats (shown when active) */}
                  {campaign && (
                    <div className="border-t border-gray-50 px-4 py-4 bg-gray-50/60">
                      <div className="flex items-start gap-8">
                        <div className="space-y-0.5">
                          <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">Budżet</p>
                          <p className="text-sm font-semibold text-gray-800">{campaign.budget} PLN</p>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">Czas trwania</p>
                          <p className="text-sm font-semibold text-gray-800">{campaign.duration} dni</p>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">Wyśw./dzień</p>
                          <p className="text-sm font-semibold text-gray-800">{campaign.dailyViews.toLocaleString('pl')}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold mb-3">
                          Wyświetlenia — ostatnie 7 dni
                        </p>
                        <MiniBarChart chartData={campaign.chartData} dailyViews={campaign.dailyViews} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* ── Buyer: Search Results ── */}
      {tab === 'buyer' && (
        <main className="max-w-5xl mx-auto px-6 py-10">
          {/* Search bar */}
          <div className="relative max-w-lg mb-8">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C2185B]/20 focus:border-[#C2185B] transition-all"
              placeholder="Szukaj produktów..."
            />
          </div>

          <div className="flex items-baseline gap-2 mb-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Wyniki dla „{searchQuery}"
            </h2>
            <span className="text-sm text-gray-400">{sortedResults.length} produktów</span>
          </div>

          {/* Explainer callout (educational — shows what's promoted and why) */}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl p-3.5 mb-6 text-sm text-amber-800">
            <span className="text-amber-500 text-base leading-none mt-0.5">ℹ</span>
            <p>
              <strong>Widok kupującej:</strong> pierwsze 2 wyniki to promowane oferty (etykieta „Promowane"). Reszta to wyniki organiczne. Etykieta jest subtelna — czy nie odstrasza?
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {sortedResults.map(result => (
              <SearchCard key={result.id} result={result} />
            ))}
          </div>

          {/* Legend */}
          <div className="mt-10 flex items-center gap-6 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full border border-gray-200 bg-white text-gray-500">Promowane</span>
              <span>= płatna widoczność sprzedawcy</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-gray-200" />
              <span>= wynik organiczny</span>
            </div>
          </div>
        </main>
      )}

      {/* Campaign modal */}
      {promotingId && promotingProduct && (
        <CampaignModal
          product={promotingProduct}
          onClose={() => setPromotingId(null)}
          onLaunch={handleLaunch}
        />
      )}
    </div>
  );
}
