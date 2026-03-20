---
title: Safer Input and API Design
description: How to handle user input and external calls without leaving avoidable security and correctness gaps behind.
summary: Safer APIs come from being explicit about validation, allowed shapes, and how much authority the caller really has.
guideId: safer-input-and-api-design
locale: en
status: active
pillarId: security-thinking
branchId: input-and-api-safety
pubDate: 2026-03-04
updatedDate: 2026-03-08
category: Security Thinking
topic: Input and API Safety
path:
  - Security Thinking
  - Input and API Safety
order: 10
relationships:
  - auth-and-authorization-without-mixing-them-up
tags:
  - security
  - api
  - validation
topicIds:
  - security
relatedDeckIds: []
---

## The problem

Input handling often gets treated as a boring implementation detail.

That is dangerous because many security and correctness failures start exactly where the system accepts data with too much authority and too little validation.

## Mental model

Input safety is not only about rejecting malformed payloads.

It is about defining:

- what shape is allowed
- what values are allowed
- which fields the caller is allowed to influence

That is where safer APIs begin.

## Breaking it down

When handling input, ask:

1. what exact shape does this endpoint accept?
2. which values need validation beyond type checking?
3. which fields should be ignored or overwritten by the server?
4. what should happen when the input is invalid or unexpected?

That prevents the API from becoming overly trusting.

## Simple example

Suppose an endpoint allows a client to create a support ticket.

Fields like title and description belong to the client.

Fields like `createdBy`, `tenantId`, or `priorityOverride` may need to come from the server or stricter authorization logic, not straight from the caller.

Safer design is often about refusing the wrong authority boundary.

## Common mistakes

- validating type but not business rules
- accepting extra fields silently
- letting the client influence server-owned fields
- treating validation as optional because the UI already checks input

## How a senior thinks

A senior engineer wants the API contract to be explicit:

> I want to be clear about the allowed shape, the server-owned fields, and the validation rules before I trust this input anywhere important.

That reduces both security risk and ambiguous behavior.

## What the interviewer wants to see

Interviewers usually want to know:

- you think about validation as part of the contract
- you understand that client-side checks are not enough
- you can separate caller-controlled data from server-controlled data

That is stronger than saying "sanitize input" with no concrete model.

> Safer input handling starts with deciding what the caller is allowed to influence.

> If the contract is vague, the validation story probably is too.
