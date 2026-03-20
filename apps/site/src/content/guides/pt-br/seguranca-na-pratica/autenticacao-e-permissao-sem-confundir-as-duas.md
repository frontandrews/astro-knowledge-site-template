---
title: Autenticacao e Permissao Sem Confundir as Duas
description: Como separar identidade de autorização sem tratar login como se ele resolvesse controle de acesso sozinho.
summary: Saber quem o usuário é não responde automaticamente o que ele pode fazer.
guideId: auth-and-authorization-without-mixing-them-up
locale: pt-br
status: active
pillarId: security-thinking
branchId: auth-and-authorization
pubDate: 2026-02-09
updatedDate: 2026-02-13
category: Seguranca na pratica
topic: Autenticacao e permissao
path:
  - Seguranca na pratica
  - Autenticacao e permissao
order: 10
relationships:
  - trust-boundaries-without-hand-waving
  - safer-input-and-api-design
tags:
  - security
  - auth
  - authorization
topicIds:
  - security
relatedDeckIds: []
---

## O problema

Muita aplicação trata autenticação como se ela encerrasse a conversa de segurança.

O usuário fez login, então parece que o sistema já sabe o suficiente.

Mas login só responde quem a pessoa é. Não responde o que ela pode fazer.

## Modelo mental

Autenticação e autorização resolvem perguntas diferentes:

- autenticação: quem é você?
- autorização: você pode fazer isso aqui?

Misturar essas duas coisas costuma criar acesso indevido em fluxos que pareciam seguros na superfície.

## Quebrando o problema

Uma forma simples de pensar melhor é esta:

1. confirme a identidade do usuário
2. descubra qual recurso ou ação está sendo acessado
3. valide a permissão no servidor
4. nunca trate a interface como fonte final da autorização

Isso evita boa parte dos erros mais básicos.

## Exemplo simples

Imagine um painel onde o frontend esconde o botão de apagar usuário para quem não é admin.

Se o backend não validar essa permissão e aceitar a requisição mesmo assim, o sistema continua vulnerável.

O erro não está no botão.

O erro está em ter tratado uma regra visual como se fosse regra de acesso.

## Erros comuns

- achar que login já resolve autorização
- confiar na UI para bloquear ação sensível
- usar papel genérico demais sem verificar contexto do recurso
- esquecer que o servidor precisa validar acesso em cada operação crítica

## Como um senior pensa

Um senior forte separa identidade de acesso desde o começo.

Normalmente isso soa assim:

> Primeiro eu confirmo quem é o usuário. Depois eu valido se ele pode executar esta ação neste recurso específico.

Essa separação parece simples, mas evita muito bug grave.

## O que o entrevistador quer ver

Em entrevista, isso costuma mostrar maturidade rápido:

- você sabe diferenciar autenticação de autorização
- você entende que regra visual não substitui validação de acesso
- você pensa em permissão como decisão do backend, não só da interface

Quem faz isso bem parece alguém que entende segurança como fluxo real, não só como tela de login.

> Login prova identidade. Permissão prova limite.

> Se a regra de acesso só existe na interface, ela ainda não existe de verdade.
