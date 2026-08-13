import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

export type EventTag = { id: string; label: string };

async function fetchEventTypeTags(): Promise<EventTag[]> {
  const { data, error } = await supabase
    .from('tags')
    .select('id, label')
    .eq('kind', 'event_type')
    .order('label', { ascending: true });
  if (error) throw error;
  return data;
}

export function useEventTypeTags() {
  return useQuery({ queryKey: ['tags', 'event_type'], queryFn: fetchEventTypeTags });
}
