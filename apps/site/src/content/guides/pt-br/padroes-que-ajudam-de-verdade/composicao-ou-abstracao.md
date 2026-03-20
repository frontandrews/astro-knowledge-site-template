---
title: Composicao ou Abstracao?
description: Como escolher entre juntar pecas simples ou criar uma camada generica sem transformar flexibilidade em bagunca.
summary: Nem toda repeticao pede abstracao. As vezes a composicao simples deixa o sistema mais claro e mais facil de mudar.
guideId: composition-vs-abstraction-without-theatre
locale: pt-br
status: active
pillarId: patterns-that-actually-matter
branchId: composition-vs-abstraction
pubDate: 2026-02-15
updatedDate: 2026-02-19
category: Padroes que ajudam de verdade
topic: Composicao ou abstracao
path:
  - Padroes que ajudam de verdade
  - Composicao ou abstracao?
order: 10
relationships:
  - reuse-without-extra-complexity
tags:
  - patterns
  - architecture
  - abstraction
topicIds:
  - architecture-patterns
relatedDeckIds: []
---

## O problema

Muita abstracao nasce cedo demais.

O time vê duas partes parecidas, cria uma camada generica para "evitar repeticao" e logo o codigo fica mais esperto do que claro.

No começo parece elegante. Depois, qualquer mudanca exige entender uma API interna que quase ninguem queria ter.

## Modelo mental

Abstracao boa reduz carga mental.

Abstracao ruim esconde diferenca importante atras de uma interface bonita.

Por isso, antes de abstrair, vale perguntar:

> Eu estou simplificando a leitura ou so escondendo variacao cedo demais?

Muitas vezes, composicao simples resolve melhor.

## Quebrando o problema

Uma forma simples de decidir e esta:

1. veja se as partes realmente mudam juntas
2. confirme se a variacao ja esta clara o bastante
3. teste se a composicao simples ainda fica legivel
4. so abstraia quando a nova camada realmente reduzir duplicacao e duvida

Isso evita criar ferramenta interna para um problema que ainda nem amadureceu.

## Exemplo simples

Imagine tres cards de interface com pequenas variacoes de titulo, CTA e bloco visual.

Uma resposta apressada seria criar um `SuperCard` com dezenas de props para cobrir todos os casos.

Uma resposta melhor pode ser:

- manter um container base
- compor partes menores
- deixar cada variante explicita onde a diferenca realmente importa

Nesse caso, a composicao preserva clareza sem obrigar todo mundo a aprender uma abstracao precoce.

## Erros comuns

- abstrair na primeira repeticao
- tratar qualquer duplicacao como defeito
- esconder regra diferente atras da mesma interface
- criar componente generico que aceita tudo e explica pouco

## Como um senior pensa

Um senior forte nao abstrai para parecer sofisticado.

Ele abstrai para reduzir atrito futuro.

Normalmente isso soa assim:

> Se essa camada nova nao deixar a intencao mais clara e a mudanca mais barata, talvez ela ainda nao precise existir.

Essa pergunta costuma evitar muito design excessivo.

## O que o entrevistador quer ver

Em entrevista, isso costuma mostrar maturidade rapido:

- voce sabe diferenciar repeticao aceitavel de repeticao ruim
- voce entende quando composicao simples e melhor do que generalizacao
- voce pensa em legibilidade e evolucao, nao so em "codigo seco"

Quem faz isso bem parece alguem que usa padrao como ferramenta, nao como trofeu.

> Nem toda repeticao pede abstracao. Algumas pedem paciencia para deixar o problema aparecer melhor.

> Se a camada nova exige mais explicacao do que o codigo antigo, talvez ela ainda nao ajudou.
