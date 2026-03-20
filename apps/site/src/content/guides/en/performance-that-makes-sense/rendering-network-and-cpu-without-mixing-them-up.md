---
title: Rendering, Network, and CPU Without Mixing Them Up
description: How to separate different kinds of slowness so you do not call everything performance and attack the wrong place.
summary: Not every slow screen suffers from the same problem. Sometimes the delay is network, sometimes rendering, sometimes CPU.
guideId: rendering-network-and-cpu-without-mixing-them-up
locale: en
status: active
pillarId: performance-that-makes-sense
branchId: rendering-network-and-cpu
pubDate: 2026-02-17
updatedDate: 2026-02-20
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
topicIds:
  - performance
relatedDeckIds: []
---

## The problem

When a screen gets slow, it is common to call everything a "performance problem" as if it were a single category.

But a slow network, heavy rendering, and busy CPU create similar symptoms with very different causes.

If you mix those things, the chance of optimizing the wrong place rises a lot.

## Mental model

A useful way to think about it is to separate three common sources of delay:

- network: the data takes time to arrive
- CPU: the computational work takes time to finish
- rendering: the browser takes time to turn state into interface

These categories cross, but they are not the same thing.

## Breaking it down

A simple way to diagnose better is this:

1. see whether the wait is before or after the data arrives
2. find out whether the browser is spending too much time computing
3. check whether the interface is repainting or recalculating more than it should
4. attack the right kind of slowness, not the generic name "performance"

That greatly reduces the risk of cosmetic adjustments.

## Simple example

Imagine a search page that feels slow.

Three different scenarios may exist:

- the API takes 2 seconds to respond
- the response arrives quickly, but a heavy filter blocks CPU on the client
- the data arrives and the filter is light, but the interface re-renders too many components

For the user, all three cases may sound like "the screen is slow."

For the person fixing it, they are three different problems.

## Common mistakes

- calling any delay a rendering problem
- memoizing a component when the problem is network
- reducing payload when the bottleneck is local computation
- optimizing without separating which resource is actually suffering

## How a senior thinks

A strong senior first classifies the type of slowness.

That usually sounds like this:

> Before deciding the optimization, I want to separate whether the wait is in the data arriving, in the work being processed, or in the interface being drawn.

That classification makes the conversation much more precise.

## What the interviewer wants to see

In interviews, this usually shows maturity quickly:

- you know that performance is not one single block
- you can separate similar symptoms by different causes
- you choose the technical response that best matches the affected resource

People who do this well look like someone who improves a product through real diagnosis, not well-intentioned guessing.

> A slow screen is not a diagnosis. It is only a symptom.

> If you have not separated network, CPU, and rendering, it is still too early to choose the optimization.
