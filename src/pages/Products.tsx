import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories } from '../services/api';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import { Filter, Grid, List, ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  
  const categoryId = searchParams.get('category');
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getProducts({ 
            category: categoryId, 
            search: searchQuery,
            sort: sortBy
          }),
          getCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [categoryId, searchQuery, sortBy]);

  const handleCategoryChange = (id: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (id) {
      newParams.set('category', id);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
    setShowMobileFilters(false);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSortBy(val);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', val);
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-black mb-4">
          {searchQuery ? `Results for "${searchQuery}"` : 'Shop All'}
        </h1>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <p className="text-sm text-black/40 font-bold uppercase tracking-widest">
            {products.length} Products Found
          </p>
          
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="md:hidden w-full flex items-center justify-center space-x-2 px-6 py-3 bg-black text-white rounded-xl text-sm font-bold shadow-lg shadow-black/10 transition-transform active:scale-95"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            
            <div className="relative hidden md:block">
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="w-full appearance-none px-4 py-2 pr-10 bg-black/5 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-black/10 transition cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-black/40 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-12">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <CategoryFilter
            categories={categories}
            selectedCategory={categoryId}
            onCategoryChange={handleCategoryChange}
          />
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="aspect-square bg-black/5 rounded-2xl" />
                  <div className="h-4 bg-black/5 rounded w-3/4" />
                  <div className="h-4 bg-black/5 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24 bg-black/5 rounded-[40px]">
              <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <SlidersHorizontal className="w-10 h-10 text-black/20" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">No products found</h3>
              <p className="text-black/40 mb-8">Try adjusting your filters or search query.</p>
              <button
                onClick={() => setSearchParams({})}
                className="px-8 py-3 bg-black text-white rounded-xl font-bold hover:bg-black/80 transition"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 z-[70] w-full max-w-[320px] bg-white shadow-2xl md:hidden flex flex-col"
            >
              <div className="p-6 border-b border-black/5 flex justify-between items-center">
                <h2 className="text-xl font-black tracking-tight">Filters</h2>
                <button 
                  onClick={() => setShowMobileFilters(false)} 
                  className="p-2 hover:bg-black/5 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-10">
                {/* Sort Section for Mobile */}
                <div>
                  <h3 className="text-xs font-bold text-black/40 uppercase tracking-widest mb-4">Sort By</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: 'newest', name: 'Newest' },
                      { id: 'price_low', name: 'Price: Low to High' },
                      { id: 'price_high', name: 'Price: High to Low' },
                      { id: 'rating', name: 'Top Rated' }
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSortBy(option.id)}
                        className={cn(
                          "w-full px-4 py-3 rounded-xl text-sm font-bold text-left transition-all",
                          sortBy === option.id 
                            ? "bg-black text-white" 
                            : "bg-black/5 text-black hover:bg-black/10"
                        )}
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categories Section */}
                <CategoryFilter
                  categories={categories}
                  selectedCategory={categoryId}
                  onCategoryChange={handleCategoryChange}
                />
              </div>

              <div className="p-6 border-t border-black/5 bg-white">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSearchParams({});
                      setShowMobileFilters(false);
                    }}
                    className="flex-1 py-4 bg-black/5 text-black rounded-2xl font-bold text-sm hover:bg-black/10 transition"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="flex-[2] py-4 bg-black text-white rounded-2xl font-bold text-sm hover:bg-black/80 transition shadow-lg shadow-black/10"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products;
