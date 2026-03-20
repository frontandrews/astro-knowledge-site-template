---
title: Entradas e APIs Mais Seguras
description: Como tratar entrada externa com menos ingenuidade e desenhar APIs que nao aceitam dado demais por conveniencia.
summary: API segura nao e a que confia no payload bonito. E a que valida, restringe e reduz superficie de erro.
guideId: safer-input-and-api-design
locale: pt-br
status: active
pillarId: security-thinking
branchId: input-and-api-safety
pubDate: 2026-03-04
updatedDate: 2026-03-08
category: Seguranca na pratica
topic: Entradas e APIs mais seguras
path:
  - Seguranca na pratica
  - Entradas e APIs mais seguras
order: 10
relationships:
  - auth-and-authorization-without-mixing-them-up
tags:
  - security
  - api
  - validation
topicIds:
  - security
relatedDeckIds: []
---

## O problema

Muita API fica vulneravel nao por falta de auth, mas porque aceita entrada demais sem criterio.

Campo extra passa, formato errado passa, valor inesperado passa, e o sistema vai tentando lidar com tudo depois.

Esse "depois" costuma sair caro.

## Modelo mental

Entrada externa nunca deveria entrar no sistema como verdade pronta.

Ela precisa passar por algumas perguntas:

- este formato e valido?
- este campo deveria existir?
- este valor faz sentido neste contexto?
- este dado tem permissao para provocar essa acao?

Seguranca aqui tem muito a ver com disciplina de fronteira.

## Quebrando o problema

Uma forma simples de deixar entrada mais segura e esta:

1. valide formato logo na borda
2. aceite so os campos que o fluxo realmente precisa
3. normalize o que for necessario antes de usar
4. rejeite cedo o que nao faz sentido

Isso reduz superficie de erro, abuso e comportamento inesperado.

## Exemplo simples

Imagine um endpoint de atualizacao de perfil.

Se ele recebe um objeto inteiro e faz merge cego no usuario, qualquer campo inesperado pode acabar entrando no modelo:

- `role`
- `isAdmin`
- configuracao interna

Uma versao melhor aceita so o contrato minimo:

- `name`
- `bio`
- `avatarUrl`

O ganho aqui nao e so organizacao.

E controle sobre o que realmente pode ser alterado.

## Erros comuns

- confiar no frontend para enviar payload correto
- validar tipo sem validar regra de negocio
- aceitar campos extras “porque depois a gente ignora”
- deixar a API generica demais para parecer flexivel

## Como um senior pensa

Um senior forte trata input como superficie de risco.

Normalmente isso soa assim:

> Eu quero validar cedo e aceitar o menor contrato possivel, porque cada campo extra aumenta a area de comportamento que o sistema precisa defender.

Essa postura melhora seguranca e clareza ao mesmo tempo.

## O que o entrevistador quer ver

Em entrevista, isso costuma mostrar maturidade rapido:

- voce entende que input externo precisa ser validado na borda
- voce pensa em contrato minimo, nao em payload aberto
- voce liga seguranca a desenho de API, nao so a middleware

Quem faz isso bem parece alguem que reduz risco antes de ele entrar no sistema.

> API mais segura nao aceita tudo e tenta sobreviver. Ela aceita pouco e de forma deliberada.

> Se qualquer payload "quase certo" entra no sistema, a borda ainda esta frouxa demais.
