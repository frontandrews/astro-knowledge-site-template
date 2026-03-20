---
title: Teclado e Foco Sem Frustracao
description: Como desenhar navegação por teclado e fluxo de foco sem deixar a interface previsível só para quem usa mouse.
summary: Quando foco some, pula errado ou prende o usuário, a interface deixa de ser confiável mesmo que pareça bonita.
guideId: keyboard-and-focus-without-frustration
locale: pt-br
status: active
pillarId: accessibility-that-actually-matters
branchId: keyboard-and-focus
pubDate: 2026-02-21
updatedDate: 2026-02-25
category: Acessibilidade que importa
topic: Teclado e foco
path:
  - Acessibilidade que importa
  - Teclado e foco
order: 10
relationships:
  - semantics-and-structure-that-actually-help
  - accessible-react-components-without-hacks
tags:
  - accessibility
  - keyboard
  - focus
topicIds:
  - accessibility
relatedDeckIds: []
---

## O problema

Muita interface parece funcionar até o momento em que alguém tenta usar teclado.

O foco some, entra em ordem estranha, fica preso num modal ou simplesmente não aparece.

Para quem depende dessa navegação, a sensação não é de detalhe ruim. É de fluxo quebrado.

## Modelo mental

Foco é a forma como a interface responde à pergunta:

> Onde eu estou agora e para onde posso ir em seguida?

Se essa resposta não fica clara, a tela perde previsibilidade.

Teclado e foco não são camada extra. São parte da navegação real do produto.

## Quebrando o problema

Uma forma simples de revisar isso é esta:

1. percorra a tela só com `Tab`, `Shift+Tab`, `Enter` e `Esc`
2. confira se a ordem de foco acompanha a lógica visual
3. veja se elementos interativos realmente recebem foco
4. valide se abrir e fechar modal devolve o foco para um lugar coerente

Isso já revela muita fricção que o mouse esconde.

## Exemplo simples

Imagine um modal de confirmação.

Uma versão ruim abre o modal, mas deixa o foco atrás dele ou não permite sair com `Esc`.

Uma versão melhor:

- move o foco para dentro do modal ao abrir
- mantém a navegação dentro dele enquanto está ativo
- devolve o foco ao gatilho quando fecha

Aqui o ganho não é só acessibilidade.

É previsibilidade de interação.

## Erros comuns

- remover estilo de foco por estética
- criar componente clicável que não entra na ordem de teclado
- esquecer de devolver foco depois de overlay, modal ou drawer
- tratar navegação por teclado como teste opcional

## Como um senior pensa

Um senior forte não vê foco como detalhe visual.

Ele vê foco como parte do fluxo.

Normalmente isso soa assim:

> Se alguém usar essa interface sem mouse, o caminho continua claro ou vira loteria?

Essa pergunta melhora muito a qualidade da experiência.

## O que o entrevistador quer ver

Em entrevista, isso costuma mostrar maturidade rápido:

- você entende foco como estado de navegação
- você sabe validar fluxo interativo além do clique
- você pensa em modal, overlay e retorno de foco com critério

Quem faz isso bem parece alguém que constrói interface mais robusta para uso real, não só para demo controlada.

> Foco não serve só para destacar elemento. Serve para orientar a navegação.

> Se o teclado não consegue seguir um caminho claro, a interface ainda não está pronta.
