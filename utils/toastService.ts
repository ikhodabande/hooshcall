'use client';

import { toast } from '@/hooks/use-toast'; 


export function showToast(
  title: string,
  description: string,
  variant: 'default' | 'destructive' = 'default'
) {
  toast({
    title,
    description,
    variant,
  });
}
