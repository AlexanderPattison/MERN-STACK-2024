import { Inter } from 'next/font/google'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { WishlistProvider } from './contexts/WishlistContext'
import { ThemeProvider } from './contexts/ThemeContext'
import NavBar from './components/NavBar'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Your E-commerce App',
    description: 'A modern e-commerce application',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ThemeProvider>
                    <AuthProvider>
                        <WishlistProvider>
                            <CartProvider>
                                <div className="App">
                                    <NavBar />
                                    <main>{children}</main>
                                </div>
                            </CartProvider>
                        </WishlistProvider>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}