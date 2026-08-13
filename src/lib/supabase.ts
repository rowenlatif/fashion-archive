import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

const isServer = typeof window === 'undefined';

// Expo Router's static web export renders in Node, where there's no
// `window` for AsyncStorage's web fallback to reach — a real session only
// needs to persist once the client is actually running in a browser or on
// device, so server-side rendering gets a no-op storage instead of crashing.
const noopStorage = {
  getItem: async () => null,
  setItem: async () => {},
  removeItem: async () => {},
};

// Untyped client for now — regenerate `src/types/supabase.ts` with
// `npx supabase gen types typescript` and pass it as `createClient<Database>`
// once the schema has stabilized.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: isServer ? noopStorage : AsyncStorage,
    autoRefreshToken: !isServer,
    persistSession: !isServer,
    detectSessionInUrl: false,
  },
});
