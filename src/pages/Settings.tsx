
export function Settings() {
    return (
        <div className="space-y-6">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">設定</h1>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <h2 className="font-semibold mb-2">データ管理</h2>
                <p className="text-sm text-gray-500 mb-4">インポート/エクスポート機能は近日公開予定です。</p>
                <button disabled className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-400 rounded-lg text-sm font-medium">
                    CSVエクスポート
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <h2 className="font-semibold mb-2">アプリについて</h2>
                <p className="text-sm text-gray-500">Play Store Purchase Manager v1.0.0</p>
            </div>
        </div>
    );
}
