import React from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getAllItems, getItemById } from '../../../src/utils/itemService'

export async function generateStaticParams() {
    const items = await getAllItems()
    return items.map((item) => ({
        id: item.id.toString(),
    }))
}

export default async function ProductPage({ params }) {
    const item = await getItemById(params.id)

    if (!item) {
        notFound()
    }

    return (
        <div>
            <h1>{item.name}</h1>
            <Image src={item.imageUrl} alt={item.name} width={400} height={400} />
            <p>{item.description}</p>
            <p>Price: ${item.price}</p>
            {/* Add to cart button, etc. */}
        </div>
    )
}