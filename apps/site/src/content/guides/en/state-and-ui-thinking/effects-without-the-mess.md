---
title: Effects Without Mess
description: How to use effects without turning synchronization, fetches, and side events into a pile of hard-to-predict behavior.
summary: A good effect synchronizes with the outside world. A bad effect tries to control the whole screen.
guideId: effects-without-the-mess
locale: en
status: active
pillarId: state-and-ui-thinking
branchId: effects-and-side-effects
pubDate: 2026-01-24
updatedDate: 2026-01-26
category: State and UI
topic: Effects
path:
  - State and UI
  - Effects Without Mess
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

An effect becomes a mess when it starts being used as a tool to fix anything strange in the screen.

Suddenly there is `useEffect` to derive state, synchronize a value that did not even need to exist, and patch execution order.

The code may work for a while, but it becomes hard to predict when something runs and why it runs.

## Mental model

An effect does not exist to control render.

An effect exists to synchronize the interface with something outside:

- network
- timer
- listener
- imperative DOM
- external integration

If the logic can happen during rendering or in a user event, it probably does not need to be in an effect.

## Breaking it down

Before creating an effect, try to answer:

1. which external system am I synchronizing with?
2. could this be calculated during render?
3. should this happen because of a specific interaction?
4. is the cleanup clear when this effect stops being valid?

These questions eliminate a lot of unnecessary effects.

## Simple example

Imagine this case:

```tsx
const [filteredUsers, setFilteredUsers] = useState<User[]>([])

useEffect(() => {
  setFilteredUsers(users.filter((user) => user.name.includes(search)))
}, [users, search])
```

This looks normal, but `filteredUsers` is derived from `users` and `search`.

In other words: this effect is serving to keep a piece of state synchronized that did not even need to exist.

A better version is to calculate it directly:

```tsx
const filteredUsers = users.filter((user) => user.name.includes(search))
```

Now reading gets better and one unnecessary synchronization point disappears.

## Common mistakes

- using an effect to derive state
- putting event logic inside an effect without need
- depending on an effect to "fix" render order
- forgetting cleanup in timer, listener, or subscription

## How a senior thinks

A strong senior does not ask only "which dependency goes in the array?"

They ask:

> Am I synchronizing with something external, or only trying to compensate for bad state modeling?

That question usually cuts half of the effects before they are even born.

## What the interviewer wants to see

In interviews, this usually shows a lot of maturity:

- you understand what an effect is for
- you know how to differentiate external synchronization from internal derivation
- you think about cleanup and predictability

People who do this well look like someone who builds interfaces with less surprise and fewer timing bugs.

> A good effect brings the screen closer to the outside world. A bad effect tries to patch modeling holes.

> If there is no external system involved, maybe the effect does not need to exist.
