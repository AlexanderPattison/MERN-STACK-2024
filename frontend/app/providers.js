'use client'

import { ThemeProvider } from '../src/contexts/ThemeContext'
import { AuthProvider } from '../src/contexts/AuthContext'
import { CartProvider } from '../src/contexts/CartContext'
import { WishlistProvider } from '../src/contexts/WishlistContext'

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