export type Category = 'App' | 'Game' | 'IAP' | 'Subscription';

export interface Purchase {
    id: string;
    name: string;
    icon?: string;
    price: number;
    currency: string;
    date: string; // ISO string
    category: Category;
    store: 'Google Play';
}

export interface UserProfile {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
    isDemo: boolean;
}
