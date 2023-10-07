import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
            //console.log(id);
            //if(id.includes('node_modules')) return id.toString().split('node_modules/')[1].split('/')[0].toString();
            if(id.includes('echarts/lib')){
                var lib = id.split('node_modules/echarts/lib/')[1].split('/')[0];
                if(lib!='chart' && lib!='component') lib = 'others'
                return "echarts-"+lib;
            }
        },
      },
    },
  },
})
