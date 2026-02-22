import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-black/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full" />
              </div>
              <span className="text-xl font-bold tracking-tight text-black">LUMINA</span>
            </Link>
            <p className="text-sm text-black/60 leading-relaxed mb-6">
              Curating the finest minimalist essentials for your modern lifestyle. Quality, design, and sustainability at our core.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-black/40 hover:text-black transition"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-black/40 hover:text-black transition"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-black/40 hover:text-black transition"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-black/40 hover:text-black transition"><Github className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-black uppercase tracking-widest mb-6">Shop</h4>
            <ul className="space-y-4">
              <li><Link to="/products" className="text-sm text-black/60 hover:text-black transition">All Products</Link></li>
              <li><Link to="/products?category=1" className="text-sm text-black/60 hover:text-black transition">Electronics</Link></li>
              <li><Link to="/products?category=2" className="text-sm text-black/60 hover:text-black transition">Furniture</Link></li>
              <li><Link to="/products?category=3" className="text-sm text-black/60 hover:text-black transition">Apparel</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-black uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-sm text-black/60 hover:text-black transition">About Us</Link></li>
              <li><Link to="/contact" className="text-sm text-black/60 hover:text-black transition">Contact</Link></li>
              <li><Link to="/careers" className="text-sm text-black/60 hover:text-black transition">Careers</Link></li>
              <li><Link to="/blog" className="text-sm text-black/60 hover:text-black transition">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-black uppercase tracking-widest mb-6">Newsletter</h4>
            <p className="text-sm text-black/60 mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <form className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-black/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition"
              />
              <button type="submit" className="absolute right-2 top-2 bg-black text-white text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-black/80 transition">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs text-black/40">© 2026 Lumina E-Commerce. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-xs text-black/40 hover:text-black transition">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-black/40 hover:text-black transition">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
