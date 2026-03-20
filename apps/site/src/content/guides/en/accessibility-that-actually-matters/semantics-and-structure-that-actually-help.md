---
title: Semantics and Structure
description: How to use HTML and interface organization to help navigation, reading, and understanding without treating accessibility as a visual detail.
summary: Accessibility starts when the interface structure already makes sense even before CSS.
guideId: semantics-and-structure-that-actually-help
locale: en
status: active
pillarId: accessibility-that-actually-matters
branchId: semantics-and-structure
pubDate: 2026-02-27
updatedDate: 2026-03-04
category: Accessibility That Actually Matters
topic: Semantics and Structure
path:
  - Accessibility That Actually Matters
  - Semantics and Structure
order: 10
relationships:
  - keyboard-and-focus-without-frustration
tags:
  - accessibility
  - semantics
  - frontend
topicIds:
  - accessibility
relatedDeckIds: []
---

## The problem

Many interfaces look visually correct, but become weak when you inspect the real structure underneath.

There is a `div` acting as a button, headings out of order, and sections with no meaning at all for assistive technology.

On screen everything seems in place. For people who navigate in other ways, the experience breaks early.

## Mental model

Good semantics are not technical decoration.

They are the way the interface communicates meaning beyond appearance.

Before thinking about style, it is worth asking:

> If I remove the CSS, does the structure still explain what each part of the screen is?

That question improves the foundation of the interface a lot.

## Breaking it down

A simple way to review structure is this:

1. use the element that represents the real intent
2. keep heading hierarchy understandable
3. group content into regions with meaning
4. do not invent an interactive role on a neutral element without need

That already solves a lot before any fine-tuning.

## Simple example

Imagine a clickable card built like this:

```html
<div onclick="openDetails()">
  View details
</div>
```

Visually it may work.

But semantically it does not communicate that it is interactive the way a button or link would.

A better structure would use `button` or `a`, depending on the real action.

Here the gain is not only "following a rule."

It is allowing the interface to be understood and operated in the right way.

## Common mistakes

- using `div` for everything out of convenience
- skipping heading levels for no reason
- depending on visual classes to give meaning to a block
- thinking accessibility only comes after the layout is done

## How a senior thinks

A strong senior treats semantics as part of UI architecture.

That usually sounds like this:

> Before styling, I want the page structure to already say what is a title, action, navigation, and main content.

That posture improves accessibility and maintenance at the same time.

## What the interviewer wants to see

In interviews, this usually shows maturity quickly:

- you understand that HTML carries meaning
- you know how to choose an element by its real function
- you think about page structure, not only visuals

People who do this well look like someone who builds more robust interfaces for real people, not only for a pretty screenshot.

> Accessibility starts in the structure, not in the final adjustment.

> If everything becomes `div`, the interface may even look ready, but it is still communicating very little.
