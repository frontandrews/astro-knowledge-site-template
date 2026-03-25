---
articleId: customize-the-template-after-clone
title: Customize the template after the first clone
description: Use the bundled starter content to validate the shell before swapping in your real brand and editorial repository.
summary: A practical first pass for turning the generic shell into your own project without breaking the default setup.
category: Template
kind: article
level: beginner
locale: en
order: 10
path:
  - Starter
  - First clone
pillarId: foundations
branchId: first-clone
practiceChecklist:
  - Run pnpm dev before pointing the shell at a separate content repository.
  - Replace the site name, URL, and legal details in apps/site/.env when you are ready to publish.
pubDate: 2026-03-24
relationships: []
relatedDeckIds: []
readiness:
  draft_complete: true
  examples_added: true
  interview_angle: false
  language_simple: true
  practice_items_filled: true
  reasoning_complete: true
  relationships_set: true
  senior_layer: true
  takeaways_filled: true
  voice_human: true
status: active
takeaways:
  - The repository now ships with starter content, so clone and dev can work without another repo.
  - Brand and env changes should happen after the shell is already running locally.
  - External content stays optional until you are ready to separate editorial ownership.
tags:
  - template
  - starter
  - bootstrap
topicIds:
  - delivery
trackEligible: true
---
## Validate the shell before customizing it

The fastest way to break a reusable project is to rebrand it before you know the original shell still works. Start by running the repository exactly as cloned and confirm that the starter content loads in every main section.

## Swap one surface at a time

After the starter is working, change the brand identity in layers:

1. site name and URL
2. legal and support details
3. content source
4. optional integrations like comments and newsletter

That order keeps failures easy to isolate.

## Move to a real editorial repository later

When your real content is ready, point `SITE_CONTENT_DIR` or `.local/content-source.json` at that repository. The shell contract stays the same, but now your clone-friendly default no longer blocks first use.
