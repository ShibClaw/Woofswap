import React from 'react'
import {useTheme} from './ThemeContext';

function ThemeToggleButton() {
    const {isDarkMode, toggleDarkMode} = useTheme();
    return (
        <div className='hover-img'>
            {isDarkMode === 'light' ?
                (
                    <img src="/image/common/icon-dark01.svg" className="icon-size-36 hover-img m-l-15-link" onClick={toggleDarkMode}/>
                ) :
                (
                    <img src="/image/common/icon-night01.svg" className="icon-size-36 hover-img m-l-15-link" onClick={toggleDarkMode}/>
                )}
        </div>
    );
}

export default ThemeToggleButton;