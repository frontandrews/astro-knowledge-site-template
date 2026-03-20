---
title: What Runs on the Client and on the Server
description: How to decide where each part of the work should happen without turning the architecture into a confusing mix.
summary: When you do not separate client and server well, the UI becomes slower, more fragile, and harder to maintain.
guideId: server-and-client-thinking-without-confusion
locale: en
status: active
pillarId: state-and-ui-thinking
branchId: server-and-client-thinking
pubDate: 2026-03-01
updatedDate: 2026-03-03
category: State and UI
topic: Client and Server
path:
  - State and UI
  - What Runs on the Client and on the Server
order: 10
relationships:
  - effects-without-the-mess
tags:
  - react
  - server
  - client
topicIds:
  - react
relatedDeckIds: []
---

## The problem

Many frontend architectures become strange because the team mixes client and server work without a clear criterion.

Soon there is fetch in the wrong place, sensitive data going to the browser without need, and a client component doing work that could arrive ready.

The result is usually more complexity, more loading, and less clarity.

## Mental model

Client and server are not only different places.

They have different responsibilities.

In a simple way:

- the server is good for fetching data, validating rules, protecting secrets, and assembling the response
- the client is good for interaction, local state, user events, and immediate interface updates

When that division becomes clear, many decisions get easier.

## Breaking it down

Before deciding where something runs, try to answer:

1. does this need a secret, permission, or direct backend access?
2. does this depend on click, typing, or immediate interaction?
3. can this arrive ready to reduce work in the browser?
4. does this logic really need to stay exposed on the client?

These questions avoid a lot of unnecessary mixing.

## Simple example

Imagine a page that shows orders and lets the user filter by status.

A reasonable split would be:

- the server fetches the orders and returns the initial data
- the client controls the selected filter and the screen interaction

The common mistake would be putting all fetching, transformation, and access rules on the client just because "we are already in the component."

That increases browser cost and blurs responsibilities.

## Common mistakes

- sending to the client work that could arrive resolved from the server
- putting secrets or sensitive logic close to the interface
- treating any interactive component as if everything needed to be client-side
- deciding by the convenience of the current file, not by the real responsibility

## How a senior thinks

A strong senior does not ask first "which file do I write this in?"

They ask:

> Which side should own this responsibility so the interface stays simpler and safer?

That question improves performance, maintenance, and clarity at the same time.

## What the interviewer wants to see

In interviews, this usually shows maturity very quickly:

- you understand that client and server have different roles
- you know how to justify why something should live on one side and not the other
- you think about security, simplicity, and rendering cost

People who do this well give the image of someone who knows how to design interfaces beyond the isolated component.

> The client exists to interact. The server exists to prepare and protect what the interface needs.

> If everything ended up on the client for convenience, the architecture probably lost its criterion along the way.
