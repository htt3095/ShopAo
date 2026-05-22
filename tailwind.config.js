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
                "primary": "#c66231",
                "background-light": "#f5f1ea",
                "background-dark": "#151311",
                "surface-light": "#fffdf8",
                "surface-dark": "#1f1a17",
                "surface-dark-highlight": "#2b241f",
                "text-secondary": "#8f8477",
                "border-dark": "#3c342e",
            },
            fontFamily: {
                "display": ['"Be Vietnam Pro"', "sans-serif"],
                "headline": ['"Barlow Condensed"', '"Be Vietnam Pro"', "sans-serif"],
            }
        },
    },
    plugins: [forms, containerQueries],
}