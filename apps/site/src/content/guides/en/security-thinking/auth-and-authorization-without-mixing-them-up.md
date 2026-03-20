---
title: Auth and Authorization Without Mixing Them Up
description: How to separate identity from permission so login logic and access rules do not collapse into one fuzzy layer.
summary: The system gets safer when you separate who the user is from what the user is allowed to do.
guideId: auth-and-authorization-without-mixing-them-up
locale: en
status: active
pillarId: security-thinking
branchId: auth-and-authorization
pubDate: 2026-01-10
updatedDate: 2026-01-12
category: Security Thinking
topic: Auth and Authorization
path:
  - Security Thinking
  - Auth and Authorization
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

Many systems say "auth" when they actually mean several different things at once.

That creates confusion because login, session validation, role checks, and resource permissions all get treated like one step.

## Mental model

Authentication answers:

- who is this actor?

Authorization answers:

- what is this actor allowed to do here?

You need both, but they solve different problems.

## Breaking it down

When designing access control, ask:

1. how do I establish identity?
2. how do I verify the session or token is still valid?
3. what permission is needed for this action?
4. where should the authorization decision happen?

That keeps identity and access rules from collapsing into one vague layer.

## Simple example

A user may be correctly authenticated with a valid session.

That does not mean they can delete a project, refund a payment, or read another tenant's data.

Authentication proves who they are. Authorization decides whether the action is allowed.

## Common mistakes

- treating login as proof of permission
- storing role claims in places that the client can influence
- scattering authorization logic across too many layers
- checking broad role names instead of resource-specific permissions

## How a senior thinks

A senior engineer separates the questions clearly:

> First I establish identity. Then I decide whether that identity has permission for this specific action on this specific resource.

That makes the system easier to reason about and safer to evolve.

## What the interviewer wants to see

Interviewers usually want to know:

- you understand the difference between identity and permission
- you can explain where access control should be enforced
- you know why a valid login is not enough

That is much stronger than saying "use JWT" and stopping there.

> A valid identity is not the same thing as a valid permission.

> If the system mixes those questions, the access model usually gets blurry fast.
