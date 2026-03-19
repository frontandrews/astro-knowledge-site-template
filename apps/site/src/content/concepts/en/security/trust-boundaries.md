---
title: Trust Boundaries
description: How to reason about where trust starts and stops in a system, instead of assuming data is safe because it came from "inside."
summary: A trust boundary is a line where data, identity, or control moves from one level of trust to another.
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

A trust boundary is the point where you should stop assuming something is safe by default.

That can happen between browser and server, service and database, internal system and vendor, or user and admin roles.

## When it matters

It matters any time data crosses systems, permissions change, or inputs arrive from outside your current control.

If you skip that boundary, you often skip validation and authorization at the same time.

## Common mistake

The common mistake is treating "internal" as automatically trustworthy.

Internal systems can still be stale, compromised, misconfigured, or simply wrong.

## Short example

If one service says a user is admin, another service should still decide what that claim means inside its own rules.

Trusting the label blindly can turn an integration shortcut into a permission bug.

## Why it helps

This concept makes security more concrete.

Instead of vague fear, you get a clearer question: where does trust change here, and what checks belong at that edge?
