---
title: State Ownership Without Confusion
description: A simple way to decide what should be state, what can be derived, and what should not exist at all.
summary: A lot of UI bugs start when you store too much state or store it in the wrong place.
guideId: state-ownership-without-confusion
locale: en
status: active
pillarId: state-and-ui-thinking
branchId: state-ownership
pubDate: 2026-03-11
updatedDate: 2026-03-15
category: State & UI Thinking
topic: State Ownership
path:
  - State & UI Thinking
  - State Ownership
order: 10
relationships:
  - server-and-client-thinking-without-confusion
  - effects-without-the-mess
tags:
  - react
  - state
  - ui
topicIds:
  - react
relatedDeckIds:
  - react-rendering-core
---

## The problem

Many UIs become messy because the team starts storing state before deciding whether that value really needs to exist as state.

Then the same information appears in two places, one screen depends on another to stay coherent, and the bug starts looking random.

Most of the time, the issue is not React. The issue is unclear ownership.

## Mental model

Good state has a clear owner.

If a value can be computed from something else, maybe it does not need to be stored again.

If different parts of the UI depend on the same value, something has to be the source of truth.

## Breaking it down

When you look at a value in the UI, ask:

1. does it need to change because of user interaction?
2. can it be computed from props or other state?
3. who should own the source of truth?
4. does it need to be shared or can it stay local?

Those questions prevent a lot of invented state.

## Simple example

Imagine a user list and a search field.

A weak approach stores:

- `users`
- `search`
- `filteredUsers`

But `filteredUsers` can be derived from `users` and `search`.

A cleaner version stores only:

- `users`
- `search`

Then it derives `filteredUsers` during render and avoids synchronization bugs.

## Common mistakes

- storing state that could be derived
- creating two sources of truth for the same value
- lifting state too early with no clear reason
- spreading shared state around without defining ownership

## How a senior thinks

A senior engineer does not ask first "where should I put this state?"

They ask:

> Does this value really need to exist as state, or can I derive it from somewhere else?

That question simplifies the screen before any refactor starts.

## What the interviewer wants to see

Interviewers usually want to know:

- you can separate real state from derived values
- you understand source of truth
- you can justify why something should stay local or be shared

That signals fewer bugs and clearer UI architecture.

> Too much state feels flexible at first and expensive soon after.

> If you do not know who owns the value, the state probably is not modeled well yet.
