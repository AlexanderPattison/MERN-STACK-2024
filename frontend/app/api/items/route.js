import { NextResponse } from 'next/server';
import { getAllItems } from '../../../src/utils/itemService';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    try {
        const items = await getAllItems(search, page, limit);
        return NextResponse.json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}