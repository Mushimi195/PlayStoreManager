import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../lib/context';
import { ArrowLeft, Save } from 'lucide-react';
import type { Category } from '../lib/types';

export function AddPurchase() {
    const navigate = useNavigate();
    const { addPurchase } = useApp();

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [category, setCategory] = useState<Category>('App');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !price) return;

        addPurchase({
            id: crypto.randomUUID(),
            name,
            price: Number(price),
            currency: 'JPY',
            date: new Date(date).toISOString(),
            category,
            store: 'Google Play',
        });

        navigate('/');
    };

    return (
        <div className="space-y-8 pb-24">
            <div className="flex items-center gap-4 pt-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-3 -ml-3 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">購入を追加</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-white/20 space-y-6">
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">アプリ名</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                            placeholder="例: Minecraft"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">価格 (¥)</label>
                            <input
                                type="number"
                                required
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                placeholder="0"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">日付</label>
                            <input
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">カテゴリー</label>
                    <div className="grid grid-cols-2 gap-3">
                        {(['App', 'Game', 'IAP', 'Subscription'] as Category[]).map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setCategory(cat)}
                                className={`p-4 rounded-2xl text-sm font-bold border-2 transition-all flex flex-col items-center gap-2 ${category === cat
                                    ? 'bg-primary/5 border-primary text-primary shadow-lg shadow-primary/10'
                                    : 'bg-white dark:bg-gray-800 border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <span className="text-2xl">
                                    {cat === 'App' ? '📱' : cat === 'Game' ? '🎮' : cat === 'IAP' ? '💎' : '📅'}
                                </span>
                                {cat === 'App' ? 'アプリ' : cat === 'Game' ? 'ゲーム' : cat === 'IAP' ? '課金' : '定期購入'}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                >
                    <Save size={20} />
                    保存する
                </button>
            </form>
        </div>
    );
}
