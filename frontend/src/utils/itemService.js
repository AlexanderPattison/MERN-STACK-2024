import api from './api'

export async function getAllItems(search = '', page = 1, limit = 10) {
    try {
        const response = await api.get(`/items?search=${search}&page=${page}&limit=${limit}`)
        return response.data
    } catch (error) {
        console.error('Failed to fetch items:', error)
        throw error
    }
}

export async function getItemById(id) {
    try {
        const response = await api.get(`/items/${id}`)
        return response.data
    } catch (error) {
        console.error(`Failed to fetch item with id ${id}:`, error)
        return null
    }
}