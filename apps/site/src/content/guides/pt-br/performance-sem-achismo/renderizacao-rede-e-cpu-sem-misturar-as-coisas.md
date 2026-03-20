---
title: Renderizacao, Rede e CPU Sem Misturar as Coisas
description: Como separar tipos diferentes de lentidao para nao chamar tudo de performance e atacar o lugar errado.
summary: Nem toda tela lenta sofre do mesmo problema. As vezes o atraso e rede, as vezes e render, as vezes e CPU.
guideId: rendering-network-and-cpu-without-mixing-them-up
locale: pt-br
status: active
pillarId: performance-that-makes-sense
branchId: rendering-network-and-cpu
pubDate: 2026-02-17
updatedDate: 2026-02-20
category: Performance sem achismo
topic: Renderizacao, rede e CPU
path:
  - Performance sem achismo
  - Renderizacao, rede e CPU
order: 10
relationships:
  - bottleneck-detection-without-guessing
  - measure-before-you-optimize
tags:
  - performance
  - rendering
  - network
topicIds:
  - performance
relatedDeckIds: []
---

## O problema

Quando uma tela fica lenta, e comum chamar tudo de "problema de performance" como se fosse uma categoria unica.

So que rede lenta, renderizacao pesada e CPU ocupada geram sintomas parecidos com causas bem diferentes.

Se voce mistura essas coisas, a chance de otimizar no lugar errado sobe muito.

## Modelo mental

Um jeito util de pensar e separar tres fontes comuns de atraso:

- rede: o dado demora para chegar
- CPU: o trabalho computacional demora para terminar
- renderizacao: o browser demora para transformar estado em interface

Essas categorias se cruzam, mas nao sao a mesma coisa.

## Quebrando o problema

Uma forma simples de diagnosticar melhor e esta:

1. veja se a espera esta antes ou depois do dado chegar
2. descubra se o browser esta gastando tempo computando demais
3. confira se a interface esta repintando ou recalculando mais do que deveria
4. ataque o tipo certo de lentidao, nao o nome generico "performance"

Isso reduz muito o risco de ajuste cosmetico.

## Exemplo simples

Imagine uma pagina de busca que parece lenta.

Tres cenarios diferentes podem existir:

- a API demora 2 segundos para responder
- a resposta chega rapido, mas um filtro pesado bloqueia CPU no cliente
- o dado chega e o filtro e leve, mas a interface re-renderiza componentes demais

Para o usuario, os tres casos podem soar como "a tela esta lenta".

Para quem vai corrigir, sao tres problemas diferentes.

## Erros comuns

- chamar qualquer atraso de renderizacao
- memoizar componente quando o problema e rede
- reduzir payload quando o gargalo e calculo local
- otimizar sem separar qual recurso esta realmente sofrendo

## Como um senior pensa

Um senior forte primeiro classifica o tipo de lentidao.

Normalmente isso soa assim:

> Antes de decidir a otimização, eu quero separar se a espera esta no dado chegando, no trabalho sendo processado ou na interface sendo desenhada.

Essa classificacao deixa a conversa muito mais precisa.

## O que o entrevistador quer ver

Em entrevista, isso costuma mostrar maturidade rapido:

- voce sabe que performance nao e um bloco unico
- voce consegue separar sintomas parecidos por causa diferente
- voce escolhe a resposta tecnica mais coerente com o recurso afetado

Quem faz isso bem parece alguem que melhora produto com diagnostico real, nao com chute bem intencionado.

> Tela lenta nao e diagnostico. E so sintoma.

> Se voce nao separou rede, CPU e renderizacao, ainda esta cedo para escolher a otimização.
