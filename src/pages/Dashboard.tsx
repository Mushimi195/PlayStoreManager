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
        <div className="space-y-6 pb-24">
            {/* Header Stats */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-violet-600 p-8 text-white shadow-2xl shadow-primary/30">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-black/10 rounded-full blur-xl"></div>

                <div className="relative z-10">
                    <p className="text-blue-100 text-sm font-medium mb-2 flex items-center gap-2">
                        <Zap size={14} className="text-yellow-300" />
                        合計支出
                    </p>
                    <h2 className="text-4xl font-extrabold tracking-tight">
                        ¥{totalSpent.toLocaleString()}
                    </h2>
                    <div className="mt-4 flex items-center gap-2 text-xs font-medium text-white/80 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
                        <Calendar size={12} />
                        <span>{filteredPurchases.length} 件の購入</span>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="sticky top-14 z-10 space-y-4 pt-2 -mx-4 px-4 bg-gradient-to-b from-[hsl(var(--background))] via-[hsl(var(--background))] to-transparent pb-4">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="購入履歴を検索..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none text-base transition-all"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {['All', 'Game', 'App', 'IAP', 'Subscription'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat as any)}
                            className={clsx(
                                "px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all shadow-sm",
                                filter === cat
                                    ? "bg-primary text-white shadow-primary/30 scale-105"
                                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                            )}
                        >
                            {cat === 'All' ? 'すべて' : cat === 'Game' ? 'ゲーム' : cat === 'App' ? 'アプリ' : cat === 'IAP' ? '課金' : '定期購入'}
                        </button>
                    ))}
                </div>

                <div className="flex justify-end gap-2 px-1">
                    <button
                        onClick={() => toggleSort('date')}
                        className={clsx(
                            "flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors",
                            sort === 'date' ? "text-primary bg-primary/10" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                        )}
                    >
                        日付 {sort === 'date' && <ArrowUpDown size={12} />}
                    </button>
                    <button
                        onClick={() => toggleSort('price')}
                        className={clsx(
                            "flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors",
                            sort === 'price' ? "text-primary bg-primary/10" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                        )}
                    >
                        価格 {sort === 'price' && <ArrowUpDown size={12} />}
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                <AnimatePresence mode='popLayout'>
                    {filteredPurchases.map((purchase) => (
                        <motion.div
                            key={purchase.id}
                            layout
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-4 rounded-2xl border border-white/20 shadow-sm hover:shadow-md transition-all flex items-center gap-4"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-700/50 overflow-hidden flex-shrink-0 shadow-inner flex items-center justify-center">
                                {purchase.icon ? (
                                    <img src={purchase.icon} alt={purchase.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-gray-300 dark:text-gray-600">
                                        <CategoryIcon category={purchase.category} />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 dark:text-white truncate text-base mb-1">
                                    {purchase.name}
                                </h3>
                                <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                                    <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700/50 px-2 py-0.5 rounded-md">
                                        <CategoryIcon category={purchase.category} />
                                        {purchase.category}
                                    </span>
                                    <span>{format(new Date(purchase.date), 'yyyy/MM/dd')}</span>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="font-extrabold text-gray-900 dark:text-white text-lg tracking-tight">
                                    ¥{purchase.price.toLocaleString()}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredPurchases.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300 dark:text-gray-600">
                            <Search size={32} />
                        </div>
                        <p className="text-gray-400 font-medium">購入履歴が見つかりません</p>
                    </div>
                )}
            </div>
        </div>
    );
}
