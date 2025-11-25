import { useRef } from 'react';
import { useApp } from '../lib/context';
import { Download, Upload, Trash2, AlertCircle } from 'lucide-react';
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
        <div className="space-y-6">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">設定</h1>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm space-y-4">
                <h2 className="font-semibold text-gray-900 dark:text-white">データ管理</h2>

                <div className="grid gap-3">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-3 w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                            <Download size={20} />
                        </div>
                        <div>
                            <div className="font-medium text-gray-900 dark:text-white">CSVエクスポート</div>
                            <div className="text-xs text-gray-500">現在のデータをCSV形式でダウンロード</div>
                        </div>
                    </button>

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-3 w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                            <Upload size={20} />
                        </div>
                        <div>
                            <div className="font-medium text-gray-900 dark:text-white">CSVインポート</div>
                            <div className="text-xs text-gray-500">CSVファイルからデータを読み込む</div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".csv"
                            onChange={handleImport}
                        />
                    </button>

                    <button
                        onClick={handleReset}
                        className="flex items-center gap-3 w-full p-3 rounded-lg border border-red-100 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left group"
                    >
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                            <Trash2 size={20} />
                        </div>
                        <div>
                            <div className="font-medium text-red-600 dark:text-red-400">データをリセット</div>
                            <div className="text-xs text-red-400 dark:text-red-500/70">すべての購入履歴を削除</div>
                        </div>
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <h2 className="font-semibold mb-2 text-gray-900 dark:text-white">アプリについて</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <AlertCircle size={16} />
                    <p>Play Store Purchase Manager v1.0.0</p>
                </div>
            </div>
        </div>
    );
}
