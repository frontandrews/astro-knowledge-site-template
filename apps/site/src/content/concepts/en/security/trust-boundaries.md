---
title: Trust Boundaries
description: How to think about where trust starts and ends in a system instead of assuming internal data is safe by definition.
summary: A trust boundary is the line where data, identity, or control moves from one level of trust to another.
conceptId: trust-boundaries
domainId: security
groupId: trust
locale: en
status: active
pubDate: 2026-03-19
tags:
  - security
  - auth
  - api
relatedGuideIds:
  - trust-boundaries-without-hand-waving
  - safer-input-and-api-design
---

## What it is

A trust boundary is the point where you should stop assuming that something is safe by default.

That can happen between browser and server, service and database, internal system and vendor, or regular user and admin.

## When it matters

It matters whenever data crosses systems, permission changes, or input arrives from outside the current context.

If you ignore that boundary, you usually ignore validation and authorization together with it.

## Common mistake

The common mistake is treating "internal" as automatically trustworthy.

An internal system can also be wrong, outdated, or misconfigured.

## Short example

If one service says a user is admin, another service still needs to decide what that means inside its own rules.

Trusting the label blindly can turn into a permission bug.

## Why it helps

This concept makes security more concrete.

Instead of vague fear, you get a better question: where does trust change here, and which checks belong at that edge?
