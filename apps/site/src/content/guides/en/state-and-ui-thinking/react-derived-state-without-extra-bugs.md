---
title: React Derived State Without Extra Bugs
description: Why copying props into state often creates more problems than it solves, and what to reach for instead.
summary: A cleaner mental model for derived state questions in React interviews.
guideId: react-derived-state
locale: en
status: archived
pubDate: 2026-03-17
category: State & UI Thinking
topic: React
path:
  - State & UI Thinking
  - State Ownership
order: 10
relationships:
  - javascript-event-loop
takeaways:
  - "Treat duplicated state as a synchronization risk, not as a convenience."
  - "Derive cheap values during render instead of copying props into state."
  - "Reach for memoization before inventing extra state."
practiceChecklist:
  - "Explain why duplicated state creates two sources of truth."
  - "Name the safer default: derive during render."
  - "Mention when separate state is justified, such as drafts or optimistic UI."
tags:
  - react
  - state
  - rendering
relatedDeckIds:
  - react-rendering-core
---

Derived state usually sounds harmless when you first hear the idea.

You already have some input coming from props, you need a value that looks slightly different, and putting that into local state feels like the straightforward move. The problem is that you have now created two places that both look like sources of truth.

That is the real bug pattern to talk about in interviews.

## What goes wrong

When someone copies props into state, the component now has to keep those two values synchronized over time.

That tends to produce one of these outcomes:

- the copied value goes stale after a prop change
- `useEffect` gets added just to keep state in sync
- edge cases appear around reset logic
- the component becomes harder to reason about because the “real” value is no longer obvious

The bug is not only technical. It is architectural. You are increasing the number of moving parts for something that could often be computed during render.

## The better default

Store the smallest real source of truth possible and derive everything else from it.

If the derived value is cheap, compute it directly during render:

```tsx
function UserList({ users, search }: { users: User[]; search: string }) {
  const visibleUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()),
  )

  return <Results users={visibleUsers} />
}
```

If the computation is genuinely expensive, memoization is usually the first thing to try before adding more state:

```tsx
const visibleUsers = useMemo(() => {
  return users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()),
  )
}, [users, search])
```

## When state is actually justified

Sometimes you are not storing a derived value. You are storing a user-controlled draft, a local interaction state, or a value that intentionally diverges from the prop after initialization.

That is different.

For example:

- a form starts from server data but the user edits it locally
- a modal starts open or closed from a prop, then becomes locally controlled
- you need optimistic UI state that temporarily diverges from backend truth

In those cases, the answer is not “never use state.” The answer is “be explicit about why that state exists.”

## Strong interview framing

A stronger answer sounds like this:

> Derived state is dangerous when it duplicates something that can already be computed from props or existing state. That creates synchronization problems and stale data. My default is to keep the real source of truth as small as possible, derive values during render, and only add memoization or separate state when there is a real performance or UX reason.

That framing shows you understand the tradeoff, not just the slogan.
