---
title: Composition vs Abstraction Without Theatre
description: How to keep systems flexible without turning the code into generic layers that hide the real work.
summary: Strong abstractions reduce friction. Weak abstractions only move the complexity farther away.
guideId: composition-vs-abstraction-without-theatre
locale: en
status: active
pillarId: patterns-that-actually-matter
branchId: composition-vs-abstraction
pubDate: 2026-01-21
updatedDate: 2026-01-25
category: Patterns That Actually Matter
topic: Composition vs Abstraction
path:
  - Patterns That Actually Matter
  - Composition vs Abstraction
order: 10
relationships:
  - reuse-without-extra-complexity
tags:
  - patterns
  - composition
  - abstraction
topicIds:
  - architecture-patterns
relatedDeckIds: []
---

## The problem

Teams often create abstractions to avoid duplication and end up hiding the main logic behind generic layers.

The code looks reusable, but simple changes suddenly require understanding a framework that only exists inside the codebase.

## Mental model

Composition and abstraction are not enemies.

The real question is:

> Does this abstraction reduce the amount of context the next change needs, or does it add another layer to decode?

If it adds more decoding than clarity, it is probably not helping.

## Breaking it down

Before extracting an abstraction, ask:

1. what repeated shape am I really seeing?
2. are these cases stable enough to deserve one abstraction?
3. would composition keep the behavior clearer?
4. does the abstraction simplify change or only reduce visible duplication?

That keeps the pattern tied to maintenance, not elegance.

## Simple example

Suppose three pages share a layout wrapper, a data card, and a button group.

Composing those pieces is often enough.

Creating a giant "universal page orchestrator" to hide all three usually creates more work because every new variation has to fight the abstraction instead of using the smaller pieces directly.

## Common mistakes

- abstracting after only one or two weak similarities
- hiding the main line of the feature behind generic names
- optimizing for fewer lines instead of clearer change paths
- confusing reuse with a mandate for one big abstraction

## How a senior thinks

A senior engineer wants the code to stay adaptable:

> I will abstract only when the shared shape is stable enough and the result makes the next change easier to understand.

That usually leads to cleaner systems.

## What the interviewer wants to see

Interviewers usually want to know:

- you can tell the difference between helpful reuse and generic mush
- you understand when composition is enough
- you can justify why an abstraction earns its place

That is stronger than pattern vocabulary alone.

> A good abstraction removes context. A bad abstraction only relocates it.

> If the abstraction makes simple cases harder to see, it probably arrived too early.
