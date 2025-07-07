'use client';

import PageTitles from '@/components/modules/PageTitles';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import createShopHttpService from '@/hooks/useShopHttps';
import axios from 'axios'; // If using axios for requests
import { useEffect, useState } from 'react';

type User = {
  id: string;
  name: string;
  phone: string;
};

export default function SecondAuthenticator() {
  const [users, setUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loadingIds, setLoadingIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const { httpService } = createShopHttpService();

  // Fetch users function
  const fetchUsers = async () => {
    try {
      const res = await httpService.get('/accept'); // 🔥 replace with your API
      setUsers(res.data.mobiles);
      console.log(res.data.mobiles);
      // If your API returns total count, you can calculate pages
      setTotalPages(Math.ceil(res.data.total / perPage));
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  // Accept user function
  const acceptUser = async (userId: string) => {
    try {
      setLoadingIds(prev => [...prev, userId]);
      await axios.post('/api/users/accept', { id: userId }); // 🔥 replace with your API
      // Refresh list after accepting
      await fetchUsers();
    } catch (error) {
      console.error('Failed to accept user', error);
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== userId));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleSelect = (userId: string) => {
    if (selected.includes(userId)) {
      setSelected(selected.filter(id => id !== userId));
    } else {
      setSelected([...selected, userId]);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <PageTitles
        breadcrumbs={[
          { label: 'داشبورد', href: '/dashboard' },
          { label: 'تایید دو مرحله‌ای', href: '/dashboard/second-authenticator' },
        ]}
        title={'تایید دو مرحله‌ای کاربران'}
        showSearch={false}
      />

      <Card className="overflow-auto my-4">
        <ScrollArea>
          <Table dir="rtl">
            <TableHeader className="bg-muted text-xs md:text-sm">
              <TableRow>
                <TableHead className="text-center">انتخاب</TableHead>
                <TableHead className="text-right">نام</TableHead>
                <TableHead className="text-right">شماره موبایل</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs md:text-sm font-DanaNum">
              {users?.slice((page - 1) * perPage, page * perPage).map(user => (
                <TableRow key={user.id}>
                  <TableCell className="text-center">
                    {loadingIds.includes(user.id) ? (
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin mx-auto" />
                    ) : (
                      <input
                        type="checkbox"
                        checked={selected.includes(user.id)}
                        onChange={() => {
                          toggleSelect(user.id);
                          acceptUser(user.id); // Send accept request immediately when checked
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell className="text-right">{user.name || 'نامشخص'}</TableCell>
                  <TableCell className="text-right">{(user as any) || 'بدون شماره'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-4 text-sm font-DanaNum">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              قبلی
            </button>
            <span>
              {page} از {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              بعدی
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
