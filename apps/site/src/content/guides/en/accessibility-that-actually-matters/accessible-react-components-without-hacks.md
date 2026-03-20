---
title: Accessible React Components Without Hacks
description: How to build interactive components in React without breaking semantics, focus, and behavior just because the abstraction looks nice.
summary: An accessible component is not the one that receives aria at the end. It is the one born with correct semantics and interaction from the start.
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

Many libraries or design systems create beautiful components, but accessibility only enters at the end as a patch.

Soon there is a `div` with `role="button"`, incomplete keyboard support, strange focus, and a pile of `aria-*` trying to save a bad foundation.

The problem is not React. The problem is abstracting interaction without preserving native behavior.

## Mental model

An accessible component is not a visual with an extra attribute.

It is a piece that is already born with:

- the correct semantic element
- predictable interactive behavior
- coherent focus
- state that can be communicated to assistive technology

If the foundation is wrong, the rest becomes correction on top of correction.

## Breaking it down

A simple way to build better is this:

1. start with the native element that comes closest to the intent
2. preserve keyboard and focus before thinking about the component API
3. use `aria-*` only when there is a real need to complement meaning
4. test the component in isolation as if it were the final product

That avoids a "generic" component that needs a manual to be used safely.

## Simple example

Imagine a custom button in React:

```tsx
<div onClick={onOpen}>Open</div>
```

Visually it may look like a button.

But by default it does not get:

- correct focus
- expected keyboard activation
- button semantics

A better foundation is to start with:

```tsx
<button type="button" onClick={onOpen}>Open</button>
```

Then you style it.

Here, the order matters.

## Common mistakes

- starting with `div` and trying to fix it later
- creating a component that is too flexible and forgetting native behavior
- using `aria` to compensate for wrong semantics
- validating layout and forgetting real interaction

## How a senior thinks

A strong senior does not ask only "how do I make this component reusable?"

They ask:

> If I abstract this here, does the native behavior stay intact or am I trading robustness for the appearance of flexibility?

That question improves the quality of the design system a lot.

## What the interviewer wants to see

In interviews, this usually shows maturity quickly:

- you understand that accessibility is part of the component API
- you know how to preserve native behavior before customizing
- you think about semantics, keyboard, and focus as part of the abstraction

People who do this well look like someone who builds components for real use, not only for a pretty Storybook story.

> An accessible component is not born in the final patch. It is born in the right foundation choice.

> If the abstraction broke semantics and keyboard, it probably became pretty before it became correct.
