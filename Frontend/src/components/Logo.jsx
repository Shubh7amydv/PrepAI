import React from 'react'

export const LogoIcon = ({ size = 28, className = "" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width={size}
        height={size}
        fill="none"
        className={className}
        style={{ flexShrink: 0 }}
    >
        <rect width="32" height="32" rx="8" fill="#1C1815" stroke="#4A3B2A" strokeWidth="1.5" />
        <path
            d="M17.5 5.5L8.5 16.5H15L13.5 26.5L23.5 14.5H17L18.5 5.5Z"
            fill="#E8622C"
            stroke="#D4531F"
            strokeWidth="0.5"
            strokeLinejoin="round"
        />
        <circle cx="22.5" cy="8" r="1.75" fill="#D4A24C" />
    </svg>
)

export const Logo = ({ size = 32, showText = true, textClass = "" }) => (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem' }}>
        <LogoIcon size={size} />
        {showText && (
            <span
                style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: '#F5EFE6'
                }}
                className={textClass}
            >
                Prep<span style={{ color: '#E8622C' }}>AI</span>
            </span>
        )}
    </div>
)

export default Logo
