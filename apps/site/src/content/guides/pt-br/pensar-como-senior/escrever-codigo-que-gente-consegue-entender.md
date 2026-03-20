---
title: Escrever Codigo que Gente Consegue Entender
description: Um jeito simples de decidir nomes, estrutura e nivel de abstracao sem transformar o codigo num quebra-cabeca.
summary: Codigo bom nao e o que parece inteligente. E o que outra pessoa consegue entender sem sofrer.
guideId: writing-code-people-can-read
locale: pt-br
status: active
pillarId: thinking-like-a-senior
branchId: code-for-humans
pubDate: 2026-03-17
updatedDate: 2026-03-19
category: Pensar Como Senior
topic: Codigo Facil de Entender
path:
  - Pensar Como Senior
  - Codigo Facil de Entender
order: 10
relationships:
  - trade-offs-and-constraints-without-fake-certainty
tags:
  - senior-thinking
  - readability
  - code-quality
topicIds:
  - delivery
relatedDeckIds: []
---

## O problema

Tem codigo que funciona, passa no teste e mesmo assim deixa todo mundo mais lento.

Nao porque a logica e dificil.

Mas porque cada nome exige interpretacao, cada funcao mistura responsabilidades e cada abstracao parece pedir mais contexto do que entrega.

## Modelo mental

Codigo nao e so instrucao para maquina.

Codigo tambem e explicacao para a proxima pessoa que vai ler, revisar ou mudar aquilo.

Se voce precisa parar a cada linha para decifrar a intencao, o problema nao e falta de inteligencia. O codigo e que esta cobrando contexto demais.

## Quebrando o problema

Uma forma simples de escrever melhor e esta:

1. escolha nomes que expliquem intencao, nao implementacao
2. mantenha uma funcao focada em uma responsabilidade visivel
3. aproxime o codigo que muda junto
4. extraia abstracao so quando ela realmente simplifica a leitura

O objetivo nao e deixar tudo curto.

O objetivo e deixar claro o bastante para outra pessoa continuar sem adivinhar.

## Exemplo simples

Imagine este codigo:

```ts
function p(u) {
  return u.filter((x) => x.a).map((x) => x.n)
}
```

Ele ate funciona.

Mas voce precisa descobrir o que `p`, `u`, `a` e `n` significam antes de confiar no que esta acontecendo.

Uma versao melhor seria:

```ts
function getActiveUserNames(users: User[]) {
  return users.filter((user) => user.isActive).map((user) => user.name)
}
```

Agora a leitura fica quase imediata.

Voce nao ganhou so beleza. Ganhou velocidade de entendimento.

## Erros comuns

- usar nome curto demais para parecer elegante
- quebrar tudo em funcoes pequenas que escondem a linha principal
- criar abstracao cedo demais
- priorizar "codigo seco" quando a leitura ficaria pior

## Como um senior pensa

Um senior forte nao escreve para impressionar.

Ele escreve para reduzir atrito.

Normalmente isso soa assim:

> Se eu voltar aqui daqui a tres meses, eu ainda vou entender rapido o que este bloco faz e por que ele existe?

Essa pergunta costuma melhorar nome, estrutura e nivel de abstracao quase sozinha.

## O que o entrevistador quer ver

Em entrevista, isso aparece de forma simples:

- seus nomes ajudam ou atrapalham?
- sua solucao tem uma linha principal facil de seguir?
- voce sabe quando extrair uma funcao e quando deixar junto?

Quem escreve codigo legivel costuma parecer mais maduro do que quem tenta soar sofisticado.

> Codigo bom nao e o que parece esperto. E o que continua claro quando outra pessoa encosta nele.

> Se a leitura ficou mais dificil depois da abstracao, talvez ela nao tenha ajudado.
