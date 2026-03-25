---
conceptId: content-contract
title: Contrato de conteudo
description: O acordo minimo entre a shell e a fonte editorial.
summary: A shell espera um manifesto e pastas previsiveis de colecoes para montar rotas e indices com seguranca.
domainId: backend
groupId: apis
locale: pt-br
pubDate: 2026-03-24
relatedArticleIds:
  - customize-the-template-after-clone
status: active
tags:
  - template
  - content
---
## O que significa

Contrato de conteudo e o conjunto de arquivos e campos de que a shell depende antes de renderizar paginas. Neste template, esse contrato comeca com `collections.manifest.json` e as pastas de colecao declaradas nele.

## Por que isso importa

Quando o contrato fica explicito, a shell se torna reutilizavel. Quem clona o projeto consegue trocar a fonte de conteudo sem adivinhar quais pastas ou metadados sao obrigatorios para o app subir.
