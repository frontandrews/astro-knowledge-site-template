---
title: Measure Before You Optimize
description: How to avoid optimizing by reflex and make decisions with evidence, not with feeling.
summary: Optimization without measurement usually spends energy in the wrong place and still leaves the team too confident in an improvement that may not even exist.
guideId: measure-before-you-optimize
locale: en
status: active
pillarId: performance-that-makes-sense
branchId: measurement-before-optimization
pubDate: 2026-02-04
updatedDate: 2026-02-08
category: Performance That Makes Sense
topic: Measure Before You Optimize
path:
  - Performance That Makes Sense
  - Measure Before You Optimize
order: 10
relationships:
  - rendering-network-and-cpu-without-mixing-them-up
tags:
  - performance
  - measurement
  - optimization
topicIds:
  - performance
relatedDeckIds: []
---

## The problem

Many optimizations come from discomfort, not from evidence.

The screen feels heavy, the API feels slow, the component seems to re-render too much.

Without measuring, all of that may sound plausible and still be wrong.

## Mental model

Optimizing well is not improving whatever looks suspicious.

It is confirming where the cost is, how much it weighs, and whether the change really alters the result.

The useful question here is usually:

> What can I prove about this slowness before I touch the code?

## Breaking it down

A simple way to measure better is this:

1. choose one specific flow
2. define which metric matters there
3. capture the baseline before the change
4. compare the after with the before

Without that, "it seems better" becomes the decision criterion.

## Simple example

Imagine a list component that seems slow.

A rushed response would be to add memoization everywhere.

A better response would be:

- measure render time
- see how many times the component actually re-renders
- compare before and after the change

If the metric barely changes, maybe the optimization created complexity without real gain.

## Common mistakes

- optimizing before having a baseline
- trusting only local feeling
- celebrating a micro-improvement that is irrelevant to the user
- keeping new complexity even when the gain was minimal

## How a senior thinks

A strong senior does not treat optimization as a reflex.

They treat it as an experiment.

That usually sounds like this:

> Before I change anything, I want to measure the current state. Then I compare to see whether the change was really worth the cost.

That posture protects the system and the team from useless complexity.

## What the interviewer wants to see

In interviews, this usually shows maturity quickly:

- you know how to distinguish suspicion from evidence
- you think in terms of metrics and impact
- you understand that optimization also has a maintenance cost

People who do this well look like someone who improves performance without turning the code into ritual.

> What was not measured usually becomes opinion wearing an engineering costume.

> If you did not compare before and after, you still do not know whether you optimized or only changed something.
