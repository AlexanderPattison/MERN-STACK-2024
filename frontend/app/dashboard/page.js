'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../src/hooks/useAuth'
import Dashboard from '../../src/components/Dashboard'

export default function DashboardPage() {
    const { isAuthenticated } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login')
        }
    }, [isAuthenticated, router])

    if (!isAuthenticated) {
        return null // or a loading spinner
    }

    return <Dashboard />
}