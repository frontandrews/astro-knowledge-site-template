---
title: Reuse Without Extra Complexity
description: How to share code when it actually saves time, and how to stop before reuse starts making every case harder.
summary: Reuse helps when the shared behavior is stable. It hurts when it forces unrelated cases into one shape.
guideId: reuse-without-extra-complexity
locale: en
status: active
pillarId: patterns-that-actually-matter
branchId: reuse-vs-complexity
pubDate: 2026-02-18
updatedDate: 2026-02-22
category: Patterns That Actually Matter
topic: Reuse vs Complexity
path:
  - Patterns That Actually Matter
  - Reuse vs Complexity
order: 10
relationships:
  - composition-vs-abstraction-without-theatre
  - avoiding-overengineering-without-regret
tags:
  - patterns
  - reuse
  - complexity
topicIds:
  - architecture-patterns
relatedDeckIds: []
---

## The problem

Reuse sounds like a pure win until the shared code becomes the hardest part of the system to change.

Then every small variation turns into flags, special cases, and parameters that make the common code harder to trust.

## Mental model

Reuse is not the goal by itself.

The better question is:

> Will sharing this logic make future changes easier, or will it force different cases to move together when they should not?

That usually reveals whether the reuse is real or cosmetic.

## Breaking it down

Before sharing code, ask:

1. what is truly common here?
2. how stable is that shared behavior?
3. do these cases change for the same reasons?
4. what complexity will the shared version introduce?

Those questions protect you from expensive "dry" code.

## Simple example

Two forms might share input styling and validation helpers.

That is useful reuse.

But if one form creates invoices and the other manages profile settings, forcing both flows through one giant generic form engine can add more complexity than it removes because the behavior no longer changes for the same reason.

## Common mistakes

- reusing code just because it looks similar today
- merging cases that change for different reasons
- using configuration to hide that the shared code is doing too much
- treating duplication as always worse than indirection

## How a senior thinks

A senior engineer checks change patterns first:

> If these cases do not evolve together, forcing them into one shared path may cost more than the duplication I am trying to avoid.

That keeps reuse honest.

## What the interviewer wants to see

Interviewers usually want to know:

- you can evaluate reuse as a trade-off
- you understand the cost of indirection
- you can explain when duplication is actually the simpler choice

That is stronger than repeating "do not repeat yourself."

> Reuse only pays when the shared behavior is stable enough to deserve one shape.

> If the shared code keeps growing knobs, the reuse probably is already too expensive.
