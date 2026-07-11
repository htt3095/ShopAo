/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms'
import containerQueries from '@tailwindcss/container-queries'

export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#ff4d00", // Vibrant Neon Orange
                "primary-hover": "#ff6a2b",
                "background-light": "#f8f9fa",
                "background-dark": "#0a0a0b", // Deep Matte Black
                "surface-light": "#ffffff",
                "surface-dark": "#18181b", // Zinc 900
                "surface-dark-highlight": "#27272a", // Zinc 800
                "text-secondary": "#a1a1aa", // Zinc 400
                "border-dark": "#3f3f46", // Zinc 700
            },
            fontFamily: {
                "display": ['"Inter"', "sans-serif"],
                "headline": ['"Inter"', "sans-serif"],
                "sans": ['"Inter"', "sans-serif"],
            },
            boxShadow: {
                'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
                'neon': '0 0 10px rgba(255, 77, 0, 0.3), 0 0 20px rgba(255, 77, 0, 0.2)',
            }
        },
    },
    plugins: [forms, containerQueries],
}