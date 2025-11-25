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
        <div className="min-h-screen flex flex-col font-sans text-gray-900 dark:text-gray-100">
            <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200/50 dark:border-gray-800/50">
                <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-tr from-primary to-violet-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20">
                            P
                        </div>
                        <h1 className="font-extrabold text-lg tracking-tight">Play Manager</h1>
                    </div>
                    <button onClick={logout} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all">
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <main className="flex-1 max-w-md mx-auto w-full p-6">
                <Outlet />
            </main>

            <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/20 dark:border-gray-700 shadow-2xl shadow-gray-200/50 dark:shadow-black/50 rounded-full p-2 z-30">
                <div className="flex justify-around items-center">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={clsx(
                                    "flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300",
                                    isActive
                                        ? "bg-primary text-white shadow-lg shadow-primary/40 scale-110"
                                        : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                                )}
                            >
                                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
