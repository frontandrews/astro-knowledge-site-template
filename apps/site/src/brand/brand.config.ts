export type BrandLocale = string

export type LocalizedBrandText = Record<BrandLocale, string>

export type BrandLocaleDefinition = {
  code: string
  htmlLang: string
  label: string
  shortLabel: string
}

export type ShellFeature = 'search' | 'newsletter' | 'comments' | 'localeSwitcher'

export type HomeDefaultSection = string

export const brandConfig = {
  features: {
    comments: false,
    localeSwitcher: true,
    newsletter: false,
    search: true,
  },
  locales: {
    default: 'en',
    supported: [
      {
        code: 'en',
        htmlLang: 'en',
        label: 'English',
        shortLabel: 'EN',
      },
      {
        code: 'pt-br',
        htmlLang: 'pt-BR',
        label: 'Português',
        shortLabel: 'PT',
      },
    ] as BrandLocaleDefinition[],
  },
  home: {
    defaultSection: 'articles' as HomeDefaultSection,
    landing: {
      description: {
        en: 'A reusable editorial shell for publishing structured articles, tracks, concepts, glossary pages, and practice content.',
        'pt-br':
          'Uma shell editorial reutilizavel para publicar artigos, trilhas, conceitos, glossario e conteudo de pratica com estrutura.',
      },
      eyebrow: {
        en: 'Reusable shell',
        'pt-br': 'Shell reutilizavel',
      },
      title: {
        en: 'Start from the structure, customize the brand later',
        'pt-br': 'Comece pela estrutura e personalize a marca depois',
      },
    },
  },
  integrations: {
    comments: {
      enabled: false,
      provider: 'giscus' as const,
    },
    newsletter: {
      enabled: false,
    },
  },
  legal: {
    governingLaw: null,
    governingVenue: null,
    legalEmail: null,
    ownerLocation: null,
    ownerName: null,
    routes: {
      privacy: {
        en: 'privacy',
        'pt-br': 'politica-de-privacidade',
      },
      terms: {
        en: 'terms-and-services',
        'pt-br': 'termos-e-servicos',
      },
    },
    supportEmail: null,
  },
  site: {
    description: 'Reusable editorial site shell for articles, tracks, topics, and reference content.',
    name: 'Site Template',
    storageNamespace: 'site-template',
    url: 'https://example.com',
  },
} as const
