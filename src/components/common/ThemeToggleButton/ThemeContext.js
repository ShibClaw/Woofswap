import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();
export function ThemeProvider({ children }) {
    const [isDarkMode, setIsDarkMode] = useState( localStorage.getItem('styleMode') || 'light');

    const toggleDarkMode = () => {
        const newStyleMode = isDarkMode === 'light' ? 'dark' : 'light';
        setIsDarkMode(newStyleMode);
        localStorage.setItem('styleMode', newStyleMode);
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
