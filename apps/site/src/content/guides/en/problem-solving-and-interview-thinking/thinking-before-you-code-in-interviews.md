---
title: Thinking Before You Code in Interviews
description: A repeatable way to avoid writing the wrong solution too early during coding interviews.
summary: Clarify the shape, test the naive path, then code the smallest correct version first.
guideId: thinking-before-you-code-in-interviews
locale: en
status: active
pillarId: problem-solving-and-interview-thinking
branchId: approach-and-framing
pubDate: 2026-03-17
category: Problem Solving & Interview Thinking
topic: Coding Interviews
path:
  - Problem Solving & Interview Thinking
  - Approach and Framing
order: 10
relationships:
  - breaking-down-problems-without-panic
takeaways:
  - "Clarify the prompt before you optimize anything."
  - "A correct brute-force outline is usually the fastest safe start."
  - "Saying your trade-offs out loud is part of the answer."
practiceChecklist:
  - "Restate the problem in your own words."
  - "Ask about edge cases that change the solution shape."
  - "Name the first correct solution before improving it."
tags:
  - interviews
  - coding
  - framing
relatedDeckIds:
  - coding-arrays-hashmaps-basics
---

A lot of interview mistakes happen before the code starts.

The candidate hears something familiar, assumes the pattern too early, and writes a fast wrong answer.

## The better sequence

Use this order:

1. Restate the problem.
2. Check the inputs and edge cases.
3. Say the simplest correct idea.
4. Improve only if needed.

That order keeps you from solving a different problem by accident.

## A tiny example

Suppose the prompt is:

> Find the first repeated number in an array.

Do not jump straight to a hash map without saying why.

A better answer sounds like:

> The brute-force version compares every number against the ones after it. That is easy to trust but it is O(n²). If we want linear time, I would track seen values in a set and return the first number I see twice.

Now the interviewer can see your reasoning, not just the final code.

## Common mistakes

- jumping to the optimized pattern without proving you understood the problem
- hiding your thought process because you want to look fast
- forgetting edge cases like empty input or no repeated value
- overexplaining theory and never landing the answer

## How a senior engineer thinks

A senior engineer knows that trust matters.

They build trust by making the path visible:

> Here is the simplest correct version. Here is the trade-off. Here is why I would improve it this way.

That is much stronger than silently producing a “smart” solution.

## Interview angle

Interviewers usually want signal in three areas:

- do you understand the problem
- can you choose a sensible trade-off
- can you explain your decision clearly

Thinking before coding helps all three.
