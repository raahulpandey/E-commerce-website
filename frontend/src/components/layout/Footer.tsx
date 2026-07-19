'use client';

import Link from 'next/link';
import { Globe, MessageCircle, Camera, Play, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  shop: [
    { label: 'All Products', href: '/shop' },
    { label: 'Categories', href: '/categories' },
    { label: 'New Arrivals', href: '/shop?sortBy=newest' },
    { label: 'Best Sellers', href: '/shop?sortBy=rating_desc' },
  ],
  account: [
    { label: 'My Profile', href: '/profile' },
    { label: 'My Orders', href: '/orders' },
    { label: 'Wishlist', href: '/wishlist' },
    { label: 'Cart', href: '/cart' },
  ],
  support: [
    { label: 'Contact Us', href: '#' },
    { label: 'FAQs', href: '#' },
    { label: 'Shipping Policy', href: '#' },
    { label: 'Returns', href: '#' },
  ],
};

const socials = [
  { Icon: Globe, href: '#', label: 'Facebook' },
  { Icon: MessageCircle, href: '#', label: 'Twitter' },
  { Icon: Camera, href: '#', label: 'Instagram' },
  { Icon: Play, href: '#', label: 'YouTube' },
];

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-extrabold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent mb-4">
              ShopVault
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
              Your one-stop destination for quality products at unbeatable prices. Shop smarter with ShopVault.
            </p>
            <div className="flex items-center gap-3">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="h-9 w-9 rounded-full bg-slate-800 hover:bg-violet-600 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold uppercase tracking-wider text-xs mb-5">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-violet-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> support@shopvault.com</span>
            <span className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> +91-9876543210</span>
            <span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> Bengaluru, India</span>
          </div>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} ShopVault. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
