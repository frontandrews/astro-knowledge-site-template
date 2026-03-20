---
title: Who Owns This State?
description: A simple way to decide what should be state, what can be derived, and what should not exist at all.
summary: A large part of UI bugs begins when you store too much state or store it in the wrong place.
guideId: state-ownership-without-confusion
locale: en
status: active
pillarId: state-and-ui-thinking
branchId: state-ownership
pubDate: 2026-03-05
updatedDate: 2026-03-09
category: State and UI
topic: State
path:
  - State and UI
  - Who Owns This State?
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

Many interfaces become confusing because the team starts storing state before deciding whether that value really needs to exist as state.

Soon the same data appears in two places, one screen depends on another to stay coherent, and the bug looks "random."

Most of the time, the problem is not React. The problem is poorly resolved ownership.

## Mental model

Good state is state with a clear owner.

If a value can be calculated from something else, maybe it does not need to be stored again.

If two different parts of the interface depend on the same value, someone needs to be the source of truth.

## Breaking it down

When you look at a value in the UI, try to answer:

1. does this need to change with user interaction?
2. can this be calculated from props or from other state?
3. who should be the source of truth?
4. does this value need to be shared, or can it stay local?

These questions avoid a lot of invented state with no need.

## Simple example

Imagine a user list and a search field.

A bad approach would be storing:

- `users`
- `search`
- `filteredUsers`

The problem is that `filteredUsers` can be derived from `users` and `search`.

A better approach would be storing only:

- `users`
- `search`

And calculating `filteredUsers` during rendering.

That way you reduce unnecessary synchronization and lower the chance of stale data.

## Common mistakes

- storing state that could be derived
- creating two sources of truth for the same value
- lifting state too early without real need
- spreading shared state without defining ownership

## How a senior thinks

A strong senior does not ask first "where do I put this state?"

They ask:

> Does this value really need to exist as state, or can I derive it from somewhere else?

That question usually simplifies the screen before any refactor.

## What the interviewer wants to see

In interviews, this usually reveals a lot of maturity:

- you know how to differentiate real state from a derived value
- you understand source of truth
- you know how to justify why something should be local or shared

People who do this well give the impression of building interfaces with fewer bugs and less friction.

> Too much state looks like flexibility at the beginning and bad maintenance soon after.

> If you do not know who owns the value, the state is probably still not modeled well.
