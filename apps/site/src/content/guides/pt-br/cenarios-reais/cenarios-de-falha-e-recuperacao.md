---
title: Cenarios de Falha e Recuperacao
description: Como pensar em sistema real quando alguma parte quebra, sem tratar resiliência como slogan.
summary: Sistema forte não é o que nunca falha. É o que falha de forma controlada e consegue se recuperar com clareza.
guideId: failure-and-recovery-scenarios-with-clarity
locale: pt-br
status: active
pillarId: real-world-scenarios
branchId: failure-and-recovery-scenarios
pubDate: 2026-01-30
updatedDate: 2026-02-04
category: Cenarios reais
topic: Cenarios de falha e recuperacao
path:
  - Cenarios reais
  - Cenarios de falha e recuperacao
order: 10
relationships:
  - scalable-api-scenarios-without-diagram-theatre
  - ai-feature-scenarios-with-product-judgment
tags:
  - systems
  - incidents
  - resilience
topicIds:
  - system-design
  - debugging-production
relatedDeckIds: []
---

## O problema

Muita arquitetura fala muito de disponibilidade e pouco de comportamento sob falha.

Quando uma dependência cai, a resposta vira improviso: retry cego, timeout maior, restart e esperança.

Isso até pode aliviar o momento, mas não descreve recuperação de verdade.

## Modelo mental

Falha faz parte do sistema, não exceção filosófica.

A pergunta útil aqui costuma ser:

> Quando essa parte quebrar, o que deve parar, o que pode degradar e como o sistema volta ao normal?

Isso muda a conversa de “evitar falha” para “tratar falha com critério”.

## Quebrando o problema

Uma forma simples de estruturar esse cenário é esta:

1. diga qual componente falha
2. defina quem depende dele
3. escolha a degradação aceitável
4. explique recuperação, retry ou compensação com limite claro

Isso transforma resiliência em decisão observável.

## Exemplo simples

Imagine uma API de pedidos que depende de um serviço de pagamento.

Se o pagamento cai, algumas opções existem:

- bloquear tudo
- aceitar pedido e deixar pagamento pendente
- enfileirar tentativa posterior com status explícito

A melhor resposta depende do negócio, mas o importante é deixar claro o comportamento.

## Erros comuns

- falar de retry sem limite
- tratar fallback como se fosse sempre seguro
- esquecer consistência depois da recuperação
- descrever alta disponibilidade sem explicar o que acontece quando a falha chega

## Como um senior pensa

Um senior forte não para na palavra resiliência.

Ele define comportamento concreto.

Normalmente isso soa assim:

> Se esse componente falhar, eu não quero que o sistema finja normalidade. Eu quero um modo degradado explícito e uma recuperação que não duplique trabalho nem esconda estado inconsistente.

## O que o entrevistador quer ver

Em entrevista, isso costuma mostrar maturidade rápido:

- você pensa em falha como fluxo do sistema
- você sabe definir degradação aceitável
- você considera recuperação e consistência juntos

Quem faz isso bem parece alguém preparado para ambiente real, não só para happy path bem explicado.

> Sistema maduro não ignora falha. Ele decide como falhar.

> Se a recuperação não está clara, a arquitetura ainda está otimista demais.
