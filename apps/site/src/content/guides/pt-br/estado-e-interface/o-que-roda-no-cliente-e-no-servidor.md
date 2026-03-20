---
title: O Que Roda no Cliente e no Servidor
description: Como decidir onde cada parte do trabalho deveria acontecer sem transformar a arquitetura numa mistura confusa.
summary: Quando voce nao separa bem cliente e servidor, a UI fica mais lenta, mais frágil e mais dificil de manter.
guideId: server-and-client-thinking-without-confusion
locale: pt-br
status: active
pillarId: state-and-ui-thinking
branchId: server-and-client-thinking
pubDate: 2026-03-09
updatedDate: 2026-03-13
category: Estado e interface
topic: Cliente e servidor
path:
  - Estado e interface
  - O que roda no cliente e no servidor
order: 10
relationships:
  - effects-without-the-mess
tags:
  - react
  - server
  - client
topicIds:
  - react
relatedDeckIds: []
---

## O problema

Muita arquitetura de frontend fica estranha porque o time mistura trabalho de cliente e servidor sem critério claro.

Daqui a pouco tem fetch no lugar errado, dado sensivel indo para o browser sem necessidade e componente cliente fazendo trabalho que poderia chegar pronto.

O resultado costuma ser mais complexidade, mais loading e menos clareza.

## Modelo mental

Cliente e servidor nao sao so lugares diferentes.

Eles tem responsabilidades diferentes.

De forma simples:

- servidor e bom para buscar dado, validar regra, proteger segredo e montar resposta
- cliente e bom para interacao, estado local, evento do usuario e atualizacao imediata da interface

Quando essa divisao fica clara, muita decisao fica mais facil.

## Quebrando o problema

Antes de decidir onde algo roda, tente responder:

1. isso precisa de segredo, permissao ou acesso direto a backend?
2. isso depende de clique, digitação ou interacao imediata?
3. isso pode chegar pronto para reduzir trabalho no browser?
4. essa logica precisa mesmo ficar exposta no cliente?

Essas perguntas evitam muita mistura desnecessaria.

## Exemplo simples

Imagine uma pagina que mostra pedidos e permite filtrar por status.

Uma divisao razoavel seria:

- servidor busca os pedidos e devolve os dados iniciais
- cliente controla o filtro selecionado e a interacao da tela

O erro comum seria colocar toda a busca, transformacao e regra de acesso no cliente so porque "ja estamos no componente".

Isso aumenta custo no browser e embaralha responsabilidades.

## Erros comuns

- mandar para o cliente trabalho que poderia vir resolvido do servidor
- colocar segredo ou logica sensivel perto da interface
- tratar qualquer componente interativo como se tudo precisasse ser client-side
- decidir pela conveniencia do arquivo atual, e nao pela responsabilidade real

## Como um senior pensa

Um senior forte nao pergunta primeiro "em que arquivo eu escrevo isso?".

Ele pergunta:

> Qual lado deveria ser dono dessa responsabilidade para a interface ficar mais simples e mais segura?

Essa pergunta melhora performance, manutencao e clareza ao mesmo tempo.

## O que o entrevistador quer ver

Em entrevista, isso costuma mostrar maturidade bem rapido:

- voce entende que cliente e servidor tem papeis diferentes
- voce sabe justificar por que algo deveria viver de um lado e nao do outro
- voce pensa em seguranca, simplicidade e custo de renderizacao

Quem faz isso bem passa a imagem de alguem que sabe desenhar interface alem do componente isolado.

> Cliente serve para interagir. Servidor serve para preparar e proteger o que a interface precisa.

> Se tudo foi parar no cliente por conveniencia, a arquitetura provavelmente perdeu criterio no caminho.
