---
title: Limites de confianca
description: Como pensar onde a confianca comeca e termina num sistema, em vez de assumir que dado interno e seguro por definicao.
summary: Limite de confianca e a linha onde dado, identidade ou controle passa de um nivel de confianca para outro.
conceptId: trust-boundaries
domainId: security
groupId: trust
locale: pt-br
status: active
pubDate: 2026-03-19
tags:
  - seguranca
  - auth
  - api
relatedGuideIds:
  - trust-boundaries-without-hand-waving
  - safer-input-and-api-design
---

## O que e

Limite de confianca e o ponto onde voce deveria parar de assumir que algo e seguro por padrao.

Isso pode acontecer entre browser e servidor, servico e banco, sistema interno e fornecedor, ou usuario comum e admin.

## Quando importa

Importa sempre que dado cruza sistemas, permissao muda ou entrada chega de fora do contexto atual.

Se voce ignora essa fronteira, costuma ignorar validacao e autorizacao junto.

## Erro comum

O erro comum e tratar "interno" como automaticamente confiavel.

Sistema interno tambem pode estar errado, desatualizado ou mal configurado.

## Exemplo curto

Se um servico diz que um usuario e admin, outro servico ainda precisa decidir o que isso significa dentro das regras dele.

Confiar cegamente no rótulo pode virar bug de permissao.

## Por que isso ajuda

Esse conceito deixa seguranca mais concreta.

Em vez de medo vago, voce ganha uma pergunta melhor: onde a confianca muda aqui, e quais checks pertencem nessa borda?
