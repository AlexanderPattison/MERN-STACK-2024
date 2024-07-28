'use client'

import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { WishlistProvider } from './contexts/WishlistContext'

export function Providers({ children }) {
    return (
        <ThemeProvider>
            <AuthProvider>
                <WishlistProvider>
                    <CartProvider>
                        {children}
                    </CartProvider>
                </WishlistProvider>
            </AuthProvider>
        </ThemeProvider>
    )
}