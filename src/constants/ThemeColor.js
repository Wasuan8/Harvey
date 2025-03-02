
import { useColorScheme, Appearance } from 'react-native';
import { useState, useEffect } from 'react';
import COLORS from './Colors';


const useTheme = () => {
  const colorScheme = useColorScheme(); // Get initial theme
  const [theme, setTheme] = useState(colorScheme); // State to track theme changes

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme); // Update theme when system setting changes
    });

    return () => subscription.remove(); // Cleanup the listener on unmount
  }, []);

  return theme === 'dark' ? COLORS.dark : COLORS.light;
};

export default useTheme;
