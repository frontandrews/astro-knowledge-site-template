---
title: Reuse Without Overcomplicating
description: How to share logic and structure without turning the code into a fragile dependency web that is hard to understand.
summary: Good reuse saves future work. Bad reuse spreads coupling and makes every change more expensive.
guideId: reuse-without-extra-complexity
locale: en
status: active
pillarId: patterns-that-actually-matter
branchId: reuse-vs-complexity
pubDate: 2026-02-18
updatedDate: 2026-02-22
category: Patterns That Actually Matter
topic: Reuse Without Overcomplicating
path:
  - Patterns That Actually Matter
  - Reuse Without Overcomplicating
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

Reuse always looks like a good idea at the beginning.

If two parts do something similar, the temptation is to merge everything quickly so you "do not duplicate."

The problem is that bad reuse does not eliminate cost. It only moves the cost to later, in the form of coupling and behavior that is hard to change.

## Mental model

Reusing does not mean sharing just anything.

It means sharing what truly changes together and still makes sense in the same place.

The useful question here is usually:

> Am I removing real duplication or only gluing similar things together too early?

## Breaking it down

A simple way to decide better is this:

1. see whether the cases really have the same responsibility
2. check whether they change for the same reasons
3. measure the cost of understanding the shared layer
4. extract only when reuse reduces repeated change without making reading worse

That helps avoid a generic utility that everyone uses and nobody likes.

## Simple example

Imagine two email-sending flows.

Both build a message, call a provider, and register a log.

If the main rule is the same, it may make sense to share part of the flow.

But if one sends onboarding and the other sends a critical alert, maybe what looks like reuse is only superficial coincidence.

Joining them too early can hide differences in priority, retry, auditing, and template.

## Common mistakes

- extracting code at the first similarity
- sharing something that changes for different reasons
- creating a generic utility that accepts too many parameters
- treating small duplication as a bigger sin than structural complexity

## How a senior thinks

A strong senior reuses with judgment, not by reflex.

That usually sounds like this:

> If the cost of understanding the shared layer becomes bigger than repeating a little bit now, maybe the reuse still does not pay off.

That question usually protects the system from coupling that looks nice on paper and bad in maintenance.

## What the interviewer wants to see

In interviews, this usually shows maturity quickly:

- you understand that reuse also has a cost
- you know how to evaluate joint change, not only visual similarity
- you protect readability and system evolution

People who do this well look like someone who knows when to share and when to leave things separate without guilt.

> Reuse is not valuable just because it exists. It is valuable when it reduces future work without increasing confusion.

> If everything depends on the same shared layer, any small change can become too big.
