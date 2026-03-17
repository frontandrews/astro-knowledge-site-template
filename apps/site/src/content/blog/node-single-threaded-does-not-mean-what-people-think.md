---
title: Node Is Single-Threaded, But Not in the Way People Usually Mean
description: How to explain the difference between the JavaScript thread, the event loop, the libuv thread pool, and worker threads.
summary: The interview answer that separates the main thread from the whole runtime.
pubDate: 2026-03-17
category: Programming
topic: Node
takeaways:
  - "Node runs JavaScript on a main thread by default, but the runtime is not one-thread-only."
  - "Event loop coordination is different from CPU-bound parallelism."
  - "Worker threads and separate processes solve different scaling problems."
practiceChecklist:
  - "Separate the main JS thread from the runtime as a whole."
  - "Call out libuv or asynchronous I/O as the concurrency layer."
  - "Explain when worker threads or processes make sense."
tags:
  - node
  - concurrency
  - runtime
relatedDeckIds:
  - node-runtime-core
---

“Node is single-threaded” is one of those phrases that helps until it starts hurting.

It is a useful shorthand if you only mean that JavaScript execution for your request handlers runs on the main thread by default. It becomes misleading when someone uses that sentence to imply the entire runtime can only do one thing at a time.

## The cleaner explanation

A stronger answer separates these layers:

- the JavaScript main thread
- the event loop
- libuv and its thread pool
- worker threads when you opt into them

That framing shows you understand why Node handles I/O-heavy systems well while still struggling when CPU-heavy work blocks the main thread.

## What Node does well

Node works nicely for workloads such as:

- APIs that spend a lot of time waiting on databases
- HTTP services making outbound requests
- queue consumers coordinating I/O-heavy tasks

In those cases, the runtime is not busy because the CPU is doing the work. The runtime is busy because it is coordinating many pending operations.

## Where the confusion starts

If you run something CPU-heavy directly on the main thread, the event loop gets blocked and request handling degrades:

```js
app.get('/hash', (req, res) => {
  const result = slowHash(req.query.input)
  res.send(result)
})
```

That route will not scale well just because Node is “good at concurrency.” The concurrency story is mostly about not blocking the main event loop with expensive computation.

## When worker threads enter the picture

Worker threads are useful when you want parallel CPU work without freezing request handling on the main thread:

```js
import { Worker } from 'node:worker_threads'

function runHeavyJob() {
  return new Worker(new URL('./worker.js', import.meta.url))
}
```

That does not mean every Node app should use worker threads. It means you should know when your bottleneck is coordination versus computation.

## Strong interview framing

This is a good compact answer:

> Node runs JavaScript on a main thread by default, so CPU-heavy work can block the event loop. But the runtime is not limited to one thing happening overall. It coordinates asynchronous I/O through the event loop and libuv, and it can use worker threads or separate processes when parallel computation is needed.

That answer is much better than just repeating “Node is single-threaded.”
