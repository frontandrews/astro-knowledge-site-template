---
title: Derived State
description: What derived state is, when it helps, and why copying values into state usually creates bugs.
summary: Derived state is data you can calculate from existing props or state without storing an extra copy.
conceptId: derived-state
domainId: react
groupId: state
locale: en
status: active
pubDate: 2026-03-19
tags:
  - react
  - state
  - ui
relatedGuideIds:
  - state-ownership-without-confusion
---

## What it is

Derived state is a value you can calculate from other values that already exist.

If `visibleItems` can be calculated from `items` and `query`, that is usually derived state.

## When it matters

It matters when a component starts mirroring props into state or storing two sources of truth at the same time.

That is how many UI bugs begin.

## Common mistake

The common mistake is saving a second copy just because it feels more practical.

Then you need to synchronize both sides manually.

## Short example

If a screen stores `items`, `query`, and `visibleItems` in state, the third value may be unnecessary.

In many cases, `visibleItems` should be calculated during render.

## Why it helps

The fewer places try to own the same truth, the easier it gets to understand the component.

That reduces stale UI and unnecessary update paths.
