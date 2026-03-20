---
title: Effects Without the Mess
description: A simpler way to use effects without turning them into a pile of accidental synchronization bugs.
summary: Effects get safer when you treat them as a bridge to the outside world, not as a generic place for logic.
guideId: effects-without-the-mess
locale: en
status: active
pillarId: state-and-ui-thinking
branchId: effects-and-side-effects
pubDate: 2026-01-24
updatedDate: 2026-01-26
category: State & UI Thinking
topic: Effects and Side Effects
path:
  - State & UI Thinking
  - Effects and Side Effects
order: 10
relationships:
  - state-ownership-without-confusion
  - server-and-client-thinking-without-confusion
tags:
  - react
  - effects
  - ui
topicIds:
  - react
relatedDeckIds: []
---

## The problem

Effects often become a dumping ground for logic that the component did not know where to place.

Then fetching, subscriptions, derived values, and UI fixes all get mixed together, and every dependency change feels dangerous.

## Mental model

An effect is not a generic place for "code that runs later."

It is a bridge between your component and something outside render, such as the network, timers, subscriptions, or imperative APIs.

If the code does not need that bridge, it probably should not be in an effect.

## Breaking it down

Before you write an effect, ask:

1. what outside system am I synchronizing with?
2. could this value be derived during render instead?
3. what should start when the effect runs?
4. what should stop when the effect cleans up?

That makes the effect smaller and easier to trust.

## Simple example

Fetching a user when `userId` changes is a real effect because it synchronizes with the network.

Computing `visibleUsers` from `users` and `search` is not. That belongs in render.

The more you separate those cases, the fewer effect bugs you create.

## Common mistakes

- using an effect to derive values that could be computed directly
- packing unrelated responsibilities into one effect
- ignoring cleanup for subscriptions, listeners, or timers
- fighting dependency arrays instead of fixing the design

## How a senior thinks

A senior engineer does not ask "how do I silence the dependency warning?"

They ask:

> What outside system am I syncing with, and does this logic really belong in an effect at all?

That question usually fixes more than the dependency array itself.

## What the interviewer wants to see

Interviewers usually want to know:

- you understand what effects are for
- you can separate synchronization from derived render logic
- you can reason about dependencies and cleanup

That signals fewer accidental bugs in real UI code.

> Effects get clearer when they sync with one outside thing at a time.

> If there is no outside system involved, there is a good chance you do not need an effect.
