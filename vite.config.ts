import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5174,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src/'),
            components: `${path.resolve(__dirname, './src/components/')}`,
            public: `${path.resolve(__dirname, './public/')}`,
            pages: path.resolve(__dirname, './src/pages'),
            types: `${path.resolve(__dirname, './src/@types')}`,
        },
    },
});
