---
title: Idempotencia
description: O que idempotencia significa em APIs e jobs, e por que repetir a mesma request nao deveria repetir o mesmo efeito.
summary: Idempotencia e a propriedade de repetir a mesma operacao sem continuar criando novos efeitos depois do primeiro resultado util.
conceptId: idempotency
domainId: backend
groupId: apis
locale: pt-br
status: active
pubDate: 2026-03-19
tags:
  - api
  - backend
  - confiabilidade
relatedGuideIds:
  - api-and-service-design-with-clear-boundaries
  - failure-and-recovery-scenarios-with-clarity
---

## O que e

Idempotencia significa conseguir repetir a mesma operacao sem gerar um novo efeito colateral toda vez.

Isso e importante quando cliente, worker ou integracao externa pode reenviar a mesma intencao.

## Quando importa

Importa em pagamentos, webhooks, jobs e qualquer fluxo onde retry e comportamento normal.

Sem isso, o retry pode criar pedido duplicado, email duplicado ou estado inconsistente.

## Erro comum

O erro comum e tratar todo retry como um comando novo.

Isso costuma funcionar ate o primeiro timeout ou erro parcial.

## Exemplo curto

Se `POST /orders` e reenviado depois de timeout, o sistema pode precisar de uma chave de idempotencia para reconhecer que a intencao e a mesma.

Assim a segunda request devolve o mesmo resultado em vez de criar outro pedido.

## Por que isso ajuda

Idempotencia deixa o tratamento de falha mais calmo.

Retry para de parecer chute perigoso e vira comportamento planejado.
