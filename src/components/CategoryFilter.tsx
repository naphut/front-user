import React from 'react';
import { Category } from '../types';
import { cn } from '../lib/utils';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (id: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-bold text-black/40 uppercase tracking-widest mb-4">Categories</h3>
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => onCategoryChange(null)}
            className={cn(
              "text-left px-4 py-3 rounded-xl text-sm font-bold transition-all",
              !selectedCategory 
                ? "bg-black text-white" 
                : "bg-black/5 text-black hover:bg-black/10"
            )}
          >
            All Products
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "text-left px-4 py-3 rounded-xl text-sm font-bold transition-all",
                selectedCategory === category.id 
                  ? "bg-black text-white" 
                  : "bg-black/5 text-black hover:bg-black/10"
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-black/40 uppercase tracking-widest mb-4">Price Range</h3>
        <div className="grid grid-cols-1 gap-2">
          {[
            { id: 'under-50', name: 'Under $50' },
            { id: '50-100', name: '$50 - $100' },
            { id: '100-500', name: '$100 - $500' },
            { id: 'over-500', name: 'Over $500' }
          ].map((range) => (
            <button
              key={range.id}
              className="w-full px-4 py-3 rounded-xl text-sm font-bold text-left bg-black/5 text-black hover:bg-black/10 transition-all"
            >
              {range.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
