---
title: Event Loop
description: What the event loop coordinates and why asynchronous JavaScript often runs in an order that surprises people.
summary: The event loop is the mechanism that decides when queued work gets its turn after the current stack finishes.
conceptId: event-loop
domainId: javascript
groupId: runtime
locale: en
status: active
pubDate: 2026-03-19
tags:
  - javascript
  - async
  - runtime
relatedGuideIds:
  - javascript-event-loop
---

## What it is

The event loop coordinates when queued work can run after the current synchronous work ends.

That is why promises, timers, and callbacks do not all execute at the same moment they appear in the code.

## When it matters

It matters when you are debugging execution order, async bugs, or JavaScript interview questions.

Without separating stack, queue, and scheduling, the behavior looks random.

## Common mistake

A common mistake is saying only "async code runs later" without explaining what that "later" means.

That does not help either to debug or to explain it properly.

## Short example

If you do `console.log('A')`, schedule a promise callback, and then do `console.log('B')`, the synchronous logs finish first.

Only after that does the queued callback get its turn.

## Why it helps

When you think in terms of execution order instead of only looking at syntax, many bugs become much easier to explain.

That is the real gain of the concept.
