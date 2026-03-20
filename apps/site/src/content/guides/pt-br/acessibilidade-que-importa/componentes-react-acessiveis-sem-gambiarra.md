---
title: Componentes React Acessiveis Sem Gambiarra
description: Como construir componentes interativos em React sem quebrar semantica, foco e comportamento só porque a abstração ficou bonita.
summary: Componente acessível não é o que recebe aria no fim. É o que nasce com semântica e interação corretas desde o começo.
guideId: accessible-react-components-without-hacks
locale: pt-br
status: active
pillarId: accessibility-that-actually-matters
branchId: accessible-react-components
pubDate: 2026-02-05
updatedDate: 2026-02-09
category: Acessibilidade que importa
topic: Componentes React acessiveis
path:
  - Acessibilidade que importa
  - Componentes React acessiveis
order: 10
relationships:
  - keyboard-and-focus-without-frustration
tags:
  - accessibility
  - react
  - components
topicIds:
  - accessibility
  - react
relatedDeckIds: []
---

## O problema

Muita biblioteca ou design system cria componente bonito, mas acessibilidade entra só no final como remendo.

Daqui a pouco tem `div` com `role="button"`, teclado incompleto, foco estranho e uma pilha de `aria-*` tentando salvar uma base ruim.

O problema não é React. O problema é abstrair interação sem preservar comportamento nativo.

## Modelo mental

Componente acessível não é um visual com atributo extra.

É uma peça que já nasce com:

- elemento semântico correto
- comportamento interativo previsível
- foco coerente
- estado comunicável para tecnologia assistiva

Se a base está errada, o resto vira correção em cima de correção.

## Quebrando o problema

Uma forma simples de construir melhor é esta:

1. comece pelo elemento nativo que mais se aproxima da intenção
2. preserve teclado e foco antes de pensar em API do componente
3. só use `aria-*` quando houver necessidade real de complementar significado
4. teste o componente isolado como se fosse produto final

Isso evita componente “genérico” que exige manual para ser usado com segurança.

## Exemplo simples

Imagine um botão customizado em React:

```tsx
<div onClick={onOpen}>Abrir</div>
```

Visualmente pode parecer igual a um botão.

Mas ele não ganha por padrão:

- foco correto
- acionamento por teclado esperado
- semântica de botão

Uma base melhor seria começar com:

```tsx
<button type="button" onClick={onOpen}>Abrir</button>
```

Depois você estiliza.

Aqui a ordem importa.

## Erros comuns

- começar por `div` e tentar corrigir depois
- criar componente flexível demais e esquecer comportamento nativo
- usar `aria` para compensar semântica errada
- validar layout e esquecer interação real

## Como um senior pensa

Um senior forte não pergunta só “como eu deixo esse componente reutilizável?”.

Ele pergunta:

> Se eu abstrair isso aqui, o comportamento nativo continua inteiro ou eu estou trocando robustez por aparência de flexibilidade?

Essa pergunta melhora muito a qualidade do design system.

## O que o entrevistador quer ver

Em entrevista, isso costuma mostrar maturidade rápido:

- você entende que acessibilidade faz parte da API do componente
- você sabe preservar comportamento nativo antes de customizar
- você pensa em semântica, teclado e foco como parte da abstração

Quem faz isso bem parece alguém que constrói componente para uso real, não só para história bonita no Storybook.

> Componente acessível não nasce no patch final. Nasce na escolha certa da base.

> Se a abstração quebrou semântica e teclado, ela provavelmente ficou bonita antes de ficar correta.
