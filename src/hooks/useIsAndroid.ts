import { useMemo } from 'react';
import { Platform } from 'react-native';

export const useIsAndroid = () => useMemo(() => Platform.OS === 'android', []);
