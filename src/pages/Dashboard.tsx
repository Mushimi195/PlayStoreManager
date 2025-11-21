import { useState, useMemo } from 'react';
import { useApp } from '../lib/context';
import { Search, ArrowUpDown, Gamepad2, AppWindow, Zap, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import type { Category } from '../lib/types';
import clsx from 'clsx';

export function Dashboard() {
    const { purchases } = useApp();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<Category | 'All'>('All');
    const [sort, setSort] = useState<'date' | 'price'>('date');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

    const filteredPurchases = useMemo(() => {
        return purchases
            .filter(p =>
                (filter === 'All' || p.category === filter) &&
                p.name.toLowerCase().includes(search.toLowerCase())
            )
            .sort((a, b) => {
                const valA = sort === 'date' ? new Date(a.date).getTime() : a.price;
                const valB = sort === 'date' ? new Date(b.date).getTime() : b.price;
                return sortDir === 'asc' ? valA - valB : valB - valA;
            });
    }, [purchases, search, filter, sort, sortDir]);

    const totalSpent = useMemo(() => {
        return filteredPurchases.reduce((acc, curr) => acc + curr.price, 0);
    }, [filteredPurchases]);

    const toggleSort = (key: 'date' | 'price') => {
        if (sort === key) {
            setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSort(key);
            setSortDir('desc');
        }
    };

    const CategoryIcon = ({ category }: { category: Category }) => {
        switch (category) {
            case 'Game': return <Gamepad2 size={16} className="text-purple-500" />;
            case 'App': return <AppWindow size={16} className="text-blue-500" />;
            case 'IAP': return <Zap size={16} className="text-yellow-500" />;
            case 'Subscription': return <Calendar size={16} className="text-green-500" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                <p className="text-blue-100 text-sm font-medium mb-1">合計支出</p>
                <h2 className="text-3xl font-bold">
                    ¥{totalSpent.toLocaleString()}
                </h2>
                <p className="text-blue-100 text-xs mt-2 opacity-80">
                    {filteredPurchases.length} 件の購入
                </p>
            </div>

            {/* Controls */}
            <div className="space-y-3 sticky top-14 bg-gray-50 dark:bg-gray-900 py-2 z-10">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="購入履歴を検索..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white dark:bg-gray-800 border-none rounded-xl py-3 pl-10 pr-4 shadow-sm focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {['All', 'Game', 'App', 'IAP', 'Subscription'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat as any)}
                            className={clsx(
                                "px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                                filter === cat
                                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                            )}
                        >
                            {cat === 'All' ? 'すべて' : cat === 'Game' ? 'ゲーム' : cat === 'App' ? 'アプリ' : cat === 'IAP' ? '課金' : '定期購入'}
                        </button>
                    ))}
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => toggleSort('date')}
                        className="flex items-center gap-1 text-xs text-gray-500 font-medium px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        日付 {sort === 'date' && <ArrowUpDown size={12} />}
                    </button>
                    <button
                        onClick={() => toggleSort('price')}
                        className="flex items-center gap-1 text-xs text-gray-500 font-medium px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        価格 {sort === 'price' && <ArrowUpDown size={12} />}
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="space-y-3">
                <AnimatePresence mode='popLayout'>
                    {filteredPurchases.map((purchase) => (
                        <motion.div
                            key={purchase.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm flex items-center gap-4"
                        >
                            <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                                {purchase.icon ? (
                                    <img src={purchase.icon} alt={purchase.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <Gamepad2 size={20} />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 dark:text-white truncate text-sm">
                                    {purchase.name}
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                    <CategoryIcon category={purchase.category} />
                                    <span>{format(new Date(purchase.date), 'yyyy/MM/dd')}</span>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="font-bold text-gray-900 dark:text-white text-sm">
                                    ¥{purchase.price.toLocaleString()}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredPurchases.length === 0 && (
                    <div className="text-center py-10 text-gray-400">
                        <p>購入履歴がありません。</p>
                    </div>
                )}
            </div>
        </div>
    );
}
