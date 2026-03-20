---
title: Safer Inputs and APIs
description: How to treat external input with less naivety and design APIs that do not accept too much data for convenience.
summary: A secure API is not the one that trusts a nice-looking payload. It is the one that validates, restricts, and reduces the error surface.
guideId: safer-input-and-api-design
locale: en
status: active
pillarId: security-thinking
branchId: input-and-api-safety
pubDate: 2026-02-20
updatedDate: 2026-02-25
category: Security in Practice
topic: Safer Inputs and APIs
path:
  - Security in Practice
  - Safer Inputs and APIs
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

Many APIs become vulnerable not because auth is missing, but because they accept too much input without criteria.

Extra fields get through, wrong formats get through, unexpected values get through, and the system tries to deal with all of it later.

That "later" usually gets expensive.

## Mental model

External input should never enter the system as ready-made truth.

It needs to go through a few questions:

- is this format valid?
- should this field exist?
- does this value make sense in this context?
- is this data allowed to trigger this action?

Security here has a lot to do with discipline at the boundary.

## Breaking it down

A simple way to make input safer is this:

1. validate the format right at the edge
2. accept only the fields the flow really needs
3. normalize whatever is necessary before using it
4. reject early what does not make sense

That reduces the surface for error, abuse, and unexpected behavior.

## Simple example

Imagine a profile update endpoint.

If it receives a whole object and does a blind merge into the user, any unexpected field can end up entering the model:

- `role`
- `isAdmin`
- internal configuration

A better version accepts only the minimum contract:

- `name`
- `bio`
- `avatarUrl`

The gain here is not only organization.

It is control over what can actually be changed.

## Common mistakes

- trusting the frontend to send the correct payload
- validating type without validating the business rule
- accepting extra fields "because we ignore them later"
- leaving the API too generic to look flexible

## How a senior thinks

A strong senior treats input as a risk surface.

That usually sounds like this:

> I want to validate early and accept the smallest possible contract, because every extra field increases the area of behavior the system needs to defend.

That posture improves security and clarity at the same time.

## What the interviewer wants to see

In interviews, this usually shows maturity quickly:

- you understand that external input needs to be validated at the boundary
- you think in terms of minimum contract, not open payload
- you connect security to API design, not only to middleware

People who do this well look like someone who reduces risk before it enters the system.

> A safer API does not accept everything and try to survive. It accepts little and does it deliberately.

> If any "almost right" payload can enter the system, the boundary is still too loose.
