---
title: Derived State
description: What derived state is, when it helps, and why copying values into state often creates bugs.
summary: Derived state is data you can compute from other state or props instead of storing again.
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
  - react-derived-state
---

## What it is

Derived state is a value you can calculate from other values you already have.

If `filteredItems` can be computed from `items` and `query`, that is usually derived state.

The key idea is simple: if you can recompute it safely, you often do not need to store it separately.

## When it matters

This matters when a component starts mirroring props into state or keeps multiple values that can drift apart.

That is where UI bugs usually start to look random even though the real problem is duplicated truth.

## Common mistake

The common mistake is storing a second copy just because it feels convenient.

That usually creates synchronization work you did not need.

## Short example

If a list screen stores `items`, `query`, and `visibleItems` in state, the third value may be unnecessary.

In many cases, `visibleItems` should just be computed from `items` and `query` during render.

## Why it helps

The fewer places that own the same truth, the easier the component is to reason about.

That reduces stale UI, effect churn, and weird update paths.
