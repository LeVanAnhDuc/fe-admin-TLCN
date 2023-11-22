import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './assets/css/index.css';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './hook/AuthContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <AuthProvider>
        <App />
    </AuthProvider>,
);
