---
termId: section-manifest
title: Section manifest
description: A file that declares which public sections the shell should expose.
summary: It maps section ids, page types, localized routes, labels, descriptions, and optional source directories.
aliases:
  - collections.manifest.json
locale: en
pubDate: 2026-03-24
status: active
tags:
  - template
  - routing
---
The section manifest is the routing contract between the shell and the synced content. If a section is disabled there, the shell removes its navigation entry and skips route generation for that surface.
