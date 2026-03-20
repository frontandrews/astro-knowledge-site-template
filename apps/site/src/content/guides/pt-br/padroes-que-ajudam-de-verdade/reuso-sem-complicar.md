---
title: Reuso Sem Complicar
description: Como compartilhar logica e estrutura sem transformar o codigo em uma rede de dependencias fragil e dificil de entender.
summary: Reuso bom economiza trabalho futuro. Reuso ruim espalha acoplamento e deixa toda mudanca mais cara.
guideId: reuse-without-extra-complexity
locale: pt-br
status: active
pillarId: patterns-that-actually-matter
branchId: reuse-vs-complexity
pubDate: 2026-02-18
updatedDate: 2026-02-22
category: Padroes que ajudam de verdade
topic: Reuso sem complicar
path:
  - Padroes que ajudam de verdade
  - Reuso sem complicar
order: 10
relationships:
  - composition-vs-abstraction-without-theatre
  - avoiding-overengineering-without-regret
tags:
  - patterns
  - reuse
  - complexity
topicIds:
  - architecture-patterns
relatedDeckIds: []
---

## O problema

Reuso parece sempre uma boa ideia no comeco.

Se duas partes fazem algo parecido, a tentacao e juntar tudo logo para "nao duplicar".

O problema e que reuso ruim nao elimina custo. Ele so move o custo para mais tarde, em forma de acoplamento e comportamento dificil de mudar.

## Modelo mental

Reusar nao significa compartilhar qualquer coisa.

Significa compartilhar o que realmente muda junto e continua fazendo sentido no mesmo lugar.

A pergunta util aqui costuma ser:

> Eu estou removendo duplicacao de verdade ou so colando coisas parecidas cedo demais?

## Quebrando o problema

Uma forma simples de decidir melhor e esta:

1. veja se os casos realmente tem a mesma responsabilidade
2. confira se eles mudam pelos mesmos motivos
3. meca o custo de entender a camada compartilhada
4. so extraia quando o reuso reduzir mudanca repetida sem piorar leitura

Isso ajuda a evitar utilitario generico que todo mundo usa e ninguem gosta.

## Exemplo simples

Imagine dois fluxos de envio de email.

Os dois montam mensagem, chamam provider e registram log.

Se a regra principal for a mesma, pode fazer sentido compartilhar uma parte do fluxo.

Mas se um envia onboarding e o outro envia alerta critico, talvez o que parece reuso seja so coincidencia superficial.

Juntar cedo demais pode esconder diferencas de prioridade, retry, auditoria e template.

## Erros comuns

- extrair codigo na primeira semelhanca
- compartilhar coisa que muda por motivos diferentes
- criar utilitario generico que aceita parametro demais
- tratar duplicacao pequena como pecado maior do que complexidade estrutural

## Como um senior pensa

Um senior forte reusa com criterio, nao por reflexo.

Normalmente isso soa assim:

> Se o custo para entender a camada compartilhada ficar maior do que repetir um pouco agora, talvez o reuso ainda nao compense.

Essa pergunta costuma proteger o sistema de acoplamento bonito no papel e ruim na manutencao.

## O que o entrevistador quer ver

Em entrevista, isso costuma mostrar maturidade rapido:

- voce entende que reuso tambem tem custo
- voce sabe avaliar mudanca conjunta, nao so semelhanca visual
- voce protege legibilidade e evolucao do sistema

Quem faz isso bem parece alguem que sabe quando compartilhar e quando deixar separado sem culpa.

> Reuso nao vale por existir. Ele vale quando reduz trabalho futuro sem aumentar confusao.

> Se tudo depende da mesma camada compartilhada, qualquer mudanca pequena pode ficar grande demais.
