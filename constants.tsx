
import { Category, Product, SystemConfig } from './types';

export const INITIAL_SYSTEM_CONFIG: SystemConfig = {
  siteName: 'SUNLITE.GG',
  cardDetails: '8600 1234 5678 9012 (HUMO)',
  telegramSupport: 'https://t.me/sunlite_support',
  serverIp: 'mc.sunlite.uz',
  maintenanceMode: false,
  stats: {
    online: 124,
    maxPlayers: 500,
    cpu: 32,
    ram: 45,
    ping: 24
  }
};

const createTariffs = (oneMonth: number, threeMonths: number) => [
  { id: Math.random().toString(36).substr(2, 5), name: '1 oy', price: oneMonth, duration: '30 kun' },
  { id: Math.random().toString(36).substr(2, 5), name: '3 oy', price: threeMonths, duration: '90 kun' }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p-custom',
    name: 'Custom Donat',
    description: 'O‘zingiz xohlagan prefix asosida maxsus donat. Tayyor bo‘lish: 1–2 kun.',
    category: Category.RANKS,
    image: 'https://picsum.photos/seed/custom/400/300',
    active: true,
    tariffs: [{ id: 't-custom', name: 'Maxsus', price: 130000, duration: 'Lifetime' }]
  },
  {
    id: 'p-eclipse',
    name: 'ECLIPSE',
    description: 'Boshlang‘ich donat darajasi.',
    category: Category.RANKS,
    image: 'https://picsum.photos/seed/eclipse/400/300',
    active: true,
    tariffs: createTariffs(7000, 20000)
  },
  {
    id: 'p-phoenix',
    name: 'PHOENIX',
    description: 'Himoya va kuch darajasi.',
    category: Category.RANKS,
    image: 'https://picsum.photos/seed/phoenix/400/300',
    active: true,
    tariffs: createTariffs(12000, 30000)
  },
  {
    id: 'p-oracle',
    name: 'ORACLE',
    description: 'Bilim va qobiliyat darajasi.',
    category: Category.RANKS,
    image: 'https://picsum.photos/seed/oracle/400/300',
    active: true,
    tariffs: createTariffs(18000, 40000)
  },
  {
    id: 'p-voyager',
    name: 'VOYAGER',
    description: 'Sayohat va kashfiyot darajasi.',
    category: Category.RANKS,
    image: 'https://picsum.photos/seed/voyager/400/300',
    active: true,
    tariffs: createTariffs(24000, 55000)
  },
  {
    id: 'p-catalyst',
    name: 'CATALYST',
    description: 'Tezlik va energiya darajasi.',
    category: Category.RANKS,
    image: 'https://picsum.photos/seed/catalyst/400/300',
    active: true,
    tariffs: createTariffs(34000, 69000)
  },
  {
    id: 'p-celestial',
    name: 'CELESTIAL',
    description: 'Samoviy kuch darajasi.',
    category: Category.RANKS,
    image: 'https://picsum.photos/seed/celestial/400/300',
    active: true,
    tariffs: createTariffs(49000, 75000)
  },
  {
    id: 'p-aurora',
    name: 'AURORA',
    description: 'Yorqinlik va sehr darajasi.',
    category: Category.RANKS,
    image: 'https://picsum.photos/seed/aurora/400/300',
    active: true,
    tariffs: createTariffs(60000, 88000)
  },
  {
    id: 'p-immortal',
    name: 'IMMORTAL',
    description: 'O‘limsizlik va qudrat darajasi.',
    category: Category.RANKS,
    image: 'https://picsum.photos/seed/immortal/400/300',
    active: true,
    tariffs: createTariffs(85000, 105000)
  },
  {
    id: 'p-apex',
    name: 'APEX',
    description: 'Cho‘qqi va g‘alaba darajasi.',
    category: Category.RANKS,
    image: 'https://picsum.photos/seed/apex/400/300',
    active: true,
    tariffs: createTariffs(99000, 125000)
  },
  {
    id: 'p-luminary',
    name: 'LUMINARY',
    description: 'Nur va yetakchilik darajasi.',
    category: Category.RANKS,
    image: 'https://picsum.photos/seed/luminary/400/300',
    active: true,
    tariffs: createTariffs(130000, 160000)
  },
  {
    id: 'p-great',
    name: 'GREAT',
    description: 'Eng yuqori va buyuk donat darajasi.',
    category: Category.RANKS,
    image: 'https://picsum.photos/seed/great/400/300',
    active: true,
    tariffs: createTariffs(169000, 222000)
  },
  {
    id: 'p-vales-100',
    name: '100 Vales',
    description: 'O‘yin ichidagi donat valyutasi.',
    category: Category.COINS,
    image: 'https://picsum.photos/seed/v100/400/300',
    active: true,
    tariffs: [{ id: 'v1', name: 'Paket', price: 10000, duration: 'Instant' }]
  },
  {
    id: 'p-vales-1000',
    name: '1000 Vales',
    description: 'O‘yin ichidagi donat valyutasi.',
    category: Category.COINS,
    image: 'https://picsum.photos/seed/v1000/400/300',
    active: true,
    tariffs: [{ id: 'v2', name: 'Paket', price: 100000, duration: 'Instant' }]
  },
  {
    id: 'p-case-donat',
    name: 'Donate Case',
    description: 'Donat darajalarini yutib olish imkoniyati.',
    category: Category.KEYS,
    image: 'https://picsum.photos/seed/cd/400/300',
    active: true,
    tariffs: [{ id: 'c1', name: '1 dona', price: 10000, duration: 'Instant' }]
  },
  {
    id: 'p-case-token',
    name: 'Token Case',
    description: 'Tokenlar yutib olish imkoniyati.',
    category: Category.KEYS,
    image: 'https://picsum.photos/seed/ct/400/300',
    active: true,
    tariffs: [{ id: 'c2', name: '1 dona', price: 30000, duration: 'Instant' }]
  },
  {
    id: 'p-case-kit',
    name: 'Kit Case',
    description: 'Kitlar yutib olish imkoniyati.',
    category: Category.KEYS,
    image: 'https://picsum.photos/seed/ck/400/300',
    active: true,
    tariffs: [{ id: 'c3', name: '1 dona', price: 10000, duration: 'Instant' }]
  },
  {
    id: 'p-unban',
    name: 'UNBAN',
    description: 'Serverdagi banni olib tashlash.',
    category: Category.UNBAN,
    image: 'https://picsum.photos/seed/unban/400/300',
    active: true,
    tariffs: [{ id: 'ub1', name: 'Xizmat', price: 15000, duration: 'Instant' }]
  }
];
