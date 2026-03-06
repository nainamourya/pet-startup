# State Management Best Practices for API Actions in React

When building dynamic React applications, like your Pet Sitter booking platform, ensuring the UI remains perfectly in sync with the backend data is crucial. Here are the best practices to automatically update your UI without manual browser refreshes:

## 1. Optimistic UI Updates (Local React State)
The fastest way to give users feedback is to update the local React state *before* or *immediately after* the API request succeeds, without doing a full re-fetch.

**Example from `MyBookings.jsx`:**
```jsx
const cancelBooking = async (id) => {
  try {
    // 1. Send the API request
    const res = await fetch(`/api/bookings/${id}/cancel`, { method: "PATCH" });
    if (!res.ok) throw new Error("Failed");

    // 2. Optimistically update local state immediately (No full page reload!)
    setBookings(prevBookings => 
      prevBookings.map(b => b._id === id ? { ...b, status: 'cancelled' } : b)
    );
    
    // UI updates instantly. No `setLoading(true)` full-screen spinners required.
  } catch (err) {
    // 3. (Optional) Revert optimistic state if request fails
    alert("Cancellation failed");
  }
};
```

## 2. Background Refetching
If you must refetch a list to ensure data integrity (e.g., balance updates where you need the exact number from the DB), fetch it in the background without triggering the main loading state.

**Example:**
```jsx
// Instead of setting the entire page to loading:
const fetchHistoryBackground = async () => {
  const res = await fetch(`/api/withdrawals/history`);
  const data = await res.json();
  setWithdrawalHistory(data.withdrawals); // Replaces state quietly without mounting spinners
};
```

## 3. Real-Time Updates (WebSockets / Socket.io)
Your app correctly uses `socket.io` for listening to status changes.
```jsx
useEffect(() => {
  socket.on("status-updated", ({ bookingId, status }) => {
    setBookings((prev) =>
      prev.map((b) => b._id === bookingId ? { ...b, status } : b)
    );
  });
  return () => socket.off("status-updated");
}, []);
```
**Best Practice:** Ensure your server emits these socket events during every critical POST/PATCH request (like cancel, accept, decline).

## 4. Preventing Browser/API Caching
Sometimes data doesn't update because the browser serves a cached GET request. To prevent this, ensure your backend sends standard `Cache-Control: no-cache` headers, or fetch using a unique timestamp.

```jsx
// Option: Cache-busting via timestamp
fetch(`/api/bookings?ownerId=${id}&t=${new Date().getTime()}`);
```

## 5. Next-Level: Auto-Refetching with React Query (Recommended for V2)
In the future, moving to data-fetching libraries like `@tanstack/react-query` or `SWR` automates all of this. It eliminates `useEffect` fetching, `loading` state variables, and handles caching/refetching automatically.

**Example using React Query:**
```jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function MyBookings() {
  const queryClient = useQueryClient();

  // 1. Fetch data automatically
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => fetch('/api/bookings').then(res => res.json())
  });

  // 2. Mutation for POST/PATCH
  const cancelMutation = useMutation({
    mutationFn: (id) => fetch(`/api/bookings/${id}/cancel`, { method: 'PATCH' }),
    onSuccess: () => {
      // 3. Automatically invalidate and trigger a background refetch
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    }
  });

  return (
    <button onClick={() => cancelMutation.mutate(bookingId)}>
      Cancel
    </button>
  );
}
```
**Benefits:**
- Instantly refreshes when window regains focus.
- Background updating without flashing loading spinners.
- Auto-retries on failure.
