'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Login from '../components/Login'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
    const router = useRouter()
    const { isAuthenticated } = useAuth()

    React.useEffect(() => {
        if (isAuthenticated) {
            router.push('/')
        }
    }, [isAuthenticated, router])

    if (isAuthenticated) {
        return null // or a loading spinner
    }

    return <Login />
}