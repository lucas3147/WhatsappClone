import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        '3xl': '0 2px 5px 0 rgba(11,20,26,.26),0 2px 10px 0 rgba(11,20,26,.16);'
      }
    },
    backgroundColor: {
      'greenish-white' : '#d2dbdc',
    },
    fontFamil: {
      'segoe': ['Segoe UI', 'Helvetica Neue', 'Helvetica', 'Lucida Grande', 'Arial']
    }
  },
  plugins: [],
}
export default config
