---
title: Authentication and Permission Without Mixing the Two
description: How to separate identity from authorization without treating login as if it solved access control by itself.
summary: Knowing who the user is does not automatically answer what they are allowed to do.
guideId: auth-and-authorization-without-mixing-them-up
locale: en
status: active
pillarId: security-thinking
branchId: auth-and-authorization
pubDate: 2026-01-10
updatedDate: 2026-01-12
category: Security in Practice
topic: Authentication and Permission
path:
  - Security in Practice
  - Authentication and Permission
order: 10
relationships:
  - trust-boundaries-without-hand-waving
  - safer-input-and-api-design
tags:
  - security
  - auth
  - authorization
topicIds:
  - security
relatedDeckIds: []
---

## The problem

Many applications treat authentication as if it ended the security conversation.

The user logged in, so it looks like the system already knows enough.

But login only answers who the person is. It does not answer what they are allowed to do.

## Mental model

Authentication and authorization answer different questions:

- authentication: who are you?
- authorization: are you allowed to do this here?

Mixing those two things usually creates improper access in flows that looked safe on the surface.

## Breaking it down

A simple way to think better is this:

1. confirm the identity of the user
2. find out which resource or action is being accessed
3. validate the permission on the server
4. never treat the interface as the final source of authorization

That avoids a good part of the most basic mistakes.

## Simple example

Imagine a dashboard where the frontend hides the delete-user button from anyone who is not admin.

If the backend does not validate that permission and accepts the request anyway, the system stays vulnerable.

The mistake is not in the button.

The mistake is treating a visual rule as if it were an access rule.

## Common mistakes

- thinking login already solves authorization
- trusting the UI to block a sensitive action
- using a role that is too generic without checking the resource context
- forgetting that the server needs to validate access on every critical operation

## How a senior thinks

A strong senior separates identity from access from the start.

That usually sounds like this:

> First I confirm who the user is. Then I validate whether they can execute this action on this specific resource.

That separation looks simple, but it avoids many serious bugs.

## What the interviewer wants to see

In interviews, this usually shows maturity quickly:

- you know how to differentiate authentication from authorization
- you understand that a visual rule does not replace access validation
- you think of permission as a backend decision, not only an interface concern

People who do this well look like someone who understands security as a real flow, not only as a login screen.

> Login proves identity. Permission proves limit.

> If the access rule only exists in the interface, it does not really exist yet.
