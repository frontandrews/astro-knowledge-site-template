---
title: Semantics and Structure That Actually Help
description: How to use HTML and UI structure in a way assistive tools can understand without turning accessibility into decorative markup.
summary: Better accessibility starts when semantics are part of the structure from the beginning, not a label patch at the end.
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
  - html
topicIds:
  - accessibility
relatedDeckIds: []
---

## The problem

Accessibility often gets reduced to adding labels after the layout already exists.

That usually misses the deeper issue: the structure itself is not giving the right meaning to assistive tools.

## Mental model

Semantics are not decoration.

They are how the interface communicates what things are, how they relate, and how users should move through them.

If the structure is wrong, extra attributes rarely fix the core problem.

## Breaking it down

When building UI structure, ask:

1. is this the right native element for the job?
2. does the heading and landmark structure reflect the page meaning?
3. can assistive tools understand the hierarchy without extra explanation?
4. am I adding `aria` because the structure is good, or because the structure is wrong?

That keeps semantics connected to the real UI.

## Simple example

If a page uses visual section titles but skips proper headings, a screen reader user loses a simple way to navigate the content.

If a clickable card is built as a generic `div` instead of a link or button, users lose the meaning and behavior that the browser would have provided for free.

## Common mistakes

- choosing generic containers when a semantic element already exists
- using headings for styling instead of hierarchy
- relying on `aria` to compensate for the wrong structure
- designing visually and only later asking what the element means

## How a senior thinks

A senior engineer starts with meaning before polish:

> I want the structure to already communicate what this part of the UI is before I add any extra accessibility attributes.

That leads to simpler and more robust interfaces.

## What the interviewer wants to see

Interviewers usually want to know:

- you understand semantics as structure, not decoration
- you know how native elements help accessibility
- you can explain why `aria` is not a substitute for the right base

That shows practical accessibility judgment.

> Better semantics reduce how much extra explanation the interface needs.

> If the structure is wrong, the accessibility patch usually arrives too late.
