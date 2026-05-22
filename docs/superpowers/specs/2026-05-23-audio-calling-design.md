# Audio Calling Design

**Date:** 2026-05-23  
**Scope:** Peer-to-peer audio calls between participants in the EGA mentorship platform chat.

---

## Problem

Participants can message each other but have no way to speak in real time. A call button in the chat gives them a direct, low-friction way to connect by voice without leaving the platform.

---

## Decisions

| Decision | Choice | Reason |
|---|---|---|
| Call type | Audio only | Simpler, lower bandwidth, better on mobile |
| Technology | WebRTC (browser-native) | Free, no external services, peer-to-peer |
| Signaling | Supabase Realtime Broadcast | Already in the stack; no extra infrastructure |
| Incoming notification | In-app ringing overlay | Works when the app is open; avoids service worker complexity |
| TURN server | Not in MVP | STUN covers ~85% of connections; TURN is a follow-up |

---

## Call Flow

### Outgoing (caller side)
1. Caller taps the `Phone` icon in the chat header.
2. Browser prompts for microphone permission (`getUserMedia`).
3. A "Calling [Name]…" overlay appears with a pulsing animation and a red Cancel button.
4. The caller creates an RTCPeerConnection, generates an SDP offer, and broadcasts it via the signaling channel.
5. ICE candidates are trickled out as they're gathered and broadcast as `call-ice` messages.
6. On receiving `call-answer` → `setRemoteDescription` → audio stream connects.
7. On receiving `call-reject` or 30-second timeout → show "No answer" briefly, then dismiss.
8. On receiving `call-end` → tear down connection.

### Incoming (recipient side)
1. A global `IncomingCallOverlay` (mounted in the dashboard layout) listens on the recipient's signaling channel.
2. When a `call-offer` arrives, the overlay animates in with caller name, a green Accept button, and a red Decline button.
3. Auto-declines after 30 seconds with no response.
4. **Accept:** browser requests microphone, creates RTCPeerConnection, calls `setRemoteDescription(offer)`, generates answer, broadcasts `call-answer`, trickles ICE candidates.
5. **Decline:** broadcasts `call-reject`, dismisses overlay.

### In-call (both sides)
- A compact `InCallBar` floats at the bottom of the chat (above mobile FABs).
- Shows: partner name · live duration timer · Mute toggle (mic icon) · End Call button (red).
- Pressing End Call broadcasts `call-end` and tears down the peer connection on both sides.
- Mute toggles `audioTrack.enabled` — does not renegotiate.

---

## Signaling Protocol

Each user subscribes to exactly **one personal inbox channel**: `call-inbox:${userId}`.

- To reach a partner, broadcast to `call-inbox:${partnerId}`.
- Messages always include `from: myUserId` so the receiver knows who to reply to.

| Message type | Payload | Sent to | Sender |
|---|---|---|---|
| `call-offer` | `{ from, fromName, sdp: RTCSessionDescriptionInit }` | `call-inbox:${partnerId}` | Caller |
| `call-answer` | `{ from, sdp: RTCSessionDescriptionInit }` | `call-inbox:${callerId}` | Recipient |
| `call-ice` | `{ from, candidate: RTCIceCandidateInit }` | `call-inbox:${partnerId}` | Either |
| `call-reject` | `{ from }` | `call-inbox:${callerId}` | Recipient |
| `call-end` | `{ from }` | `call-inbox:${partnerId}` | Either |

`IncomingCallOverlay` subscribes to `call-inbox:${currentUserId}` — a single channel per user. No need to know potential callers in advance.

ICE configuration:
```ts
const iceServers = [{ urls: "stun:stun.l.google.com:19302" }]
```

---

## Components & Files

### New files

| File | Purpose |
|---|---|
| `hooks/useCallSignaling.ts` | Subscribe to and send Broadcast messages on the call channel |
| `hooks/useWebRTCCall.ts` | RTCPeerConnection lifecycle: getUserMedia, offer/answer, ICE trickle, track handling |
| `components/features/chat/CallButton.tsx` | Phone icon button; disabled while a call is active |
| `components/features/chat/OutgoingCallOverlay.tsx` | "Calling…" modal with pulsing animation and Cancel |
| `components/features/chat/InCallBar.tsx` | Mute + End call + duration timer; shown when `callState === "connected"` |
| `components/features/chat/IncomingCallOverlay.tsx` | Global ringing screen; listens for `call-offer` on the current user's call channels |

### Modified files

| File | Change |
|---|---|
| `components/features/chat/MessageThread.tsx` | Add `CallButton` to header; add `OutgoingCallOverlay` and `InCallBar` conditionally |
| `app/dashboard/layout.tsx` | Import and render `IncomingCallOverlay` (it receives `currentUserId` from the server component) |

---

## State Machine

```
idle
 └─ (tap call btn) → calling
     ├─ (answer received) → connected
     │    └─ (end / remote end) → idle
     ├─ (reject received) → idle
     └─ (30s timeout) → idle

incoming
 └─ (accept) → connected
     └─ (end / remote end) → idle
 └─ (decline / timeout) → idle
```

Call state lives in a `useWebRTCCall` hook and drives which UI components are visible.

---

## Error Handling

- **Microphone denied:** Show a toast "Microphone access was denied. Allow it in browser settings." and return to idle.
- **Peer connection fails (`failed` ICE state):** Show "Call couldn't connect" and tear down.
- **Remote end disconnects unexpectedly:** `onconnectionstatechange` fires `disconnected/failed` → auto end call, show brief "Call ended".

---

## Out of Scope (MVP)

- TURN relay server (needed only for ~15% of users behind strict NAT)
- Call history / log in the database
- Video calling
- Push notifications for calls when the app is in the background
- Calling from the participant list or profile page
