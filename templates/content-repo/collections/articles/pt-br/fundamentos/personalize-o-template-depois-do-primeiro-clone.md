---
articleId: customize-the-template-after-clone
title: Personalize o template depois do primeiro clone
description: Use o starter incluido no repo para validar a shell antes de trocar marca e apontar para um repositorio editorial real.
summary: Um primeiro passo pratico para transformar a shell generica no seu projeto sem quebrar o setup padrao.
category: Template
kind: article
level: beginner
locale: pt-br
order: 10
path:
  - Starter
  - Primeiro clone
pillarId: foundations
branchId: first-clone
practiceChecklist:
  - Rode pnpm dev antes de apontar a shell para um repositorio de conteudo separado.
  - Troque nome, URL e dados legais em apps/site/.env quando estiver pronto para publicar.
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
  - O repositorio agora inclui starter content, entao clone e dev funcionam sem outro repo.
  - As trocas de marca e env devem acontecer depois que a shell ja estiver rodando localmente.
  - O conteudo externo continua opcional ate voce querer separar a parte editorial.
tags:
  - template
  - starter
  - bootstrap
topicIds:
  - delivery
trackEligible: true
---
## Valide a shell antes de personalizar

A forma mais rapida de quebrar um projeto reutilizavel e rebrandear tudo antes de confirmar que a shell original ainda funciona. Comece rodando o repositorio do jeito que foi clonado e verifique se o starter aparece em todas as secoes principais.

## Troque uma camada por vez

Depois que o starter estiver funcionando, altere a identidade em ordem:

1. nome e URL do site
2. dados legais e de suporte
3. fonte de conteudo
4. integracoes opcionais como comentarios e newsletter

Essa sequencia deixa qualquer falha mais facil de isolar.

## Aponte para um repositorio real depois

Quando seu conteudo real estiver pronto, aponte `SITE_CONTENT_DIR` ou `.local/content-source.json` para esse repositorio. O contrato da shell continua igual, mas o setup padrao deixa de bloquear o primeiro uso.
