export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  category: string;
  imageUrl: string;
  stock: number;
  createdAt: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export type Category = 'Oyuncak' | 'Aksesuar' | 'Dekorasyon' | 'Eğitici';
