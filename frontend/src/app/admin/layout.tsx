'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.replace('/');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'admin') return null;

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Admin Sidebar */}
      <aside className="w-60 bg-slate-950 text-slate-300 hidden lg:flex flex-col py-6">
        <div className="px-6 mb-8">
          <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Admin Panel</p>
          <p className="text-white font-bold text-lg">ShopVault</p>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {[
            { label: 'Dashboard', href: '/admin/dashboard', emoji: '📊' },
            { label: 'Products', href: '/admin/products', emoji: '📦' },
            { label: 'Orders', href: '/admin/orders', emoji: '🛍️' },
            { label: 'Users', href: '/admin/users', emoji: '👥' },
          ].map(({ label, href, emoji }) => (
            <a
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-colors text-sm font-medium"
            >
              <span>{emoji}</span> {label}
            </a>
          ))}
        </nav>
      </aside>

      <main className="flex-1 bg-slate-50 dark:bg-slate-950 overflow-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
