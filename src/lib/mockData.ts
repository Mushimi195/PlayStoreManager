import type { Purchase } from './types';

export const MOCK_PURCHASES: Purchase[] = [
    {
        id: '1',
        name: 'Minecraft',
        icon: 'https://play-lh.googleusercontent.com/VSwHQjcAttxsLE47RuS4PqpC4LT7lCoSjE7Hx5AW_yCxtDvcnsHHvm5CTuL5BPN-uRTP=w240-h480-rw',
        price: 860,
        currency: 'JPY',
        date: '2023-10-15T10:30:00Z',
        category: 'Game',
        store: 'Google Play',
    },
    {
        id: '2',
        name: 'Google One (100GB)',
        icon: 'https://play-lh.googleusercontent.com/2M2Nn7r8Z6yK8q_4y5M5_5q6_6w_6q_6w_6q_6w_6q_6w_6q_6w', // Placeholder
        price: 250,
        currency: 'JPY',
        date: '2023-11-01T09:00:00Z',
        category: 'Subscription',
        store: 'Google Play',
    },
    {
        id: '3',
        name: 'Monster Strike - Orb Pack',
        icon: 'https://play-lh.googleusercontent.com/KoP_554b76_6_6_6_6_6_6_6_6_6_6_6_6_6_6_6_6_6_6_6', // Placeholder
        price: 4800,
        currency: 'JPY',
        date: '2023-11-05T20:15:00Z',
        category: 'IAP',
        store: 'Google Play',
    },
    {
        id: '4',
        name: 'Nova Launcher Prime',
        icon: 'https://play-lh.googleusercontent.com/12345', // Placeholder
        price: 499,
        currency: 'JPY',
        date: '2022-05-20T14:00:00Z',
        category: 'App',
        store: 'Google Play',
    },
];
