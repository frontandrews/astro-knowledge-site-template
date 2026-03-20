---
title: The JavaScript Event Loop Without Hand-Waving
description: A simple way to explain stack, microtasks, and macrotasks without turning the topic into folklore.
summary: The event loop gets easier when you think in execution order instead of mystical queue names.
guideId: javascript-event-loop
locale: en
status: active
pillarId: runtime-and-execution
branchId: event-loop-and-order
pubDate: 2026-03-13
updatedDate: 2026-03-17
category: Runtime & Execution
topic: Event Loop and Execution Order
path:
  - Runtime & Execution
  - Event Loop and Execution Order
order: 10
relationships:
  - node-single-thread
tags:
  - javascript
  - event loop
  - async
topicIds:
  - javascript
relatedDeckIds:
  - javascript-runtime-core
---

## The problem

The event loop often gets explained in a way that sounds technical but does not help you reason about real code.

People memorize the words "microtask" and "macrotask" and still do not know why the output order surprised them.

## Mental model

The useful model is short:

1. run the current call stack
2. drain microtasks
3. move to the next macrotask

That already explains most of the behavior people call weird.

## Breaking it down

When async code confuses you, ask:

1. what is still running on the current stack?
2. which callback becomes a microtask?
3. which callback becomes a macrotask?
4. could chained microtasks delay other work?

Those questions are usually more useful than reciting queue names from memory.

## Simple example

```js
console.log('start')

setTimeout(() => {
  console.log('timeout')
}, 0)

Promise.resolve().then(() => {
  console.log('promise')
})

console.log('end')
```

The output is:

```txt
start
end
promise
timeout
```

That happens because the current stack finishes first, then the promise callback runs as a microtask, and only after that does the timeout callback run as the next macrotask.

## Common mistakes

- treating zero-delay `setTimeout` as immediate execution
- mixing up the call stack with queued callbacks
- thinking the queue names matter more than the execution order
- forgetting that too many chained microtasks can hurt responsiveness

## How a senior thinks

A senior engineer does not explain the event loop like trivia.

They explain it like execution order:

> Finish the current stack, drain microtasks, then move to the next macrotask. That is the part that actually helps me predict the output.

## What the interviewer wants to see

Interviewers usually want to know:

- you understand ordering, not just vocabulary
- you can connect promises and timeouts to the right queues
- you can explain why that ordering matters in real code

That is stronger than repeating a rehearsed definition.

> The event loop gets simpler when you think in execution order instead of buzzwords.

> If you can predict the output and explain why, you already know the important part.
