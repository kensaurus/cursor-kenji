# Real-time Reference Patterns

Longer, copy-ready implementations for `backend-realtime`. Examples assume a
**Next.js App Router + Supabase** stack (`@/lib/supabase/client`, `'use client'`,
a `Message` row type). Adapt import paths and types to the detected stack.

---

## Subscribe to Database Changes (`useRealtimeMessages`)

Initial fetch + INSERT/DELETE subscription for a chat room, with cleanup on
unmount.

```tsx
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useRealtimeMessages(roomId: string) {
 const [messages, setMessages] = useState<Message[]>([])
 const supabase = createClient()

 useEffect(() => {
 // Initial fetch
 const fetchMessages = async () => {
 const { data } = await supabase
 .from('messages')
 .select('*')
 .eq('room_id', roomId)
 .order('created_at', { ascending: true })

 if (data) setMessages(data)
 }
 fetchMessages()

 // Subscribe to changes
 const channel = supabase
 .channel(`room:${roomId}`)
 .on(
 'postgres_changes',
 {
 event: 'INSERT',
 schema: 'public',
 table: 'messages',
 filter: `room_id=eq.${roomId}`,
 },
 (payload) => {
 setMessages((prev) => [...prev, payload.new as Message])
 }
 )
 .on(
 'postgres_changes',
 {
 event: 'DELETE',
 schema: 'public',
 table: 'messages',
 filter: `room_id=eq.${roomId}`,
 },
 (payload) => {
 setMessages((prev) =>
 prev.filter((m) => m.id !== payload.old.id)
 )
 }
 )
 .subscribe()

 return () => {
 supabase.removeChannel(channel)
 }
 }, [roomId, supabase])

 return messages
}
```
