---
title: Writing Code People Can Understand
description: A simple way to decide names, structure, and level of abstraction without turning the code into a puzzle.
summary: Good code is not the code that looks smart. It is the code another person can understand without suffering.
guideId: writing-code-people-can-read
locale: en
status: active
pillarId: thinking-like-a-senior
branchId: code-for-humans
pubDate: 2026-03-17
updatedDate: 2026-03-19
category: Thinking Like a Senior
topic: Code That Is Easy to Understand
path:
  - Thinking Like a Senior
  - Code That Is Easy to Understand
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

Some code works, passes tests, and still makes everyone slower.

Not because the logic is hard.

But because every name demands interpretation, every function mixes responsibilities, and every abstraction seems to ask for more context than it gives back.

## Mental model

Code is not only instruction for the machine.

Code is also an explanation for the next person who will read, review, or change it.

If you need to stop at every line to decode the intent, the problem is not lack of intelligence. The code is demanding too much context.

## Breaking it down

A simple way to write better is this:

1. choose names that explain intent, not implementation
2. keep a function focused on one visible responsibility
3. keep code that changes together close together
4. extract abstraction only when it really simplifies reading

The goal is not to make everything short.

The goal is to make it clear enough that another person can continue without guessing.

## Simple example

Imagine this code:

```ts
function p(u) {
  return u.filter((x) => x.a).map((x) => x.n)
}
```

It works.

But you need to discover what `p`, `u`, `a`, and `n` mean before you can trust what is happening.

A better version would be:

```ts
function getActiveUserNames(users: User[]) {
  return users.filter((user) => user.isActive).map((user) => user.name)
}
```

Now the reading is almost immediate.

You did not gain only beauty. You gained speed of understanding.

## Common mistakes

- using names that are too short to seem elegant
- breaking everything into small functions that hide the main line
- creating abstraction too early
- prioritizing "dry code" when reading would get worse

## How a senior thinks

A strong senior does not write to impress.

They write to reduce friction.

That usually sounds like this:

> If I come back here in three months, will I still understand quickly what this block does and why it exists?

That question usually improves names, structure, and level of abstraction almost by itself.

## What the interviewer wants to see

In interviews, this appears in a simple way:

- do your names help or get in the way?
- does your solution have a main line that is easy to follow?
- do you know when to extract a function and when to keep it together?

People who write readable code usually look more mature than people trying to sound sophisticated.

> Good code is not the code that looks clever. It is the code that stays clear when another person touches it.

> If reading got harder after the abstraction, maybe it did not help.
