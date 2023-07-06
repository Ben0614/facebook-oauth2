import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// https (fb要求一定要用https)
import mkcert from'vite-plugin-mkcert'
// 讓啟動地址從127.0.0.1改為localhost
import dns from'dns'
dns.setDefaultResultOrder('verbatim')

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: true,
  },
  plugins: [vue(),mkcert()],
})
