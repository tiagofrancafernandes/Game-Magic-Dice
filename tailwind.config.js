/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Nunito', 'ui-rounded', 'system-ui', 'sans-serif'],
            },
            keyframes: {
                'dice-shake': {
                    '0%, 100%': { transform: 'rotate(0deg) scale(1)' },
                    '10%': { transform: 'rotate(-12deg) scale(1.06)' },
                    '20%': { transform: 'rotate(12deg) scale(1.09)' },
                    '30%': { transform: 'rotate(-10deg) scale(1.07)' },
                    '40%': { transform: 'rotate(10deg) scale(1.1)' },
                    '50%': { transform: 'rotate(-7deg) scale(1.08)' },
                    '60%': { transform: 'rotate(7deg) scale(1.06)' },
                    '70%': { transform: 'rotate(-4deg) scale(1.04)' },
                    '80%': { transform: 'rotate(4deg) scale(1.02)' },
                    '90%': { transform: 'rotate(-2deg) scale(1.01)' },
                },
                blob: {
                    '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(20px, -20px) scale(1.05)' },
                    '66%': { transform: 'translate(-15px, 10px) scale(0.95)' },
                },
            },
            animation: {
                'dice-shake': 'dice-shake 0.65s ease-in-out',
                blob: 'blob 8s ease-in-out infinite',
                'blob-delay': 'blob 8s ease-in-out 2s infinite',
                'blob-delay2': 'blob 8s ease-in-out 4s infinite',
            },
        },
    },
    plugins: [],
};
