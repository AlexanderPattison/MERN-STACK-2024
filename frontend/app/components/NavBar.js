'use client'

import React, { useContext } from 'react'
import Link from 'next/link'
import { FaHeart, FaShoppingCart } from 'react-icons/fa'
import { AuthContext } from '../contexts/AuthContext'
import { ThemeContext } from '../contexts/ThemeContext'

function NavBar() {
    const { isAuthenticated, user, logout } = useContext(AuthContext)
    const { darkMode, toggleDarkMode } = useContext(ThemeContext)

    return (
        <nav className={darkMode ? 'dark-mode' : ''}>
            <Link href="/">Home</Link>
            <div className="nav-links">
                {isAuthenticated ? (
                    <>
                        <span>Hello {user?.email}!</span>
                        <Link href="/dashboard">Dashboard</Link>
                        <Link href="/wishlist" className="icon-link">
                            <FaHeart />
                        </Link>
                        <Link href="/cart" className="icon-link">
                            <FaShoppingCart />
                        </Link>
                        <button onClick={logout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link href="/login">Login</Link>
                        <Link href="/signup">Signup</Link>
                    </>
                )}
                <button onClick={toggleDarkMode} className="theme-toggle">
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
            </div>
        </nav>
    )
}

export default NavBar