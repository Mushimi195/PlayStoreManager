import { useRef } from 'react';
import { useApp } from '../lib/context';
import { Download, Upload, Trash2, ChevronRight } from 'lucide-react';
import type { Purchase } from '../lib/types';

export function Settings() {
    const { purchases, importPurchases, resetData } = useApp();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        const headers = ['id', 'name', 'price', 'currency', 'date', 'category', 'store', 'icon'];
        const csvContent = [
            headers.join(','),
            ...purchases.map(p => headers.map(h => {
                const val = p[h as keyof Purchase];
                // Handle strings that might contain commas
                return typeof val === 'string' ? `"${val}"` : val;
            }).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `playstore_purchases_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const text = event.target?.result as string;
                const lines = text.split('\n');
                const headers = lines[0].split(',').map(h => h.trim());

                const newPurchases: Purchase[] = lines.slice(1)
                    .filter(line => line.trim())
                    .map(line => {
                        // Simple CSV parser that handles quotes
                        const values: string[] = [];
                        let inQuotes = false;
                        let currentValue = '';

                        for (let i = 0; i < line.length; i++) {
                            const char = line[i];
                            if (char === '"') {
                                inQuotes = !inQuotes;
                            } else if (char === ',' && !inQuotes) {
                                values.push(currentValue);
                                currentValue = '';
                            } else {
                                currentValue += char;
                            }
                        }
                        values.push(currentValue);

                        const purchase: any = {};
                        headers.forEach((header, index) => {
                            let value = values[index]?.trim();
                            if (value?.startsWith('"') && value?.endsWith('"')) {
                                value = value.slice(1, -1);
                            }
                            if (header === 'price') {
                                purchase[header] = Number(value);
                            } else {
                                purchase[header] = value;
                            }
                        });
                        return purchase as Purchase;
                    });

                importPurchases(newPurchases);
                alert('インポートが完了しました');
            } catch (error) {
                console.error('Import error:', error);
                alert('CSVの読み込みに失敗しました');
            }
            // Reset input
            if (fileInputRef.current) fileInputRef.current.value = '';
        };
        reader.readAsText(file);
    };

    const handleReset = () => {
        if (window.confirm('本当にすべてのデータを削除しますか？この操作は取り消せません。')) {
            resetData();
        }
    };

    return (
        <div className="space-y-8 pb-24">
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white pt-4 tracking-tight">設定</h1>

            <div className="space-y-6">
                {/* Data Management Section */}
                <section className="space-y-4">
                    <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">データ管理</h2>
                    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-white/20 shadow-sm overflow-hidden">
                        <button
                            onClick={handleExport}
                            className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left border-b border-gray-100 dark:border-gray-700/50"
                        >
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <Download size={20} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 dark:text-white">CSVエクスポート</h3>
                                <p className="text-xs text-gray-500 mt-0.5">購入履歴をファイルに保存</p>
                            </div>
                            <ChevronRight size={20} className="text-gray-400" />
                        </button>

                        <div className="relative w-full">
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleImport}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="flex items-center gap-4 p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left border-b border-gray-100 dark:border-gray-700/50">
                                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                                    <Upload size={20} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 dark:text-white">CSVインポート</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">バックアップから復元</p>
                                </div>
                                <ChevronRight size={20} className="text-gray-400" />
                            </div>
                        </div>

                        <button
                            onClick={handleReset}
                            className="w-full flex items-center gap-4 p-5 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left"
                        >
                            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                                <Trash2 size={20} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-red-600 dark:text-red-400">データをリセット</h3>
                                <p className="text-xs text-red-400/70 mt-0.5">すべての購入履歴を削除</p>
                            </div>
                            <ChevronRight size={20} className="text-red-300" />
                        </button>
                    </div>
                </section>

                {/* About Section */}
                <section className="space-y-4">
                    <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">アプリについて</h2>
                    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl border border-white/20 shadow-sm p-6 text-center space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-tr from-primary to-violet-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary/20 mx-auto">
                            P
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Play Store Manager</h3>
                            <p className="text-sm text-gray-500">Version 1.0.0</p>
                        </div>
                        <p className="text-xs text-gray-400">
                            © 2024 Play Store Manager
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
