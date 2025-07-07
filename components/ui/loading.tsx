// components/ui/loading.tsx
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Loading({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center py-8', className)}>
      <Loader2 className="animate-spin w-6 h-6 text-primary" />
      <span className="ml-2 text-sm text-muted-foreground">در حال بارگذاری...</span>
    </div>
  );
}
