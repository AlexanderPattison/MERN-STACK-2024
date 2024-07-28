'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Signup from '../components/Signup'
import { useAuth } from '../hooks/useAuth'

export default function SignupPage() {
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

    return <Signup />
}