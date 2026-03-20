---
title: Thinking Before You Code in Interviews
description: A repeatable way to avoid writing the wrong solution too early in coding interviews.
summary: Clarify the shape of the problem, validate the naive path, and only then code the smallest correct version.
guideId: thinking-before-you-code-in-interviews
locale: en
status: active
pillarId: problem-solving-and-interview-thinking
branchId: approach-and-framing
pubDate: 2026-03-10
updatedDate: 2026-03-13
category: Problem Solving & Interview Thinking
topic: Coding Interviews
path:
  - Problem Solving & Interview Thinking
  - Approach and Framing
order: 10
relationships:
  - breaking-down-problems-without-panic
  - recognizing-patterns-without-memorizing-tricks
tags:
  - interviews
  - coding
  - framing
topicIds:
  - coding-interview
relatedDeckIds:
  - coding-arrays-hashmaps-basics
---

## The problem

Many people fail the interview before they even start writing code.

The candidate recognizes a pattern, accelerates too early, and answers a question that is similar, but not exactly the one that was asked.

## Mental model

In interviews, thinking before you code is not stalling. It is how you show that you know how to deal with uncertainty.

The model is simple:

- understand the problem
- say the smallest correct solution
- only then improve it

That keeps optimization from showing up before understanding.

## Breaking it down

A safe sequence is usually this:

1. restate the problem in your own words
2. confirm input, output, and edge cases
3. say the first correct solution
4. explain the trade-off
5. optimize only if it makes sense

That order helps you avoid skipping important steps.

## Simple example

Suppose the prompt is:

> Find the first repeated number in an array.

Instead of jumping straight to `hash map`, a better answer would be:

> The simplest version compares each number with the following ones. It is easy to trust, but it costs O(n²). If I need linear time, I store the values I have already seen in a set and return the first one that appears a second time.

Now the interviewer sees reasoning, criterion, and clarity. Not just a memorized technique.

## Common mistakes

- running to the optimized pattern without proving that you understood the problem
- hiding the reasoning to seem fast
- forgetting edge cases such as empty input or no repetition
- explaining too much theory and not landing on a decision

## How a senior thinks

A senior tends to create trust early.

They do not try to impress with speed. They show control of the path.

That usually sounds like this:

> Here is the smallest correct solution. This is the trade-off. If I need to improve it, I would follow this path.

## What the interviewer wants to see

In practice, the interviewer wants very simple signals:

- you understood the request
- you choose reasonable trade-offs
- you can explain why you made that decision

Thinking before you code helps exactly on those three points.

> In interviews, clarity is usually worth more than speed. First prove that you understood, then show how you would improve.

> If you did not explain the simplest solution first, you are probably optimizing too early.
