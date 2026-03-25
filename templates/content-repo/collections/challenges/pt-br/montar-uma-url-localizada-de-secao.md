---
challengeId: build-a-localized-section-url
title: Montar uma URL localizada de secao
description: Gere a URL publica de uma secao sem duplicar barras.
summary: Um desafio pequeno para validar o playground e espelhar uma preocupacao real do template.
locale: pt-br
pubDate: 2026-03-24
status: active
type: strings
typeLabel: Manipulacao de strings
level: beginner
estimatedMinutes: 10
solutionLanguage: typescript
order: 10
commonMistakes:
  - Esquecer de normalizar slugs vazios antes de concatenar strings.
  - Adicionar o prefixo de locale no ingles quando a locale padrao deve ficar plana.
hints:
  - Monte a base primeiro e acrescente o slug apenas quando ele existir.
  - Remova barras extras no inicio e no fim do slug antes de juntar.
whatToNotice:
  - Helpers pequenos de URL se duplicam facil e acabam divergindo.
  - Um template reutilizavel ganha muito com um unico construtor canonico de rotas.
relatedArticleIds:
  - customize-the-template-after-clone
relatedChallengeIds: []
testCases:
  - description: A rota em ingles continua plana
    input:
      - en
      - articles
      - starter
    expected: /articles/starter
  - description: A rota em portugues recebe o prefixo de locale
    input:
      - pt-br
      - artigos
      - primeiro-clone
    expected: /pt-br/artigos/primeiro-clone
  - description: Slug vazio retorna a URL da secao
    input:
      - en
      - glossary
      - ''
    expected: /glossary
starterCode: |
  export function buildSectionUrl(locale: string, section: string, slug = ''): string {
    const normalizedSlug = slug.trim().replace(/^\/+|\/+$/g, '')
    const base = locale === 'pt-br' ? `/pt-br/${section}` : `/${section}`

    return normalizedSlug ? `${base}/${normalizedSlug}` : base
  }
---
## Objetivo

Implemente um helper pequeno que devolve URLs publicas de secao para rotas em ingles e portugues.

## Por que esse desafio existe

Mesmo helpers pequenos de path valem ser centralizados numa shell reutilizavel. Eles moldam navegacao, URLs canonicas e links internos no projeto inteiro.
