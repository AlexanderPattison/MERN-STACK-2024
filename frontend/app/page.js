import React from 'react'
import ItemList from '../src/components/ItemList'

export const metadata = {
    title: 'Home - Your E-commerce App',
    description: 'Browse our amazing products',
}

export default function Home() {
    return (
        <main className="container mx-auto px-4">
            <h1 className="text-3xl font-bold my-8">Welcome to Our Store</h1>
            <ItemList isAuthenticated={false} />
        </main>
    )
}