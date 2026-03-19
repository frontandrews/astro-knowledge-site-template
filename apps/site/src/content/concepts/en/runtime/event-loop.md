---
title: Event Loop
description: What the event loop coordinates, and why async JavaScript often runs in an order that surprises people.
summary: The event loop is the mechanism that decides when queued work gets a turn after the current call stack finishes.
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

The event loop coordinates when queued work can run after the current synchronous work is done.

It is part of why promises, timers, and callbacks do not all run immediately when you see them in code.

## When it matters

It matters when you debug ordering issues, racey UI behavior, or interview questions about async JavaScript.

If you do not separate stack, queue, and scheduling, the behavior feels random.

## Common mistake

A common mistake is saying "async runs later" without explaining what "later" means.

That answer is too vague to help with real debugging.

## Short example

If you call `console.log('A')`, schedule a promise callback, then call `console.log('B')`, the synchronous logs finish first.

Only after the current stack clears does the queued callback get a turn.

## Why it helps

Once you think in execution order instead of syntax alone, many async bugs become easier to explain.

That is the real value of the concept.
