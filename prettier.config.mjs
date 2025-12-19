/** @type {import("prettier").Config} */
const config = {
  singleQuote: true,
  trailingComma: 'all',
  semi: false,
  proseWrap: 'always',
  tabWidth: 2,
  printWidth: 80,
  htmlWhitespaceSensitivity: 'css',
  plugins: ['./node_modules/prettier-plugin-tailwindcss/dist/search.store.ts.mjs']
}

export default config
