import { IBMPlexMono_400Regular } from '@expo-google-fonts/ibm-plex-mono';
import { InstrumentSerif_400Regular } from '@expo-google-fonts/instrument-serif';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Slot, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { useSession } from '@/hooks/use-session';
import { queryClient } from '@/lib/query-client';

import LoginScreen from './login';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({ InstrumentSerif_400Regular, IBMPlexMono_400Regular });
  const { session, isLoading: sessionLoading } = useSession();

  if (!fontsLoaded || sessionLoading) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        {session ? (
          // Bottom tab bar (Home/Explore) is disabled for now — swap back to <AppTabs /> when it's ready.
          <Slot />
        ) : (
          <LoginScreen />
        )}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
