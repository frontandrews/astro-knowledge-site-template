---
title: Writing Code People Can Read
description: A simpler way to choose names, structure, and abstraction level without turning code into a puzzle.
summary: Good code is not the code that looks clever. It is the code another person can understand without pain.
guideId: writing-code-people-can-read
locale: en
status: active
pillarId: thinking-like-a-senior
branchId: code-for-humans
pubDate: 2026-03-17
updatedDate: 2026-03-19
category: Thinking Like a Senior
topic: Code for Humans
path:
  - Thinking Like a Senior
  - Code for Humans
order: 10
relationships:
  - trade-offs-and-constraints-without-fake-certainty
tags:
  - senior-thinking
  - readability
  - code-quality
topicIds:
  - delivery
relatedDeckIds: []
---

## The problem

Some code works, passes tests, and still slows the whole team down.

Not because the logic is hard.

Because every name needs interpretation, every function mixes responsibilities, and every abstraction asks for more context than it gives back.

## Mental model

Code is not only instructions for a machine.

It is also an explanation for the next person who will read, review, or change it.

If every line needs decoding before it can be trusted, the issue is not the reader. The code is charging too much context.

## Breaking it down

A simple way to write clearer code is:

1. choose names that explain intent, not implementation detail
2. keep each function focused on one visible responsibility
3. keep code that changes together close together
4. extract abstraction only when it truly simplifies the reading

The goal is not to make everything shorter.

The goal is to make the code clear enough for someone else to continue without guessing.

## Simple example

```ts
function p(u) {
  return u.filter((x) => x.a).map((x) => x.n)
}
```

It works, but you have to decode what `p`, `u`, `a`, and `n` mean before you can trust it.

A clearer version is:

```ts
function getActiveUserNames(users: User[]) {
  return users.filter((user) => user.isActive).map((user) => user.name)
}
```

That improves understanding speed, not just aesthetics.

## Common mistakes

- using names that are short only to look elegant
- splitting everything into tiny functions that hide the main line
- extracting abstraction too early
- treating "dry" as more important than readability

## How a senior thinks

A senior engineer does not write code to impress.

They write to reduce friction:

> If I come back to this in three months, will I still understand quickly what this block does and why it exists?

That question usually improves naming, structure, and abstraction level by itself.

## What the interviewer wants to see

Interviewers often notice a few things fast:

- do your names help or hurt?
- is the main line of the solution easy to follow?
- do you know when to extract a function and when to leave code together?

Readable code usually signals more maturity than code that tries to sound sophisticated.

> Good code is not the code that looks smart. It is the code that stays clear when another person touches it.

> If the abstraction made the reading harder, it probably did not help.
