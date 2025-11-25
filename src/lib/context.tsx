import { createContext, useContext, useState, useEffect } from 'react';
import type { Purchase, UserProfile } from './types';
import { MOCK_PURCHASES } from './mockData';
import { auth, googleProvider, db } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot, deleteDoc, doc, setDoc } from 'firebase/firestore';

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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser.uid,
                    displayName: firebaseUser.displayName || 'User',
                    email: firebaseUser.email || '',
                    photoURL: firebaseUser.photoURL,
                    isDemo: false,
                });
            } else {
                // Check for demo user in local storage if not logged in via Firebase
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    if (parsedUser.isDemo) {
                        setUser(parsedUser);
                    } else {
                        setUser(null);
                    }
                } else {
                    setUser(null);
                }
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user) {
            setPurchases([]);
            return;
        }

        if (user.isDemo) {
            const storedPurchases = localStorage.getItem('purchases');
            if (storedPurchases) {
                setPurchases(JSON.parse(storedPurchases));
            } else {
                setPurchases(MOCK_PURCHASES);
            }
            return;
        }

        // Firestore Sync for real users
        const q = query(collection(db, 'purchases'), where('userId', '==', user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newPurchases = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Purchase[];
            setPurchases(newPurchases);
        });

        return () => unsubscribe();
    }, [user]);

    const login = async (isDemo = false) => {
        if (isDemo) {
            const newUser: UserProfile = {
                uid: 'demo-user',
                displayName: 'Demo User',
                email: 'demo@example.com',
                photoURL: null,
                isDemo: true,
            };
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
            localStorage.setItem('purchases', JSON.stringify(MOCK_PURCHASES));
            setPurchases(MOCK_PURCHASES);
        } else {
            try {
                await signInWithPopup(auth, googleProvider);
            } catch (error) {
                console.error("Login failed", error);
                alert("ログインに失敗しました");
            }
        }
    };

    const logout = async () => {
        if (user?.isDemo) {
            localStorage.removeItem('user');
            localStorage.removeItem('purchases');
            setUser(null);
            setPurchases([]);
        } else {
            await signOut(auth);
        }
    };

    const addPurchase = async (purchase: Purchase) => {
        if (user?.isDemo) {
            const newPurchases = [purchase, ...purchases];
            setPurchases(newPurchases);
            localStorage.setItem('purchases', JSON.stringify(newPurchases));
        } else if (user) {
            // Add to Firestore
            // We use the purchase ID as the doc ID if possible, or let Firestore generate one
            // But here we want to ensure userId is attached
            const { id, ...data } = purchase;
            await setDoc(doc(db, 'purchases', id), {
                ...data,
                userId: user.uid,
                date: purchase.date // Ensure date format matches
            });
        }
    };

    const removePurchase = async (id: string) => {
        if (user?.isDemo) {
            const newPurchases = purchases.filter(p => p.id !== id);
            setPurchases(newPurchases);
            localStorage.setItem('purchases', JSON.stringify(newPurchases));
        } else if (user) {
            await deleteDoc(doc(db, 'purchases', id));
        }
    };

    const importPurchases = async (newPurchases: Purchase[]) => {
        if (user?.isDemo) {
            setPurchases(newPurchases);
            localStorage.setItem('purchases', JSON.stringify(newPurchases));
        } else if (user) {
            // Batch write or sequential add
            // For simplicity, we'll loop. For large datasets, batch is better.
            for (const p of newPurchases) {
                const { id, ...data } = p;
                await setDoc(doc(db, 'purchases', id || crypto.randomUUID()), {
                    ...data,
                    userId: user.uid
                });
            }
        }
    };

    const resetData = async () => {
        if (user?.isDemo) {
            setPurchases([]);
            localStorage.removeItem('purchases');
        } else if (user) {
            // Delete all docs for user
            // Caution: Client-side bulk delete is expensive. 
            // Ideally call a Cloud Function, but here we loop.
            // We need to fetch first to delete
            // Since we already have 'purchases' state synced, we can use that
            for (const p of purchases) {
                await deleteDoc(doc(db, 'purchases', p.id));
            }
        }
    };

    return (
        <AppContext.Provider value={{ user, login, logout, purchases, addPurchase, removePurchase, importPurchases, resetData }}>
            {!loading && children}
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
