'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Package, MapPin, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '@/services/auth.service';
import { addressService } from '@/services/order.service';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Skeleton } from '@/components/ui/Skeleton';
import type { User as UserType, Address } from '@/types';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Minimum 8 characters'),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

type ProfileData = z.infer<typeof profileSchema>;
type PasswordData = z.infer<typeof passwordSchema>;

const TABS = ['profile', 'addresses', 'security'] as const;
type Tab = typeof TABS[number];

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { user, setUser, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  const profileForm = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '', phone: user?.phone || '' },
  });

  const passwordForm = useForm<PasswordData>({ resolver: zodResolver(passwordSchema) });

  const { data: addresses, isLoading: addrLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: addressService.getAll,
    enabled: isAuthenticated && activeTab === 'addresses',
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileData) => authService.updateProfile(data),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      toast.success('Profile updated!');
    },
    onError: () => toast.error('Failed to update profile'),
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: PasswordData) => authService.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully!');
      passwordForm.reset();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to change password'),
  });

  const deleteAddressMutation = useMutation({
    mutationFn: (id: string) => addressService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address deleted');
    },
  });

  const tabConfig = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'addresses', label: 'Addresses', icon: MapPin },
    { key: 'security', label: 'Security', icon: Lock },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'Profile' }]} />

      {/* Header */}
      <div className="flex items-center gap-5 mt-6 mb-8">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-extrabold">
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{user?.name}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{user?.email}</p>
          {user?.role === 'admin' && <Badge variant="info" className="mt-1">Admin</Badge>}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 mb-8">
        {tabConfig.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as Tab)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === key
                ? 'bg-white dark:bg-slate-900 text-violet-700 dark:text-violet-300 shadow-md'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Icon className="h-4 w-4" />{label}
          </button>
        ))}
      </div>

      <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
            <h2 className="font-bold text-slate-900 dark:text-white mb-5">Personal Information</h2>
            <form onSubmit={profileForm.handleSubmit(d => updateProfileMutation.mutate(d))} className="space-y-4">
              <Input id="name" label="Full Name" leftIcon={<User className="h-4 w-4" />} error={profileForm.formState.errors.name?.message} {...profileForm.register('name')} />
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email address</label>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 text-sm">
                  <Mail className="h-4 w-4 text-slate-400" />{user?.email}
                  <Badge variant="success" className="ml-auto">Verified</Badge>
                </div>
              </div>
              <Input id="phone" label="Phone number" leftIcon={<Phone className="h-4 w-4" />} {...profileForm.register('phone')} />
              <Button type="submit" isLoading={updateProfileMutation.isPending}>Save Changes</Button>
            </form>
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="space-y-4">
            {addrLoading ? (
              <div className="space-y-3">{[1,2].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}</div>
            ) : addresses?.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                <MapPin className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No saved addresses yet.</p>
              </div>
            ) : (
              addresses?.map((addr: Address) => (
                <div key={addr._id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-slate-900 dark:text-white">{addr.fullName}</p>
                      {addr.isDefault && <Badge variant="success" size="sm">Default</Badge>}
                      {addr.label && <Badge variant="outline" size="sm">{addr.label}</Badge>}
                    </div>
                    <p className="text-sm text-slate-500">{addr.street}, {addr.city}, {addr.state} {addr.zipCode}</p>
                    <p className="text-sm text-slate-500">{addr.country}</p>
                  </div>
                  <button onClick={() => deleteAddressMutation.mutate(addr._id!)} className="text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
            <h2 className="font-bold text-slate-900 dark:text-white mb-5">Change Password</h2>
            <form onSubmit={passwordForm.handleSubmit(d => changePasswordMutation.mutate(d))} className="space-y-4 max-w-md">
              <Input id="currentPassword" type="password" label="Current Password" leftIcon={<Lock className="h-4 w-4" />} error={passwordForm.formState.errors.currentPassword?.message} {...passwordForm.register('currentPassword')} />
              <Input id="newPassword" type="password" label="New Password" leftIcon={<Lock className="h-4 w-4" />} error={passwordForm.formState.errors.newPassword?.message} {...passwordForm.register('newPassword')} />
              <Input id="confirmPassword" type="password" label="Confirm New Password" leftIcon={<Lock className="h-4 w-4" />} error={passwordForm.formState.errors.confirmPassword?.message} {...passwordForm.register('confirmPassword')} />
              <Button type="submit" isLoading={changePasswordMutation.isPending}>Update Password</Button>
            </form>
          </div>
        )}

      </motion.div>
    </div>
  );
}
