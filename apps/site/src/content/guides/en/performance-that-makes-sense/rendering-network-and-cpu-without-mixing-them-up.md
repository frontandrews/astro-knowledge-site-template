---
title: Rendering, Network, and CPU Without Mixing Them Up
description: How to separate different kinds of slowness instead of calling every slow experience a rendering problem.
summary: Better performance decisions come from naming whether the pain is in rendering, network, or CPU work first.
guideId: rendering-network-and-cpu-without-mixing-them-up
locale: en
status: active
pillarId: performance-that-makes-sense
branchId: rendering-network-and-cpu
pubDate: 2026-03-02
updatedDate: 2026-03-06
category: Performance That Makes Sense
topic: Rendering, Network, and CPU
path:
  - Performance That Makes Sense
  - Rendering, Network, and CPU
order: 10
relationships:
  - bottleneck-detection-without-guessing
  - measure-before-you-optimize
tags:
  - performance
  - rendering
  - network
  - cpu
topicIds:
  - performance
relatedDeckIds: []
---

## The problem

People often say an experience is slow without naming what kind of slow it is.

Then rendering fixes get applied to network issues, network fixes get applied to CPU issues, and the conversation stays vague.

## Mental model

Not all slowness is the same.

Three useful buckets are:

- network delay
- CPU work
- rendering and painting cost

If you name the bucket first, the fix becomes much easier to choose.

## Breaking it down

When something feels slow, ask:

1. am I waiting for bytes over the network?
2. is the device doing too much computation?
3. is the browser spending too much time rendering or repainting?
4. what measurement separates these possibilities?

That keeps the diagnosis from collapsing into one blurry label.

## Simple example

Suppose a page feels sluggish after the data already arrived.

That points away from pure network delay.

If CPU profiling shows heavy parsing or expensive filtering, the issue is different from a case where the browser is repainting a massive list too often.

The word "slow" is the start, not the diagnosis.

## Common mistakes

- calling every issue a rendering problem
- optimizing payload size when the CPU is the real cost
- focusing on the browser when the network is the true delay
- skipping the step that separates one type of slowness from another

## How a senior thinks

A senior engineer wants the slowdown classified:

> I first want to know whether I am waiting on the wire, burning CPU, or paying render cost. Different categories need different fixes.

That makes the next step more reliable.

## What the interviewer wants to see

Interviewers usually want to know:

- you can separate major kinds of slowness
- you understand why one optimization does not fit every case
- you think in diagnosis before solution

That is stronger than saying "I would optimize performance."

> Slowness becomes actionable when you stop treating every bottleneck like the same kind of problem.

> If you cannot classify the cost, the fix is still mostly a guess.
