import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Ahşap Blok Seti',
    description: 'Doğal kayın ağacından üretilmiş, çocukların hayal gücünü geliştiren 50 parçalık blok seti.',
    price: 249.90,
    category: 'Eğitici',
    imageUrl: '/murp1.png',
    stock: 15,
    createdAt: Date.now(),
  },
  {
    id: '2',
    name: 'El Yapımı Ahşap Araba',
    description: 'Pürüzsüz yüzeyli, toksik olmayan doğal yağlarla cilalanmış klasik ahşap araba.',
    price: 129.00,
    category: 'Oyuncak',
    imageUrl: '/murj1.jpg',
    stock: 20,
    createdAt: Date.now(),
  },
  {
    id: '3',
    name: 'Minimalist Ahşap Vazo',
    description: 'Modern mekanlar için tasarlanmış, tek dal çiçekler için ideal dekoratif ahşap vazo.',
    price: 185.50,
    category: 'Dekorasyon',
    imageUrl: '/murj7.jpeg',
    stock: 8,
    createdAt: Date.now(),
  },
  {
    id: '4',
    name: 'Ahşap Mutfak Aksesuar Seti',
    description: 'Mutfak tezgahınıza şıklık katacak el yapımı kaşık ve spatula seti.',
    price: 145.00,
    category: 'Aksesuar',
    imageUrl: '/murrp10.png',
    stock: 12,
    createdAt: Date.now(),
  },
];
