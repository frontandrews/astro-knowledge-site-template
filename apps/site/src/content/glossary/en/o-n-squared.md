---
title: O(n²)
description: What O(n²) means, why nested loops often fall into it, and when it actually matters.
summary: O(n²) usually appears when work grows with each pairwise comparison or with each new full scan.
termId: o-n-squared
locale: en
status: active
aliases:
  - quadratic-time
tags:
  - coding-interview
  - javascript
pubDate: 2026-03-18
---

## What it means

`O(n²)` means that the amount of work grows roughly with the square of the input size.

If the input doubles, the work can become close to four times bigger.

That is why small examples seem calm, but larger inputs suddenly become slow.

## Common shape

The classic case is one loop inside another where each item is compared with many other items.

```ts
for (let i = 0; i < items.length; i += 1) {
  for (let j = 0; j < items.length; j += 1) {
    compare(items[i], items[j])
  }
}
```

That is not the only way to reach `O(n²)`, but it is the most common shape to recognize quickly.

## When it matters

`O(n²)` is not automatically wrong.

It becomes a problem when:

- `n` can grow a lot
- the operation inside the loop is expensive
- the code runs often enough to affect experience or cost

If `n` is small and fixed, a quadratic solution may still be acceptable.

## Better question

Do not ask only "is this O(n²)?"

Ask:

1. what size can `n` actually reach?
2. how often does this run?
3. can hash map, set, sort, or preprocessing be used to avoid repeated scans?

That framing almost always helps more than complexity theatre by itself.
