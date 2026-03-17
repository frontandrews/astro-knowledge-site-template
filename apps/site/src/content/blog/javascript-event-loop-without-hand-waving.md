---
title: The JavaScript Event Loop Without Hand-Waving
description: A practical way to explain stack, microtasks, and macrotasks in interviews without sounding vague.
summary: A cleaner explanation of why promises often resolve before timeouts.
pubDate: 2026-03-17
topic: JavaScript
tags:
  - javascript
  - event loop
  - async
relatedDeckIds:
  - javascript-runtime-core
---

The event loop gets explained badly all the time.

The usual answer is technically adjacent to the truth but too fuzzy to be useful in an interview. A better explanation is short, mechanical, and tied to execution order.

## The mental model

Use this sequence:

1. Run the current call stack.
2. Drain the microtask queue.
3. Pull the next macrotask.

That already explains a lot of common questions.

## Why promises beat `setTimeout`

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

Why?

- `start` runs on the current stack
- the timeout callback gets scheduled as a macrotask
- the promise handler gets scheduled as a microtask
- `end` still runs on the current stack
- after the stack clears, microtasks drain before the runtime moves to the next macrotask

## Where people get tripped up

The mistake is usually not “not knowing the names.”

The mistake is forgetting that microtasks can keep running before the runtime gives time back to other pending work. That matters for both correctness and responsiveness.

If you keep queueing microtasks aggressively, you can still make the app feel stuck.

## Good interview wording

You do not need a theatrical answer. A strong answer is:

> JavaScript finishes the current call stack first. Then it drains microtasks, such as promise callbacks, before it moves to the next macrotask, such as a timeout callback. That is why `Promise.then` often runs before `setTimeout(..., 0)`.

Then, if you want to sound stronger, add the performance angle:

> The ordering matters because microtasks can also starve other work if they are chained too aggressively.

That is usually enough.
