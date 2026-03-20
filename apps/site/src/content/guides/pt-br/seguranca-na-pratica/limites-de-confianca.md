---
title: Limites de Confianca
description: Como pensar em seguranca a partir de quem pode confiar em quem, sem transformar tudo em checklist decorado.
summary: Muita falha de seguranca nasce quando o sistema confia cedo demais em dado, usuario ou servico.
guideId: trust-boundaries-without-hand-waving
locale: pt-br
status: active
pillarId: security-thinking
branchId: trust-boundaries
pubDate: 2026-03-17
updatedDate: 2026-03-19
category: Seguranca na pratica
topic: Limites de confianca
path:
  - Seguranca na pratica
  - Limites de confianca
order: 10
relationships:
  - auth-and-authorization-without-mixing-them-up
tags:
  - security
  - trust
  - backend
topicIds:
  - security
relatedDeckIds: []
---

## O problema

Muita falha de seguranca nao vem de criptografia ruim ou ataque mirabolante.

Ela vem de uma suposicao simples e errada:

o sistema tratou algo como confiavel cedo demais.

Pode ser entrada do usuario, token mal validado, dado vindo do cliente ou resposta de outro servico.

## Modelo mental

Seguranca fica mais clara quando voce pensa em limite de confianca.

Ou seja: em que ponto um dado sai de um ambiente nao confiavel e entra num lugar que pode causar impacto real.

A pergunta util aqui costuma ser:

> O que estou aceitando como verdade e por que eu acredito nisso?

## Quebrando o problema

Uma forma simples de mapear isso e esta:

1. descubra de onde o dado vem
2. veja quem pode alterá-lo antes de chegar
3. identifique o que o sistema faz com ele
4. valide ou reduza permissao antes do ponto de impacto

Isso transforma seguranca de tema abstrato em caminho concreto.

## Exemplo simples

Imagine um cliente enviando no payload:

```json
{
  "userId": "123",
  "role": "admin"
}
```

Se o backend usa esse `role` como verdade sem validar no servidor, o limite de confianca foi quebrado.

O problema nao e o JSON.

O problema e ter tratado dado vindo do cliente como se ele tivesse autoridade para decidir permissao.

## Erros comuns

- confiar em dado vindo do cliente sem validar
- assumir que servico interno sempre responde corretamente
- misturar identidade com permissão
- pensar em segurança só depois da funcionalidade pronta

## Como um senior pensa

Um senior forte nao olha primeiro para ferramenta.

Ele olha para o fluxo de confiança.

Normalmente isso soa assim:

> Antes de decidir a proteção, eu quero mapear em que pontos o sistema troca dado com ambiente não confiável e onde isso pode virar impacto real.

Essa postura evita muita vulnerabilidade básica.

## O que o entrevistador quer ver

Em entrevista, isso costuma mostrar maturidade rápido:

- você entende que segurança começa na modelagem de confiança
- você sabe localizar pontos de validação
- você pensa em impacto real, não só em palavra bonita

Quem faz isso bem parece alguém que projeta sistema mais seguro sem depender de teatro.

> Segurança começa quando você para de assumir confiança por conveniência.

> Se o sistema não sabe por que acredita num dado, ele provavelmente está acreditando cedo demais.
