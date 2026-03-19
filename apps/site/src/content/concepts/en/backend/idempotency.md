---
title: Idempotency
description: What idempotency means in APIs and jobs, and why repeating the same request should not always repeat the same side effect.
summary: Idempotency is the property that repeating the same operation does not keep creating new effects after the first successful result.
conceptId: idempotency
domainId: backend
groupId: apis
locale: en
status: active
pubDate: 2026-03-19
tags:
  - api
  - backend
  - reliability
relatedGuideIds:
  - api-and-service-design-with-clear-boundaries
  - failure-and-recovery-scenarios-with-clarity
---

## What it is

Idempotency means you can retry the same operation without producing a new side effect each time.

This is especially important when clients, workers, or external systems may send the same request more than once.

## When it matters

It matters in payment flows, webhooks, background jobs, and any system where retries are normal.

Without it, retrying can create duplicate orders, duplicate emails, or inconsistent state.

## Common mistake

The common mistake is treating every retry as a brand new command.

That works until the first timeout, retry, or partially failed request.

## Short example

If `POST /orders` is retried after a timeout, the system may need an idempotency key to recognize that the intent is the same.

That way the second request can return the existing result instead of creating a second order.

## Why it helps

Idempotency makes failure handling calmer.

You stop treating retries as dangerous guesses and start treating them as planned behavior.
