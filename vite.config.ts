import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/KEDO_1_Playground/", // 👈 여기에 사용자님의 GitHub 저장소 이름을 넣어주세요!
})