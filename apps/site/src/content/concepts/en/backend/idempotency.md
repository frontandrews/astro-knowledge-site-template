---
title: Idempotency
description: What idempotency means in APIs and jobs, and why repeating the same request should not repeat the same effect.
summary: Idempotency is the property of repeating the same operation without continuing to create new effects after the first useful result.
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

Idempotency means being able to repeat the same operation without generating a new side effect every time.

That matters when a client, worker, or external integration may resend the same intent.

## When it matters

It matters in payments, webhooks, jobs, and any flow where retry is normal behavior.

Without it, a retry can create a duplicate order, duplicate email, or inconsistent state.

## Common mistake

The common mistake is treating every retry as a new command.

That usually works until the first timeout or partial error.

## Short example

If `POST /orders` is resent after a timeout, the system may need an idempotency key to recognize that the intent is the same.

That way the second request returns the same result instead of creating another order.

## Why it helps

Idempotency makes failure handling calmer.

Retry stops looking like a dangerous guess and becomes planned behavior.
