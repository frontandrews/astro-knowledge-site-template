---
title: Data Modeling Without Overcomplicating
description: A simpler way to turn messy business rules into durable models without making the schema fight the product.
summary: Better data models come from clear business rules and access patterns, not from making the schema look sophisticated.
guideId: data-modeling-without-overcomplicating
locale: en
status: active
pillarId: data-and-persistence
branchId: data-modeling
pubDate: 2026-01-23
updatedDate: 2026-01-28
category: Data & Persistence
topic: Data Modeling
path:
  - Data & Persistence
  - Data Modeling
order: 10
relationships:
  - sql-vs-nosql-without-slogans
tags:
  - data
  - modeling
  - storage
topicIds:
  - data-storage
relatedDeckIds: []
---

## The problem

Data modeling often goes wrong in one of two ways.

Either the team mirrors the UI too directly and creates brittle tables, or it overengineers the model before understanding the real rules.

## Mental model

A good model is not the prettiest schema diagram.

It is the structure that preserves the business rules while staying usable for the access patterns that matter.

The model should reduce confusion, not create a puzzle.

## Breaking it down

When modeling data, ask:

1. what entities actually exist in the business domain?
2. which rules must always stay true?
3. how will this data be queried and updated most often?
4. which relationships are essential and which ones are accidental?

That keeps the model grounded in product reality.

## Simple example

Suppose you are modeling subscriptions.

If you only copy the current UI, you may end up storing "plan card state" or "billing screen state" instead of modeling customers, subscriptions, invoices, and status changes.

A better model keeps the durable business objects first and lets the UI derive its own view from them.

## Common mistakes

- modeling the screen instead of the domain
- storing duplicate sources of truth
- forcing abstractions before access patterns are clear
- ignoring update flows and thinking only about reads

## How a senior thinks

A senior engineer models for rules and change:

> I want the durable entities to reflect the business, and I want the shape to stay usable when the product flow changes later.

That produces a more resilient schema.

## What the interviewer wants to see

Interviewers usually want to know:

- you can identify the real entities
- you understand invariants and relationships
- you are thinking about reads, writes, and change over time

That sounds much stronger than naming normalization levels alone.

> A strong data model protects business rules first and convenience second.

> If the schema only mirrors today's screen, it probably will not age well.
