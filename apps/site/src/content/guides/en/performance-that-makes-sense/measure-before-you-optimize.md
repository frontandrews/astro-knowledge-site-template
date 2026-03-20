---
title: Measure Before You Optimize
description: Why guesses are expensive in performance work and why even lightweight measurement changes the whole conversation.
summary: Optimization gets safer when measurement turns "it feels slow" into something concrete enough to improve on purpose.
guideId: measure-before-you-optimize
locale: en
status: active
pillarId: performance-that-makes-sense
branchId: measurement-before-optimization
pubDate: 2026-02-23
updatedDate: 2026-02-27
category: Performance That Makes Sense
topic: Measurement Before Optimization
path:
  - Performance That Makes Sense
  - Measurement Before Optimization
order: 10
relationships:
  - rendering-network-and-cpu-without-mixing-them-up
tags:
  - performance
  - measurement
  - profiling
topicIds:
  - performance
relatedDeckIds: []
---

## The problem

Performance work gets expensive when the team optimizes from intuition alone.

People change code, feel busy, and still cannot prove whether the experience improved in the way that matters.

## Mental model

Measurement is not ceremony.

It is how you turn vague discomfort into a target you can improve.

The useful question is:

> What evidence would show that this change actually moved the performance problem?

## Breaking it down

Before optimizing, ask:

1. what user-facing symptom am I trying to improve?
2. what metric or trace captures that symptom?
3. what baseline do I have now?
4. how will I know if the change worked or just moved cost somewhere else?

That turns optimization into engineering instead of faith.

## Simple example

Suppose a team says a page feels slow and immediately adds memoization everywhere.

If nobody measured render counts, CPU time, or route latency first, the team may not even know whether rendering was the real issue.

Even a lightweight before-and-after measurement is better than optimizing blind.

## Common mistakes

- changing code before capturing a baseline
- using one metric that does not match the user symptom
- assuming local feel is enough evidence
- ignoring regressions in another part of the path

## How a senior thinks

A senior engineer asks for the smallest useful proof:

> I want just enough measurement to know where the cost is now and whether the change improved the thing users actually feel.

That keeps the work practical.

## What the interviewer wants to see

Interviewers usually want to know:

- you understand why baselines matter
- you can connect metrics to real user symptoms
- you know optimization should be testable, not just persuasive

That is stronger than naming performance techniques from memory.

> Measurement does not slow performance work down. It prevents expensive guesses.

> If you cannot say what success looks like, the optimization is still underspecified.
