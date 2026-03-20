---
title: Cache and Consistency Without Self-Deception
description: A practical way to think about caching without pretending stale data and invalidation rules will manage themselves.
summary: Caching helps only when you are honest about staleness, invalidation, and what consistency cost the product can accept.
guideId: cache-and-consistency-without-self-deception
locale: en
status: active
pillarId: data-and-persistence
branchId: cache-and-consistency
pubDate: 2026-01-17
updatedDate: 2026-01-19
category: Data & Persistence
topic: Cache and Consistency
path:
  - Data & Persistence
  - Cache and Consistency
order: 10
relationships:
  - sql-vs-nosql-without-slogans
tags:
  - cache
  - consistency
  - data
topicIds:
  - data-storage
relatedDeckIds: []
---

## The problem

Caching often gets introduced as a speed fix and only later becomes a correctness problem.

Then the team has a faster system that sometimes lies, and nobody can easily explain when the data should refresh.

## Mental model

A cache is not just a performance layer.

It is a trade-off:

- you reduce cost or latency
- you accept some staleness risk
- you take on invalidation complexity

That trade-off needs to be explicit.

## Breaking it down

Before caching something, ask:

1. what is expensive enough to justify caching?
2. how stale can the data be before the product breaks?
3. what event should invalidate or refresh the cache?
4. who owns the source of truth if the cache and database disagree?

Those questions usually decide whether the cache is worth it.

## Simple example

Caching a product catalog for a few minutes may be fine if prices do not change often and slight staleness is acceptable.

Caching account balance in the same loose way is far riskier because the product expectation around correctness is different.

The cache decision only makes sense once the consistency bar is clear.

## Common mistakes

- adding a cache before measuring the real bottleneck
- assuming time-based expiration is enough for every case
- forgetting to define invalidation ownership
- talking about the cache as if it were the source of truth

## How a senior thinks

A senior engineer asks two things together:

> What performance problem am I solving, and what consistency cost am I agreeing to accept?

That prevents a lot of accidental self-deception.

## What the interviewer wants to see

Interviewers usually want to know:

- you understand the performance benefit and the correctness cost
- you can reason about staleness and invalidation
- you know the cache is not the truth, only a faster copy

That is stronger than saying "I would add Redis" with no policy behind it.

> A cache is useful only if you can explain when it is allowed to be wrong.

> If the invalidation story is fuzzy, the design is not finished yet.
