import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import RecipeContext from './context/RecipeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import'remixicon/fonts/remixicon.css';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RecipeContext>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </RecipeContext>
  </AuthProvider>
);
