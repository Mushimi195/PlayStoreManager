import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutGrid, PlusCircle, Settings, LogOut } from 'lucide-react';
import { useApp } from '../lib/context';
import clsx from 'clsx';

export function Layout() {
    const { user, logout } = useApp();
    const location = useLocation();

    if (!user) return <Outlet />;

    const navItems = [
        { icon: LayoutGrid, label: 'ホーム', path: '/' },
        { icon: PlusCircle, label: '追加', path: '/add' },
        { icon: Settings, label: '設定', path: '/settings' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
                <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
                    <h1 className="font-bold text-lg text-gray-800 dark:text-white">Play Manager</h1>
                    <button onClick={logout} className="p-2 text-gray-500 hover:text-red-500">
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <main className="flex-1 max-w-md mx-auto w-full p-4 pb-20">
                <Outlet />
            </main>

            <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pb-safe">
                <div className="max-w-md mx-auto flex justify-around items-center h-16">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={clsx(
                                    "flex flex-col items-center justify-center w-full h-full space-y-1",
                                    isActive ? "text-primary" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                )}
                            >
                                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
