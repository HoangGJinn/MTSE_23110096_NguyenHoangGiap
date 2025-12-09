import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client/react';
import App from './App.jsx';
import './styles/global.css';
import apolloClient from './util/apolloClient';

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import UserPage from './pages/user.jsx';
import ProfilePage from './pages/profile.jsx';
import HomePage from './pages/home.jsx';
import ForgotPasswordPage from './pages/forgot-password.jsx';
import AdminDashboard from './pages/admin-dashboard.jsx';
import CartPage from './pages/cart.jsx';
import ProductDetailPage from './pages/product-detail.jsx';
import FavoritesPage from './pages/favorites.jsx';
import NotFound from './pages/NotFound.jsx';
import { AuthWrapper } from './components/context/auth.context.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "profile",
                element: (
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "user",
                element: <UserPage />,
            },
            {
                path: "admin",
                element: <AdminDashboard />,
            },
            {
                path: "cart",
                element: (
                    <ProtectedRoute>
                        <CartPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "product/:id",
                element: <ProductDetailPage />,
            },
            {
                path: "favorites",
                element: (
                    <ProtectedRoute>
                        <FavoritesPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "*",
                element: <NotFound />,
            },
        ]
    },
    {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ApolloProvider client={apolloClient}>
            <AuthWrapper>
                <RouterProvider router={router} />
            </AuthWrapper>
        </ApolloProvider>
    </React.StrictMode>,
);
