/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  X, 
  Trash2, 
  ChevronRight, 
  Search, 
  Menu, 
  Package, 
  Settings,
  CheckCircle2,
  Truck,
  ShieldCheck,
  Leaf,
  Instagram,
  Facebook,
  Twitter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Product, CartItem, Category } from './types';
import { INITIAL_PRODUCTS } from './constants';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DEFAULT_PRODUCT_IMAGE = '/muratusta.jpeg';
const HERO_IMAGE_DURATION = 5000;

function normalizeAssetPath(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return '';
  }

  if (trimmed.startsWith('/') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  return `/${trimmed}`;
}

export default function App() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminTab, setAdminTab] = useState<'products' | 'hero'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Hepsi'>('Hepsi');
  const [showSuccess, setShowSuccess] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [heroSlides, setHeroSlides] = useState([
    { id: '1', type: 'video', src: '/muv3.mp4', title: 'Murat Usta Atolyesi', subtitle: 'Atolyeden gelen ilk goruntulerle yolculuk basliyor.' },
    { id: '2', type: 'image', src: '/murj4.jpeg', title: 'Dogal Ahsap Seckileri', subtitle: 'Dogal dokular ve el isciligi bir araya geliyor.' },
    { id: '3', type: 'video', src: '/muv4.mp4', title: 'El Emegi Tasarimlar', subtitle: 'Her biri benzersiz ve ozenle hazirlanmis seckiler.' },
    { id: '4', type: 'image', src: '/murj2.jpg', title: 'Atolyeden Yansimalar', subtitle: 'Uretimin sicakligini ve detaylarini yakindan inceleyin.' },
    { id: '5', type: 'video', src: '/muv5.mp4', title: 'Uretimden Kareler', subtitle: 'Ahsabin karakteri, ustaligin detaylariyla bulusuyor.' },
    { id: '6', type: 'image', src: '/murp3.png', title: 'Ozel Koleksiyon', subtitle: 'Atolyeden vitrine uzanan secili koleksiyon.' },
    { id: '7', type: 'video', src: '/muv3.mp4', title: 'Final Sunumu', subtitle: 'Hero akisi guclu bir atolye videosuyla tamamlanir.' },
  ]);
  const activeHeroSlide = heroSlides[currentHeroIndex];

  useEffect(() => {
    if (activeHeroSlide.type !== 'image') {
      return;
    }

    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, HERO_IMAGE_DURATION);
    return () => clearInterval(timer);
  }, [activeHeroSlide.type, heroSlides.length]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Hepsi' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addProduct = (newProduct: Omit<Product, 'id' | 'createdAt'>) => {
    const product: Product = {
      ...newProduct,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
    };
    setProducts(prev => [product, ...prev]);
  };

  const updateProduct = (id: string, updatedData: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
    setEditingProduct(null);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const openAdminPanel = () => {
    setAdminError('');
    setIsAdminOpen(true);
  };

  const closeAdminPanel = () => {
    setIsAdminOpen(false);
    setAdminPassword('');
    setAdminError('');
  };

  const handleAdminLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (adminPassword === '1234') {
      setIsAdminAuthenticated(true);
      setAdminError('');
      return;
    }

    setAdminError('Sifre hatali. Lutfen tekrar deneyin.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Bars from PDF */}
      <div className="bg-brand-blue text-white py-2 text-center text-[11px] font-bold tracking-widest uppercase relative">
        Tüm Türkiye'ye Ücretsiz Kargo!
        <button className="absolute right-4 top-1/2 -translate-y-1/2"><X size={14} /></button>
      </div>
      <div className="bg-[#1a1a1a] text-white py-3 px-4 sm:px-6 lg:px-8 flex justify-between items-center text-[12px]">
        <div className="flex items-center gap-2">
          <span className="opacity-70">02164441234</span>
        </div>
        <div className="font-bold tracking-widest uppercase">
          %50'YE VARAN DEV BAYRAM İNDİRİMİ
        </div>
        <div className="hidden md:block"></div>
      </div>

      {/* Main Header */}
      <header className="bg-white py-5 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setSelectedCategory('Hepsi')}>
            <img 
              src="/logo.png" 
              alt="Murat Usta'nın Dünyası" 
              className="h-44 w-44 md:h-56 md:w-56 object-contain" 
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://picsum.photos/seed/wood/100/100";
              }}
            />
            <div className="flex flex-col leading-none">
              <span className="font-artistic italic text-4xl md:text-5xl lowercase tracking-tighter text-brand-accent">murat usta'nın</span>
              <span className="font-sans font-black uppercase tracking-[0.5em] text-[11px] md:text-xs text-brand-primary ml-1">dünyası</span>
            </div>
          </div>

          <div className="flex-grow max-w-2xl relative hidden md:block">
            <input 
              type="text" 
              placeholder="Ne aramıştınız ?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-6 pr-16 py-3 border border-stone-200 text-sm focus:ring-0 focus:border-brand-accent outline-none"
            />
            <button className="absolute right-0 top-0 bottom-0 bg-brand-accent px-6 text-white hover:bg-brand-accent/90 transition-colors">
              <Search size={20} />
            </button>
          </div>

          <div className="flex items-center gap-8">
            <button 
              onClick={openAdminPanel}
              className="flex flex-col items-center gap-1 group"
            >
              <div className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center group-hover:border-brand-accent transition-colors">
                <Settings size={20} className="text-stone-600 group-hover:text-brand-accent" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Yönetim</span>
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="flex flex-col items-center gap-1 group relative"
            >
              <div className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center group-hover:border-brand-accent transition-colors">
                <ShoppingBag size={20} className="text-stone-600 group-hover:text-brand-accent" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Sepetim</span>
              {cart.length > 0 && (
                <span className="absolute -top-1 right-2 w-5 h-5 bg-brand-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-[#f8f8f8] border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center gap-8 py-4 overflow-x-auto no-scrollbar">
            {['Hepsi', 'Oyuncak', 'Aksesuar', 'Dekorasyon', 'Eğitici'].map((cat) => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat as any)}
                className={cn(
                  "text-[12px] font-bold uppercase tracking-widest transition-colors whitespace-nowrap border-b-2 pb-1",
                  selectedCategory === cat ? "text-brand-primary border-brand-accent" : "text-stone-600 border-transparent hover:text-brand-primary"
                )}
              >
                {cat === 'Hepsi' ? 'Tüm Ürünler' : cat}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {/* Hero Slider */}
        <section className="relative h-[70vh] overflow-hidden bg-stone-900">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeHeroSlide.id}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {activeHeroSlide.type === 'video' ? (
                <video
                  src={activeHeroSlide.src}
                  className="h-[86%] w-[86%] object-contain"
                  autoPlay
                  muted
                  playsInline
                  onEnded={() => setCurrentHeroIndex((prev) => (prev + 1) % heroSlides.length)}
                />
              ) : (
                <img 
                  src={activeHeroSlide.src} 
                  alt={activeHeroSlide.title} 
                  className="h-[86%] w-[86%] object-contain"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://picsum.photos/seed/wood${currentHeroIndex}/1920/1080`;
                  }}
                />
              )}
              <div className="absolute inset-0 bg-black/40" />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <motion.div 
                key={`content-${activeHeroSlide.id}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="max-w-xl text-white"
              >
                <span className="text-xs font-bold uppercase tracking-[0.4em] mb-6 block opacity-80 bg-brand-accent/20 inline-block px-4 py-1 rounded">Özel Tasarım</span>
                <h2 className="font-serif italic font-light mb-8 leading-[0.9] tracking-tighter">
                  <span className="text-5xl md:text-7xl block font-bold not-italic">{activeHeroSlide.title}</span>
                </h2>
                <p className="text-lg font-light tracking-wide mb-10 opacity-90 leading-relaxed max-w-md">
                  {activeHeroSlide.subtitle}
                </p>
                <div className="flex gap-4">
                  <button className="group relative overflow-hidden bg-brand-accent text-white px-16 py-5 font-bold uppercase text-[12px] tracking-[0.3em] transition-all rounded-full shadow-xl hover:scale-105 active:scale-95">
                    <span className="relative z-10">KOLEKSİYONU KEŞFET</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Slider Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentHeroIndex(idx)}
                className={cn(
                  "w-12 h-1 transition-all duration-500",
                  currentHeroIndex === idx ? "bg-brand-accent w-20" : "bg-white/30 hover:bg-white/50"
                )}
              />
            ))}
          </div>

        </section>

        {/* Features Bar from PDF */}
        <section className="bg-[#e5e5e5] py-16 border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
              {[
                { icon: <Truck size={32} />, title: 'Hızlı Kargo' },
                { icon: <Plus size={32} />, title: 'El Yapımı' },
                { icon: <Leaf size={32} />, title: 'Naturel' },
                { icon: <ShieldCheck size={32} />, title: 'Güvenilir' },
                { icon: <ShoppingBag size={32} />, title: '7/24' },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-4 text-stone-700">
                  <div className="opacity-60">{item.icon}</div>
                  <h4 className="font-bold text-sm uppercase tracking-widest">{item.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Product Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-left mb-16">
            <h2 className="text-3xl font-bold uppercase tracking-widest mb-4">Vitrin Ürünleri</h2>
            <div className="w-20 h-1 bg-brand-accent" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="group bg-white p-4 border border-stone-100 hover:shadow-xl transition-shadow relative"
                >
                  <div className="relative aspect-square overflow-hidden bg-stone-50 mb-6">
                    <div className="absolute top-0 right-0 bg-brand-pink text-white px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-bl-lg z-10">
                      %30 İndirim
                    </div>
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-[#a3b11a] text-white text-[8px] font-bold px-2 py-1 flex items-center gap-1">
                        <CheckCircle2 size={10} /> KAMPANYALI ÜRÜN
                      </span>
                      <span className="bg-[#1a1a1a] text-white text-[8px] font-bold px-2 py-1 flex items-center gap-1">
                        <Truck size={10} /> ÜCRETSİZ TESLİMAT
                      </span>
                    </div>
                    <h3 className="text-[11px] font-bold text-brand-primary line-clamp-2 min-h-[2.5rem] group-hover:text-brand-accent transition-colors uppercase tracking-tight">{product.name}</h3>
                    <div className="flex items-baseline gap-3">
                      <p className="text-base font-black text-brand-primary">₺{product.price.toLocaleString()}</p>
                      <p className="text-xs text-stone-400 line-through">₺{(product.price * 1.4).toLocaleString()} TL</p>
                    </div>
                    <button 
                      onClick={() => addToCart(product)}
                      className="w-full bg-stone-100 text-stone-600 py-3 font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-brand-primary hover:text-white transition-all"
                    >
                      Sepete Ekle
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* About Section from PDF Page 3 */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-4xl font-black tracking-tighter">Tasarlıyoruz, Üretiyoruz...</h2>
                <p className="text-2xl font-bold text-[#a3b11a] leading-tight">
                  "Masif ahşap mobilya üretiminde kalite ve estetiği bir araya getiriyor perakende ve toptan satış seçenekleriyle yaşam alanlarınıza değer katıyoruz"
                </p>
              </div>
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                  '/murp1.png',
                  '/murj1.jpg',
                  '/murj7.jpeg',
                  '/murrp10.png',
                  '/murj8.jpeg',
                  '/murp3.png',
                  '/logo.png',
                  '/murj10.jpeg',
                ].map((imageSrc, index) => (
                  <div key={imageSrc} className="bg-stone-50 rounded-lg overflow-hidden">
                    <img
                      src={imageSrc}
                      alt={`Murat Usta galeri ${index + 1}`}
                      className="w-full h-40 md:h-44 object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter & Social from PDF Page 5 */}
        <section className="bg-[#f8f8f8] py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="space-y-6">
                <h3 className="text-xl font-bold uppercase tracking-widest">E-Bülten'e Kayıt Olun</h3>
                <p className="text-stone-500 text-sm">Haber listemize kayıt olarak kampanyalardan, haberdar olabilirsiniz.</p>
                <div className="flex max-w-md">
                  <input 
                    type="email" 
                    placeholder="info@muratustanindunyasi.com"
                    className="flex-grow px-6 py-4 border border-stone-200 focus:ring-0 focus:border-brand-accent outline-none"
                  />
                  <button className="bg-[#333] text-white px-8 py-4 font-bold uppercase text-xs tracking-widest hover:bg-brand-primary transition-colors">
                    Kayıt Ol
                  </button>
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="text-xl font-bold uppercase tracking-widest">Sosyal Medyada Bizi Takip Edin</h3>
                <p className="text-stone-500 text-sm">Haber listemize kayıt olarak kampanyalardan, haberdar olabilirsiniz.</p>
                <div className="flex gap-4">
                  {[Facebook, Instagram, Twitter, Plus, ShoppingBag, Truck].map((Icon, idx) => (
                    <button key={idx} className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-brand-accent hover:text-white hover:border-brand-accent transition-all">
                      <Icon size={20} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer from PDF Page 6 */}
      <footer className="bg-white pt-24 pb-12 border-t border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
            <div className="space-y-8">
              <div className="flex items-center gap-4 group cursor-pointer">
                <img 
                  src="/logo.png" 
                  alt="Murat Usta'nın Dünyası" 
                  className="h-44 w-44 object-contain" 
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://picsum.photos/seed/wood/100/100";
                  }}
                />
              </div>
              <div className="space-y-4 text-sm text-stone-600">
                <div className="flex items-center gap-3">
                  <Truck size={18} className="text-brand-accent" />
                  <span>02164441234</span>
                </div>
                <div className="flex items-center gap-3">
                  <Plus size={18} className="text-brand-accent" />
                  <span>info@muratustanindunyasi.com</span>
                </div>
                <div className="flex items-start gap-3">
                  <Settings size={18} className="text-brand-accent mt-1" />
                  <span>Bostanci, Kadikoy, Istanbul, Turkiye</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold uppercase text-xs tracking-widest mb-8 text-brand-primary">ÜYELİK</h4>
              <ul className="space-y-4 text-stone-500 text-sm">
                <li><a href="#" className="hover:text-brand-accent transition-colors">Yeni Üyelik</a></li>
                <li><a href="#" className="hover:text-brand-accent transition-colors">Üye Girişi</a></li>
                <li><a href="#" className="hover:text-brand-accent transition-colors">Şifremi Unuttum</a></li>
                <li><a href="#" className="hover:text-brand-accent transition-colors">İletişim Formu</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold uppercase text-xs tracking-widest mb-8 text-brand-primary">SAYFALAR</h4>
              <ul className="space-y-4 text-stone-500 text-sm">
                <li><a href="#" className="hover:text-brand-accent transition-colors">Hakkımızda</a></li>
                <li><a href="#" className="hover:text-brand-accent transition-colors">İş Ortaklarımız</a></li>
                <li><a href="#" className="hover:text-brand-accent transition-colors">Mesafeli Satış Sözleşmesi</a></li>
                <li><a href="#" className="hover:text-brand-accent transition-colors">Gizlilik ve Güvenlik</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold uppercase text-xs tracking-widest mb-8 text-brand-primary">HESABIM</h4>
              <ul className="space-y-4 text-stone-500 text-sm">
                <li><a href="#" className="hover:text-brand-accent transition-colors">Hesabım</a></li>
                <li><a href="#" className="hover:text-brand-accent transition-colors">Sipariş Takip</a></li>
                <li><a href="#" className="hover:text-brand-accent transition-colors">Favorileriniz</a></li>
                <li><a href="#" className="hover:text-brand-accent transition-colors">Sepetiniz</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-stone-100">
            <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest">
              © Sitede Kullanılan Görsel Ve Bilgilerin Tüm Hakları Saklıdır. İzinsiz Kullanmak Suçtur.
            </p>
            <div className="flex items-center gap-4 opacity-60">
              {/* Mock payment icons */}
              <div className="h-6 w-10 bg-stone-200 rounded" />
              <div className="h-6 w-10 bg-stone-200 rounded" />
              <div className="h-6 w-10 bg-stone-200 rounded" />
              <div className="h-6 w-10 bg-stone-200 rounded" />
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.4 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-stone-100 flex justify-between items-center">
                <h2 className="text-sm font-bold uppercase tracking-widest">Alışveriş Sepeti ({cart.length})</h2>
                <button onClick={() => setIsCartOpen(false)} className="hover:rotate-90 transition-transform duration-300">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-8">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-stone-400">
                    <p className="text-xs font-bold uppercase tracking-widest">Sepetiniz Boş</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-6">
                        <img src={item.imageUrl} alt={item.name} className="w-20 h-24 object-cover bg-stone-100" referrerPolicy="no-referrer" />
                        <div className="flex-grow">
                          <div className="flex justify-between mb-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider">{item.name}</h4>
                            <button onClick={() => removeFromCart(item.id)} className="text-stone-300 hover:text-brand-primary"><X size={14} /></button>
                          </div>
                          <p className="text-xs font-bold text-stone-400 mb-4">₺{item.price.toFixed(2)}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center border border-stone-200">
                              <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 text-stone-400 hover:text-brand-primary">-</button>
                              <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 text-stone-400 hover:text-brand-primary">+</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 bg-stone-50 border-t border-stone-100">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-bold uppercase tracking-widest">Ara Toplam</span>
                    <span className="font-bold">₺{cartTotal.toFixed(2)}</span>
                  </div>
                  <button className="w-full bg-brand-primary text-white py-5 font-bold uppercase text-xs tracking-widest hover:bg-brand-accent transition-colors">
                    Ödeme Adımına Geç
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Admin Panel Modal */}
      <AnimatePresence>
        {isAdminOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeAdminPanel}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-stone-100 flex justify-between items-center">
                <div className="flex items-center gap-8">
                  <h2 className="text-xl font-bold uppercase tracking-widest">Mağaza Yönetimi</h2>
                  <div className="flex gap-4 ml-8">
                    <button 
                      onClick={() => setAdminTab('products')}
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-[0.2em] pb-1 border-b-2 transition-colors",
                        adminTab === 'products' ? "border-brand-accent text-brand-primary" : "border-transparent text-stone-400 hover:text-stone-600"
                      )}
                    >
                      Ürünler
                    </button>
                    <button 
                      onClick={() => setAdminTab('hero')}
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-[0.2em] pb-1 border-b-2 transition-colors",
                        adminTab === 'hero' ? "border-brand-accent text-brand-primary" : "border-transparent text-stone-400 hover:text-stone-600"
                      )}
                    >
                      Hero Slider
                    </button>
                  </div>
                </div>
                <button onClick={closeAdminPanel}><X size={24} /></button>
              </div>

              <div className="flex-grow overflow-y-auto p-8">
                {!isAdminAuthenticated ? (
                  <div className="max-w-md mx-auto py-12">
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-brand-accent pb-2 inline-block">
                      Yonetici Girisi
                    </h3>
                    <form onSubmit={handleAdminLogin} className="space-y-5">
                      <input
                        type="password"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="Admin sifresi"
                        className="w-full px-4 py-3 bg-stone-50 border-none text-sm focus:ring-1 focus:ring-brand-accent"
                      />
                      {adminError && (
                        <p className="text-sm text-red-500">{adminError}</p>
                      )}
                      <button
                        type="submit"
                        className="w-full bg-brand-primary text-white py-4 font-bold uppercase text-xs tracking-widest hover:bg-brand-accent transition-colors"
                      >
                        Giris Yap
                      </button>
                    </form>
                  </div>
                ) : adminTab === 'products' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-1">
                      <h3 className="text-sm font-bold uppercase tracking-widest mb-8 border-b border-brand-accent pb-2 inline-block">
                        {editingProduct ? 'Ürünü Düzenle' : 'Yeni Ürün'}
                      </h3>
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          const productData = {
                            name: formData.get('name') as string,
                            description: formData.get('description') as string,
                            price: parseFloat(formData.get('price') as string),
                            category: formData.get('category') as Category,
                            imageUrl: normalizeAssetPath((formData.get('imageUrl') as string) || '') || DEFAULT_PRODUCT_IMAGE,
                            stock: parseInt(formData.get('stock') as string),
                          };

                          if (editingProduct) {
                            updateProduct(editingProduct.id, productData);
                          } else {
                            addProduct(productData);
                          }
                          (e.target as HTMLFormElement).reset();
                          setEditingProduct(null);
                        }}
                        className="space-y-6"
                      >
                        <input 
                          name="name" 
                          placeholder="Ürün Adı" 
                          required 
                          defaultValue={editingProduct?.name || ''}
                          key={editingProduct?.id + '-name'}
                          className="w-full px-4 py-3 bg-stone-50 border-none text-sm focus:ring-1 focus:ring-brand-accent" 
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <input 
                            name="price" 
                            type="number" 
                            step="0.01" 
                            placeholder="Fiyat" 
                            required 
                            defaultValue={editingProduct?.price || ''}
                            key={editingProduct?.id + '-price'}
                            className="w-full px-4 py-3 bg-stone-50 border-none text-sm focus:ring-1 focus:ring-brand-accent" 
                          />
                          <input 
                            name="stock" 
                            type="number" 
                            placeholder="Stok" 
                            required 
                            defaultValue={editingProduct?.stock || ''}
                            key={editingProduct?.id + '-stock'}
                            className="w-full px-4 py-3 bg-stone-50 border-none text-sm focus:ring-1 focus:ring-brand-accent" 
                          />
                        </div>
                        <select 
                          name="category" 
                          defaultValue={editingProduct?.category || 'Oyuncak'}
                          key={editingProduct?.id + '-category'}
                          className="w-full px-4 py-3 bg-stone-50 border-none text-sm focus:ring-1 focus:ring-brand-accent appearance-none"
                        >
                          <option value="Oyuncak">Oyuncak</option>
                          <option value="Aksesuar">Aksesuar</option>
                          <option value="Dekorasyon">Dekorasyon</option>
                          <option value="Eğitici">Eğitici</option>
                        </select>
                        <input 
                          name="imageUrl" 
                          placeholder="Public dosya yolu (bossa varsayilan kullanilir)"
                          defaultValue={editingProduct?.imageUrl || ''}
                          key={editingProduct?.id + '-image'}
                          className="w-full px-4 py-3 bg-stone-50 border-none text-sm focus:ring-1 focus:ring-brand-accent" 
                        />
                        <p className="text-[11px] text-stone-400">
                          Ornek: <code>/murj2.jpg</code> veya sadece <code>murj2.jpg</code>. Degisiklik icin <strong>Guncelle</strong> butonuna basin.
                        </p>
                        <textarea 
                          name="description" 
                          placeholder="Açıklama" 
                          rows={4} 
                          required 
                          defaultValue={editingProduct?.description || ''}
                          key={editingProduct?.id + '-desc'}
                          className="w-full px-4 py-3 bg-stone-50 border-none text-sm focus:ring-1 focus:ring-brand-accent resize-none" 
                        />
                        <div className="flex gap-4">
                          <button type="submit" className="flex-grow bg-brand-primary text-white py-4 font-bold uppercase text-xs tracking-widest hover:bg-brand-accent transition-colors">
                            {editingProduct ? 'Güncelle' : 'Ürünü Yayınla'}
                          </button>
                          {editingProduct && (
                            <button 
                              type="button" 
                              onClick={() => setEditingProduct(null)}
                              className="bg-stone-200 text-stone-600 px-6 py-4 font-bold uppercase text-xs tracking-widest hover:bg-stone-300 transition-colors"
                            >
                              İptal
                            </button>
                          )}
                        </div>
                      </form>
                    </div>

                    <div className="lg:col-span-2">
                      <h3 className="text-sm font-bold uppercase tracking-widest mb-8 border-b border-brand-accent pb-2 inline-block">Envanter ({products.length})</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {products.map(p => (
                          <div key={p.id} className={cn(
                            "flex items-center gap-4 p-4 transition-colors group",
                            editingProduct?.id === p.id ? "bg-brand-accent/10 ring-1 ring-brand-accent" : "bg-stone-50"
                          )}>
                            <img src={p.imageUrl} className="w-16 h-16 object-cover" referrerPolicy="no-referrer" />
                            <div className="flex-grow">
                              <h4 className="text-[11px] font-bold uppercase tracking-wider">{p.name}</h4>
                              <p className="text-[10px] text-stone-400">₺{p.price.toFixed(2)} • {p.stock} Adet</p>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => setEditingProduct(p)}
                                className="p-2 text-stone-300 hover:text-brand-accent transition-colors"
                                title="Düzenle"
                              >
                                <Settings size={16} />
                              </button>
                              <button 
                                onClick={() => deleteProduct(p.id)}
                                className="p-2 text-stone-300 hover:text-red-500 transition-colors"
                                title="Sil"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-12">
                    <h3 className="text-sm font-bold uppercase tracking-widest border-b border-brand-accent pb-2 inline-block">Hero Slider Yönetimi</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {heroSlides.map((slide, index) => (
                        <div key={slide.id} className="bg-stone-50 p-6 space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Slayt {index + 1}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-accent">{slide.type}</span>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block mb-1">Medya Yolu</label>
                              <input 
                                value={slide.src}
                                onChange={(e) => {
                                  const newSlides = [...heroSlides];
                                  newSlides[index].src = normalizeAssetPath(e.target.value);
                                  setHeroSlides(newSlides);
                                }}
                                className="w-full px-3 py-2 bg-white border-none text-xs focus:ring-1 focus:ring-brand-accent"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block mb-1">Başlık</label>
                              <input 
                                value={slide.title}
                                onChange={(e) => {
                                  const newSlides = [...heroSlides];
                                  newSlides[index].title = e.target.value;
                                  setHeroSlides(newSlides);
                                }}
                                className="w-full px-3 py-2 bg-white border-none text-xs focus:ring-1 focus:ring-brand-accent"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block mb-1">Alt Başlık</label>
                              <textarea 
                                value={slide.subtitle}
                                onChange={(e) => {
                                  const newSlides = [...heroSlides];
                                  newSlides[index].subtitle = e.target.value;
                                  setHeroSlides(newSlides);
                                }}
                                rows={2}
                                className="w-full px-3 py-2 bg-white border-none text-xs focus:ring-1 focus:ring-brand-accent resize-none"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 z-[100] bg-brand-primary text-white px-8 py-4 shadow-2xl flex items-center gap-4"
          >
            <CheckCircle2 size={20} className="text-brand-accent" />
            <span className="text-xs font-bold uppercase tracking-widest">Ürün Sepete Eklendi</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
