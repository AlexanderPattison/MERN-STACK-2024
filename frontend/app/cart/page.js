'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Cart from '../components/Cart'
import { useAuth } from '../hooks/useAuth'

export default function CartPage() {
    const router = useRouter()
    const { isAuthenticated } = useAuth()

    React.useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login')
        }
    }, [isAuthenticated, router])

    if (!isAuthenticated) {
        return null // or a loading spinner
    }

    return <Cart />
}