---
conceptId: content-contract
title: Content contract
description: The minimal agreement between the shell and the editorial source.
summary: The shell expects a manifest plus predictable collection folders so it can build routes and indexes safely.
domainId: backend
groupId: apis
locale: en
pubDate: 2026-03-24
relatedArticleIds:
  - customize-the-template-after-clone
status: active
tags:
  - template
  - content
---
## What it means

A content contract is the set of files and fields the shell depends on before it can render pages. In this template, that contract starts with `collections.manifest.json` and the collection folders declared inside it.

## Why it matters

Keeping the contract explicit makes the shell reusable. People can replace the content source without guessing which folders or metadata fields are required for the app to boot.
