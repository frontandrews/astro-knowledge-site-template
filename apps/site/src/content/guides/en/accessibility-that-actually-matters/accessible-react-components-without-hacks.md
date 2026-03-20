---
title: Accessible React Components Without Hacks
description: How to build interactive React components without breaking semantics, focus, and behavior just because the abstraction looks elegant.
summary: An accessible component is not the one that gets `aria` at the end. It is the one that starts with the right semantics and interaction model.
guideId: accessible-react-components-without-hacks
locale: en
status: active
pillarId: accessibility-that-actually-matters
branchId: accessible-react-components
pubDate: 2026-01-03
updatedDate: 2026-01-05
category: Accessibility That Actually Matters
topic: Accessible React Components
path:
  - Accessibility That Actually Matters
  - Accessible React Components
order: 10
relationships:
  - keyboard-and-focus-without-frustration
tags:
  - accessibility
  - react
  - components
topicIds:
  - accessibility
  - react
relatedDeckIds: []
---

## The problem

Many component libraries and design systems create beautiful components and add accessibility only at the end as a patch.

Then you get `div` elements with `role="button"`, incomplete keyboard behavior, strange focus handling, and a pile of `aria-*` attributes trying to rescue a weak base.

## Mental model

An accessible component is not a visual shell with extra attributes.

It starts with:

- the right semantic element
- predictable interaction behavior
- coherent focus handling
- state that assistive technology can understand

If the base is wrong, the rest becomes repair work.

## Breaking it down

A simple way to build better components is:

1. start from the native element closest to the real intent
2. preserve keyboard and focus behavior before designing the component API
3. use `aria-*` only when there is a real semantic gap to fill
4. test the component in isolation as if it were a finished product

That avoids "generic" components that need a manual to be used safely.

## Simple example

This custom button looks similar to a button:

```tsx
<div onClick={onOpen}>Open</div>
```

But it does not automatically get:

- expected keyboard activation
- proper focus behavior
- button semantics

Starting from this is stronger:

```tsx
<button type="button" onClick={onOpen}>Open</button>
```

Then you style it.

## Common mistakes

- starting from `div` and trying to fix it later
- building flexibility first and forgetting native behavior
- using `aria` to compensate for broken semantics
- validating layout and forgetting real interaction

## How a senior thinks

A senior engineer does not ask only "how do I make this reusable?"

They ask:

> If I abstract this, does the native behavior stay intact, or am I trading robustness for the look of flexibility?

That question improves the design system fast.

## What the interviewer wants to see

Interviewers usually want to know:

- you understand accessibility as part of the component API
- you preserve native behavior before customization
- you treat semantics, keyboard, and focus as part of the abstraction

That looks like someone building components for real use, not just polished demos.

> An accessible component does not appear in the final patch. It starts in the first base choice.

> If the abstraction broke semantics and keyboard behavior, it became elegant before it became correct.
