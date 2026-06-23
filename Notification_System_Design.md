# Stage 1

## Approach for Priority Inbox
To determine the top 10 notifications efficiently, each notification is evaluated based on a custom weight assignment:
- Placement = 3
- Result = 2
- Event = 1

When a batch of notifications is retrieved, they are sorted using a multi-level comparator that prioritizes higher weights. If weights are equal, the items are sorted chronologically by their timestamps in descending order (recency).

## Maintaining Top 10 Efficiently with Incoming Streams
To handle streaming or continuous incoming notifications without resorting the entire dataset (which is inefficient), we can use a **Min-Heap (Priority Queue)** data structure capped at a size of $k = 10$.

1. As a new notification arrives, we compute its priority score.
2. If the heap has fewer than 10 items, we insert it directly.
3. If the heap is full, we compare the new item with the root element (the minimum priority element currently in our top 10).
4. If the new item has a higher priority than the root, we extract the root and insert the new item.

This keeps the processing time for each incoming notification extremely fast at $O(\log 10)$, ensuring optimal real-time performance.