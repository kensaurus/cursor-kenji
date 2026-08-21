---
name: backend-realtime
description: Implement real-time features using WebSockets, Supabase Realtime, Server-Sent Events, and live data. Use when user wants "real-time", "live updates", "WebSocket", "notifications", "chat", "collaborative", "presence", "live data", or "instant sync".
license: MIT
---

# Real-time Features Skill

**Degree of freedom: MIXED.** Which transport and event `[HIGH freedom]`;
existing-subscription probes and unmount cleanup `[LOW freedom — run exactly]`.

## How to reason

1. **Observe** — existing channels, sockets, hooks, cleanup
2. **Interpret** — new subscription vs reuse vs transport mismatch
3. **Classify** — postgres-changes / presence / broadcast / SSE / optimistic
4. **Severity** — leaked or duplicate subscription outranks a missing typing indicator

## Worked example

> **Observe:** chat mounts `useRealtimeMessages` twice; no untrack on leave; `package.json` already has `@supabase/supabase-js`.
> **Interpret:** duplicate INSERT listeners; leftover presence.
> **Classify:** one channel hook with unmount cleanup; reuse Supabase Realtime — do not add Socket.io.
> **Verify:** one `postgres_changes` subscription; `removeChannel` on unmount; no second socket lib.

## Self-critique before reporting

- **Existing first** — grepped channels/sockets before adding a library
- **Cleanup** — every subscribe has unmount `removeChannel` / `close`
- **One listener** — no duplicate subscription for the same event
- **Right owner** — FE↔BE payload mismatch → `debug-fe-be-integration`; queue/job instead of live push → `backend-patterns`

Implement live, collaborative features using WebSockets, Supabase Realtime, and Server-Sent Events.

> Code examples assume a **Next.js App Router + Supabase** stack
> (`@/lib/supabase/client`, `'use client'`). Adapt import paths and row types to
> the detected stack.

## CRITICAL: Check Existing First  [LOW freedom — run exactly]

**Before implementing ANY real-time feature, verify:**

1. **Check for existing real-time setup:**
```bash
cat package.json | grep -i "socket\|realtime\|pusher\|ably"
rg "supabase.*channel|useSubscription|WebSocket" --type ts --type tsx
```

2. **Check for existing patterns:**
```bash
rg "on\('INSERT'\|on\('UPDATE'\|subscribe\(" --type ts
ls -la src/hooks/use*Realtime* src/lib/realtime* 2>/dev/null
```

3. **Check Supabase config:**
```bash
rg "createClient|supabaseUrl" --type ts -l
cat .env* | grep -i SUPABASE
```

**Why:** Real-time connections are stateful. Don't create duplicate subscriptions.

## Supabase Realtime  [HIGH freedom]

### Subscribe to Database Changes

The canonical `useRealtimeMessages` hook (initial fetch + INSERT/DELETE
subscription with unmount cleanup) is in
[`references/patterns.md`](references/patterns.md).

### Presence (Online Users)
```tsx
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimePresenceState } from '@supabase/supabase-js'

interface UserPresence {
 id: string
 name: string
 avatar: string
 online_at: string
}

export function usePresence(roomId: string, currentUser: UserPresence) {
 const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([])
 const supabase = createClient()

 useEffect(() => {
 const channel = supabase.channel(`presence:${roomId}`)

 channel
 .on('presence', { event: 'sync' }, () => {
 const state = channel.presenceState<UserPresence>()
 const users = Object.values(state).flat()
 setOnlineUsers(users)
 })
 .on('presence', { event: 'join' }, ({ newPresences }) => {
 console.log('User joined:', newPresences)
 })
 .on('presence', { event: 'leave' }, ({ leftPresences }) => {
 console.log('User left:', leftPresences)
 })
 .subscribe(async (status) => {
 if (status === 'SUBSCRIBED') {
 await channel.track(currentUser)
 }
 })

 return () => {
 channel.untrack()
 supabase.removeChannel(channel)
 }
 }, [roomId, currentUser, supabase])

 return onlineUsers
}
```

### Broadcast (Custom Events)
```tsx
'use client'
import { useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useBroadcast(channelName: string) {
 const supabase = createClient()
 const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

 useEffect(() => {
 channelRef.current = supabase.channel(channelName)

 channelRef.current
 .on('broadcast', { event: 'cursor-move' }, ({ payload }) => {
 // Handle cursor position updates from others
 console.log('Cursor moved:', payload)
 })
 .on('broadcast', { event: 'typing' }, ({ payload }) => {
 // Handle typing indicators
 console.log('User typing:', payload)
 })
 .subscribe()

 return () => {
 if (channelRef.current) {
 supabase.removeChannel(channelRef.current)
 }
 }
 }, [channelName, supabase])

 const broadcast = useCallback((event: string, payload: unknown) => {
 channelRef.current?.send({
 type: 'broadcast',
 event,
 payload,
 })
 }, [])

 return { broadcast }
}

// Usage: Collaborative cursors
function CollaborativeCanvas() {
 const { broadcast } = useBroadcast('canvas:123')

 const handleMouseMove = (e: React.MouseEvent) => {
 broadcast('cursor-move', {
 userId: currentUser.id,
 x: e.clientX,
 y: e.clientY,
 })
 }
}
```

## TanStack Query + Real-time  [HIGH freedom]

```tsx
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

export function useRealtimeQuery<T>(
 queryKey: string[],
 queryFn: () => Promise<T>,
 table: string,
 filter?: string
) {
 const queryClient = useQueryClient()
 const supabase = createClient()

 const query = useQuery({
 queryKey,
 queryFn,
 })

 useEffect(() => {
 const channel = supabase
 .channel(`${table}-changes`)
 .on(
 'postgres_changes',
 {
 event: '*',
 schema: 'public',
 table,
 filter,
 },
 () => {
 // Invalidate and refetch on any change
 queryClient.invalidateQueries({ queryKey })
 }
 )
 .subscribe()

 return () => {
 supabase.removeChannel(channel)
 }
 }, [table, filter, queryKey, queryClient, supabase])

 return query
}

// Usage
function ProductList() {
 const { data: products } = useRealtimeQuery(
 ['products'],
 () => fetchProducts(),
 'products'
 )
}
```

## Optimistic Updates  [HIGH freedom]

```tsx
'use client'
import { useOptimistic, useTransition } from 'react'
import { addMessage } from '@/app/actions'

function Chat({ initialMessages }: { initialMessages: Message[] }) {
 const [isPending, startTransition] = useTransition()
 const [optimisticMessages, addOptimisticMessage] = useOptimistic(
 initialMessages,
 (state, newMessage: Message) => [...state, newMessage]
 )

 async function handleSubmit(formData: FormData) {
 const content = formData.get('content') as string

 // Optimistic update - instant UI feedback
 const optimisticMessage: Message = {
 id: crypto.randomUUID(),
 content,
 created_at: new Date().toISOString(),
 user_id: currentUser.id,
 pending: true,
 }

 startTransition(async () => {
 addOptimisticMessage(optimisticMessage)
 await addMessage(content) // Server Action
 })
 }

 return (
 <div>
 {optimisticMessages.map((msg) => (
 <div key={msg.id} className={msg.pending ? 'opacity-50' : ''}>
 {msg.content}
 </div>
 ))}
 <form action={handleSubmit}>
 <input name="content" />
 <button type="submit" disabled={isPending}>Send</button>
 </form>
 </div>
 )
}
```

## Server-Sent Events (SSE)  [HIGH freedom]

```tsx
// app/api/events/route.ts
export async function GET() {
 const encoder = new TextEncoder()

 const stream = new ReadableStream({
 async start(controller) {
 const send = (data: unknown) => {
 controller.enqueue(
 encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
 )
 }

 // Send initial data
 send({ type: 'connected', timestamp: Date.now() })

 // Subscribe to changes (e.g., from database)
 const interval = setInterval(() => {
 send({ type: 'heartbeat', timestamp: Date.now() })
 }, 30000)

 // Cleanup on close
 // Note: In production, use proper cleanup mechanism
 },
 })

 return new Response(stream, {
 headers: {
 'Content-Type': 'text/event-stream',
 'Cache-Control': 'no-cache',
 'Connection': 'keep-alive',
 },
 })
}

// Client hook
function useSSE(url: string) {
 const [data, setData] = useState(null)

 useEffect(() => {
 const eventSource = new EventSource(url)

 eventSource.onmessage = (event) => {
 setData(JSON.parse(event.data))
 }

 eventSource.onerror = () => {
 eventSource.close()
 // Implement reconnection logic
 }

 return () => eventSource.close()
 }, [url])

 return data
}
```

## Typing Indicators  [HIGH freedom]

```tsx
function useTypingIndicator(channelName: string, userId: string) {
 const [typingUsers, setTypingUsers] = useState<string[]>([])
 const supabase = createClient()
 const timeoutRef = useRef<NodeJS.Timeout>()

 useEffect(() => {
 const channel = supabase.channel(channelName)

 channel
 .on('broadcast', { event: 'typing' }, ({ payload }) => {
 if (payload.userId !== userId) {
 setTypingUsers((prev) =>
 prev.includes(payload.userId) ? prev : [...prev, payload.userId]
 )

 // Remove after 3 seconds of no activity
 setTimeout(() => {
 setTypingUsers((prev) =>
 prev.filter((id) => id !== payload.userId)
 )
 }, 3000)
 }
 })
 .subscribe()

 return () => {
 supabase.removeChannel(channel)
 }
 }, [channelName, userId, supabase])

 const sendTyping = useCallback(() => {
 clearTimeout(timeoutRef.current)

 supabase.channel(channelName).send({
 type: 'broadcast',
 event: 'typing',
 payload: { userId },
 })
 }, [channelName, userId, supabase])

 return { typingUsers, sendTyping }
}
```

## Validation  [LOW freedom — do not skip]

After implementing real-time features:

1. **Connection handling** → Reconnects on disconnect, shows status
2. **Error handling** → Graceful degradation when real-time unavailable
3. **Memory leaks** → All subscriptions cleaned up on unmount
4. **Duplicate subscriptions** → No multiple listeners for same event
5. **Optimistic updates** → UI feels instant, handles conflicts
6. **Mobile** → Works on spotty connections, battery efficient
