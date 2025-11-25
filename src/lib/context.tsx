import { createContext, useContext, useState, useEffect } from 'react';
import type { Purchase, UserProfile } from './types';
import { MOCK_PURCHASES } from './mockData';

interface AppContextType {
    user: UserProfile | null;
    login: (isDemo?: boolean) => void;
    logout: () => void;
    purchases: Purchase[];
    addPurchase: (purchase: Purchase) => void;
    removePurchase: (id: string) => void;
    importPurchases: (data: Purchase[]) => void;
    resetData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [purchases, setPurchases] = useState<Purchase[]>([]);

    useEffect(() => {
        // Load from local storage
        const storedUser = localStorage.getItem('user');
        const storedPurchases = localStorage.getItem('purchases');

        if (storedUser) setUser(JSON.parse(storedUser));
        if (storedPurchases) {
            setPurchases(JSON.parse(storedPurchases));
        } else {
            // Initialize with mock data if empty (for demo)
            // setPurchases(MOCK_PURCHASES); 
        }
    }, []);

    const login = (isDemo = false) => {
        const newUser: UserProfile = {
            uid: isDemo ? 'demo-user' : 'real-user-id',
            displayName: isDemo ? 'Demo User' : 'User',
            email: isDemo ? 'demo@example.com' : 'user@example.com',
            photoURL: null,
            isDemo,
        };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));

        if (isDemo && purchases.length === 0) {
            setPurchases(MOCK_PURCHASES);
            localStorage.setItem('purchases', JSON.stringify(MOCK_PURCHASES));
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const addPurchase = (purchase: Purchase) => {
        const newPurchases = [purchase, ...purchases];
        setPurchases(newPurchases);
        localStorage.setItem('purchases', JSON.stringify(newPurchases));
    };

    const removePurchase = (id: string) => {
        const newPurchases = purchases.filter(p => p.id !== id);
        setPurchases(newPurchases);
        localStorage.setItem('purchases', JSON.stringify(newPurchases));
    };

    const importPurchases = (newPurchases: Purchase[]) => {
        setPurchases(newPurchases);
        localStorage.setItem('purchases', JSON.stringify(newPurchases));
    };

    const resetData = () => {
        setPurchases([]);
        localStorage.removeItem('purchases');
    };

    return (
        <AppContext.Provider value={{ user, login, logout, purchases, addPurchase, removePurchase, importPurchases, resetData }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
