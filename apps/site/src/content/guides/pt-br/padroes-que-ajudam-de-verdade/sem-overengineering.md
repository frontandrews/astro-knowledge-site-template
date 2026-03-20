---
title: Sem Overengineering
description: Como resistir a vontade de construir demais cedo demais e manter o sistema simples o suficiente para o problema atual.
summary: Overengineering quase sempre parece preparo para o futuro. Na pratica, muitas vezes e so custo antecipado sem necessidade real.
guideId: avoiding-overengineering-without-regret
locale: pt-br
status: active
pillarId: patterns-that-actually-matter
branchId: avoiding-overengineering
pubDate: 2026-01-12
updatedDate: 2026-01-15
category: Padroes que ajudam de verdade
topic: Sem overengineering
path:
  - Padroes que ajudam de verdade
  - Sem overengineering
order: 10
relationships:
  - reuse-without-extra-complexity
tags:
  - patterns
  - architecture
  - overengineering
topicIds:
  - architecture-patterns
relatedDeckIds: []
---

## O problema

Overengineering quase nunca chega com cara de exagero.

Ele costuma chegar com cara de cuidado, flexibilidade e "vamos deixar pronto para quando crescer".

O problema e que muito desse preparo antecipa complexidade antes de existir pressao real para pagá-la.

## Modelo mental

Sistema bom nao e o que contem toda a flexibilidade imaginavel.

E o que resolve bem o problema atual sem bloquear a evolucao futura.

A pergunta util aqui costuma ser:

> Eu estou resolvendo uma necessidade real ou me protegendo de um futuro que ainda nao apareceu?

Isso ajuda a separar prudencia de excesso.

## Quebrando o problema

Uma forma simples de evitar overengineering e esta:

1. descreva o problema real de hoje
2. diga qual mudanca provavel pode acontecer em seguida
3. meca se a complexidade nova resolve esse futuro proximo ou so futuros imaginarios
4. escolha a menor estrutura que deixa o sistema evoluir sem drama

Isso protege a equipe de pagar custo alto cedo demais.

## Exemplo simples

Imagine uma funcionalidade que hoje envia notificacao por email.

Uma resposta excessiva seria criar de cara:

- barramento de eventos generico
- provider plugavel para varios canais
- painel de retry
- orquestracao preparada para cinco tipos de notificação

Tudo isso antes mesmo de existir um segundo canal real.

Uma resposta melhor pode ser:

- isolar o envio de email numa fronteira simples
- deixar o fluxo claro
- preparar extensao onde ela for mais provavel

Assim voce mantem caminho para evoluir sem pagar arquitetura inteira adiantada.

## Erros comuns

- construir para cenarios ainda hipoteticos
- chamar complexidade de flexibilidade
- usar padrao conhecido so porque ele parece mais profissional
- esquecer o custo de explicar, testar e manter a estrutura nova

## Como um senior pensa

Um senior forte nao pensa so no que seria bonito daqui a dois anos.

Ele pensa no custo que a equipe vai carregar ja a partir de hoje.

Normalmente isso soa assim:

> Se esse nivel extra de arquitetura nao resolve uma pressao real agora ou no futuro proximo, eu prefiro manter simples e abrir espaco para evoluir quando o sinal aparecer.

Essa postura costuma produzir sistema mais saudável e time mais rapido.

## O que o entrevistador quer ver

Em entrevista, isso costuma mostrar maturidade rapido:

- voce sabe equilibrar simplicidade e evolucao
- voce nao confunde arquitetura grande com arquitetura boa
- voce entende custo de manutencao, explicacao e teste

Quem faz isso bem parece alguem que sabe desenhar sistema com disciplina, nao com ansiedade.

> Overengineering nao e pensar no futuro. E cobrar caro demais do presente por um futuro que talvez nunca venha.

> Se a estrutura nova exige justificativa demais, talvez ela ainda nao precise existir.
