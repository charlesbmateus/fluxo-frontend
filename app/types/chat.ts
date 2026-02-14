export interface Message {
    id: number
    conversation_id: number
    sender_id: number
    body: string
    created_at: string
    read_at?: string | null
}

export interface Conversation {
    id: number
    participants: {
        id: number
        name: string
        avatar?: string | null
    }[]
    last_message?: Message | null
    unread_count: number
    updated_at: string
}