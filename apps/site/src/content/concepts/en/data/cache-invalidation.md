---
title: Cache Invalidation
description: Why cache becomes dangerous when data changes, and why speed without an update strategy usually generates stale information.
summary: Cache invalidation is the process of deciding when cached data stopped being safe to serve and needs to be updated or removed.
conceptId: cache-invalidation
domainId: data
groupId: cache
locale: en
status: active
pubDate: 2026-03-19
tags:
  - cache
  - data
  - consistency
relatedGuideIds:
  - cache-and-consistency-without-self-deception
---

## What it is

Cache invalidation is how the system decides that fast data got too old to keep being reliable.

The hard part is not adding cache.

The hard part is keeping cache aligned with reality.

## When it matters

It matters when data changes underneath a response, page, object, or cached query.

That is when the system becomes fast and wrong at the same time.

## Common mistake

The common mistake is thinking TTL alone solves every case.

Sometimes it does, but many systems also need invalidation tied to write paths or events.

## Short example

If the price of a product changes in the database, a cached page may still show the old value until the cache expires.

If that delay is not acceptable, the write path needs to invalidate or update it first.

## Why it helps

This concept forces you to think about speed and correctness together.

And that is usually where cache decisions start getting mature.
