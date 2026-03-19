---
title: Cache Invalidation
description: Why caches become dangerous when the data changes, and why speed without update strategy often creates stale behavior.
summary: Cache invalidation is the process of deciding when cached data is no longer safe to serve and needs refresh or removal.
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

Cache invalidation is how a system decides that stored fast data is now old enough to stop trusting.

The hard part is not adding a cache.

The hard part is keeping the cache aligned with reality.

## When it matters

It matters when data changes underneath a cached response, page, object, or query result.

That is where systems feel fast and wrong at the same time.

## Common mistake

The common mistake is thinking TTL alone solves every case.

Sometimes it is enough, but many systems also need explicit invalidation tied to writes or events.

## Short example

If a product price changes in the database, a cached product page may still show the old value until the cache expires.

If that delay is unacceptable, the write path needs a way to invalidate or refresh the cache earlier.

## Why it helps

This concept forces you to think about speed and correctness together.

That is usually where mature cache decisions start.
