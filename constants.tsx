
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

const createTariffs = (prefix: string, thirtyDaysPrice: number, sixtyDaysPrice: number) => [
  { id: `${prefix}-30`, name: '30 kunlik', price: thirtyDaysPrice, duration: '30 kun' },
  { id: `${prefix}-60`, name: '60 kunlik', price: sixtyDaysPrice, duration: '60 kun' }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p-custom',
    name: 'Custom Donat',
    description: 'O‘zingiz xohlagan prefix asosida maxsus donat. Tayyor bo‘lish: 1–2 kun.',
    category: Category.RANKS,
    image: 'https://picsum.photos/seed/custom/400/300',
    active: true,
    tariffs: [
      { id: 't-c-1', name: '30 kunlik', price: 600000, duration: '30 kun' },
      { id: 't-c-2', name: '60 kunlik', price: 1000000, duration: '60 kun' }
    ]
  },
  {
    id: 'p-eclipse',
    name: 'ECLIPSE',
    description: 'Boshlang‘ich donat darajasi.',
    category: Category.RANKS,
    image: 'https://picsum.photos/seed/eclipse/400/300',
    active: true,
    tariffs: createTariffs('eclipse', 7000, 13000)
  },
  {
    id: 'p-phoenix',
    name: 'PHOENIX',
    description: 'Himoya va kuch darajasi.',
    category: Category.RANKS,
    image: 'https://picsum.photos/seed/phoenix/400/300',
    active: true,
    tariffs: createTariffs('phoenix', 12000, 22000)
  },
  {
    id: 'p-oracle',
    name: 'ORACLE',
    description: 'Bilim va qobiliyat darajasi.',
    category: Category.RANKS,
    image: 'https://picsum.photos/seed/oracle/400/300',
    active: true,
    tariffs: createTariffs('oracle', 18000, 32000)
  },
  {
    id: 'p-voyager',
    name: 'VOYAGER',
    description: 'Sayohat va kashfiyot darajasi.',
    category: Category.RANKS,
    image: 'https://picsum.photos/seed/voyager/400/300',
    active: true,
    tariffs: createTariffs('voyager', 24000, 42000)
  },
  {
    id: 'p-catalyst',
    name: 'CATALYST',
    description: 'Tezlik va energiya darajasi.',
    category: Category.RANKS,
    image: 'https://picsum.photos/seed/catalyst/400/300',
    active: true,
    tariffs: createTariffs('catalyst', 34000, 55000)
  },
  {
    id: 'p-celestial',
    name: 'CELESTIAL',
    description: 'Samoviy kuch darajasi.',
    category: Category.RANKS,
    image: 'https://picsum.photos/seed/celestial/400/300',
    active: true,
    tariffs: createTariffs('celestial', 49000, 75000)
  },
  {
    id: 'p-aurora',
    name: 'AURORA',
    description: 'Yorqinlik va sehr darajasi.',
    category: Category.RANKS,
    image: 'https://picsum.photos/seed/aurora/400/300',
    active: true,
    tariffs: createTariffs('aurora', 60000, 95000)
  },
  {
    id: 'p-immortal',
    name: 'IMMORTAL',
    description: 'O‘limsizlik va qudrat darajasi.',
    category: Category.RANKS,
    image: 'https://picsum.photos/seed/immortal/400/300',
    active: true,
    tariffs: createTariffs('immortal', 85000, 145000)
  },
  {
    id: 'p-apex',
    name: 'APEX',
    description: 'Cho‘qqi va g‘alaba darajasi.',
    category: Category.RANKS,
    image: 'https://picsum.photos/seed/apex/400/300',
    active: true,
    tariffs: createTariffs('apex', 99000, 165000)
  },
  {
    id: 'p-luminary',
    name: 'LUMINARY',
    description: 'Nur va yetakchilik darajasi.',
    category: Category.RANKS,
    image: 'https://picsum.photos/seed/luminary/400/300',
    active: true,
    tariffs: createTariffs('luminary', 130000, 220000)
  },
  {
    id: 'p-great',
    name: 'GREAT',
    description: 'Eng yuqori va buyuk donat darajasi.',
    category: Category.RANKS,
    image: 'https://picsum.photos/seed/great/400/300',
    active: true,
    tariffs: createTariffs('great', 169000, 295000)
  },
  {
    id: 'p-vales-100',
    name: '100 Vales',
    description: 'O‘yin ichidagi donat valyutasi.',
    category: Category.COINS,
    image: 'https://picsum.photos/seed/v100/400/300',
    active: true,
    tariffs: [{ id: 'vales-100', name: 'Paket', price: 10000, duration: 'Tezkor' }]
  },
  {
    id: 'p-vales-1000',
    name: '1000 Vales',
    description: 'O‘yin ichidagi donat valyutasi.',
    category: Category.COINS,
    image: 'https://picsum.photos/seed/v1000/400/300',
    active: true,
    tariffs: [{ id: 'vales-1000', name: 'Paket', price: 100000, duration: 'Tezkor' }]
  },
  {
    id: 'p-case-donat',
    name: 'Donate Case',
    description: 'Donat darajalarini yutib olish imkoniyati.',
    category: Category.KEYS,
    image: 'https://picsum.photos/seed/cd/400/300',
    active: true,
    tariffs: [{ id: 'case-donat', name: '1 dona', price: 10000, duration: 'Tezkor' }]
  },
  {
    id: 'p-case-token',
    name: 'Token Case',
    description: 'Tokenlar yutib olish imkoniyati.',
    category: Category.KEYS,
    image: 'https://picsum.photos/seed/ct/400/300',
    active: true,
    tariffs: [{ id: 'case-token', name: '1 dona', price: 30000, duration: 'Tezkor' }]
  },
  {
    id: 'p-unban',
    name: 'UNBAN',
    description: 'Serverdagi banni olib tashlash.',
    category: Category.UNBAN,
    image: 'https://picsum.photos/seed/unban/400/300',
    active: true,
    tariffs: [{ id: 'unban-fix', name: 'Xizmat', price: 15000, duration: 'Tezkor' }]
  }
];
