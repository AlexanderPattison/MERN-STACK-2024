'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Wishlist from '../../src/components/Wishlist'
import { useAuth } from '../../src/hooks/useAuth'

export default function WishlistPage() {
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

    return <Wishlist />
}