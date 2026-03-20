---
title: Composition or Abstraction?
description: How to choose between joining simple pieces or creating a generic layer without turning flexibility into a mess.
summary: Not every repetition asks for abstraction. Sometimes simple composition leaves the system clearer and easier to change.
guideId: composition-vs-abstraction-without-theatre
locale: en
status: active
pillarId: patterns-that-actually-matter
branchId: composition-vs-abstraction
pubDate: 2026-01-21
updatedDate: 2026-01-25
category: Patterns That Actually Matter
topic: Composition or Abstraction
path:
  - Patterns That Actually Matter
  - Composition or Abstraction?
order: 10
relationships:
  - reuse-without-extra-complexity
tags:
  - patterns
  - architecture
  - abstraction
topicIds:
  - architecture-patterns
relatedDeckIds: []
---

## The problem

Much abstraction is born too early.

The team sees two similar parts, creates a generic layer to "avoid repetition," and soon the code looks smarter than it looks clear.

At first it seems elegant. Later, every change requires understanding an internal API that almost nobody wanted to have.

## Mental model

Good abstraction reduces mental load.

Bad abstraction hides an important difference behind a pretty interface.

That is why, before abstracting, it is worth asking:

> Am I simplifying the reading or only hiding variation too early?

Many times, simple composition solves it better.

## Breaking it down

A simple way to decide is this:

1. see whether the parts really change together
2. confirm whether the variation is already clear enough
3. test whether simple composition is still readable
4. abstract only when the new layer really reduces duplication and doubt

That avoids creating an internal tool for a problem that has not even matured yet.

## Simple example

Imagine three UI cards with small variations in title, CTA, and visual block.

A rushed response would be to create a `SuperCard` with dozens of props to cover every case.

A better response may be:

- keep a base container
- compose smaller parts
- leave each variant explicit where the difference really matters

In this case, composition preserves clarity without forcing everyone to learn a premature abstraction.

## Common mistakes

- abstracting at the first repetition
- treating any duplication as a defect
- hiding different rules behind the same interface
- creating a generic component that accepts everything and explains little

## How a senior thinks

A strong senior does not abstract to look sophisticated.

They abstract to reduce future friction.

That usually sounds like this:

> If this new layer does not make the intent clearer and the change cheaper, maybe it does not need to exist yet.

That question usually avoids a lot of excessive design.

## What the interviewer wants to see

In interviews, this usually shows maturity quickly:

- you know how to distinguish acceptable repetition from bad repetition
- you understand when simple composition is better than generalization
- you think about readability and evolution, not only about "dry code"

People who do this well look like someone who uses patterns as tools, not as trophies.

> Not every repetition asks for abstraction. Some ask for patience so the problem can show up better.

> If the new layer needs more explanation than the old code, maybe it still has not helped.
