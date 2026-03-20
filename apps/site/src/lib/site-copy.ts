export type SiteLocale = 'en' | 'pt-br'

type SiteCopy = {
  article: {
    categoryLabel: string
    chatShare: string
    comments: string
    completed: string
    exploreRelated: string
    finishedArticle: string
    confirmBody: string
    confirmCancel: string
    confirmConfirm: string
    confirmTitle: string
    copyLink: string
    copyLinkError: string
    copyLinkSuccess: string
    levelLabel: string
    markCompleted: string
    markUnread: string
    nextReads: string
    practice: string
    practiceChecklist: string
    practiceChecklistTitle: string
    practiceInApp: string
    practiceInAppTitle: string
    partOfTrack: string
    quickSummary: string
    quickSummaryTitle: string
    readingTimeLabel: string
    share: string
    shareArticleTitle: string
    shareDescription: string
    shareFallback: string
    shareTitle: string
    tableOfContents: string
    nextStep: string
    updatedPrefix: string
  }
  footer: {
    description: string
    glossary: string
    home: string
    learn: string
    privacy: string
    practice: string
    rss: string
    rights: string
    search: string
    startHere: string
    terms: string
    tracks: string
    title: string
    topics: string
  }
  guideIndex: {
    allItems: string
    articleItems: string
    comingSoon: string
    copy: string
    filterLabel: string
    guideItems: string
    title: string
  }
  challengeIndex: {
    copy: string
    title: string
  }
  glossaryIndex: {
    copy: string
    title: string
  }
  header: {
    brand: string
    closeMenu: string
    explore: string
    menu: string
    primaryNav: string
    languageSwitcher: string
  }
  startHere: {
    articleLabel: string
    backToRoadmap: string
    browseLibrary: string
    completedCountSuffix: string
    continueWhereLeftOff: string
    conceptLabel: string
    copy: string
    exploreFurther: string
    glossary: string
    inThisTrack: string
    introEyebrow: string
    linearHeading: string
    nextArticle: string
    nextTrack: string
    previousArticle: string
    progressLabel: string
    roadmapEyebrow: string
    reviewTrack: string
    stepLabel: string
    stepsLabel: string
    supportCopy: string
    supportHeading: string
    trackCompleted: string
    title: string
    topics: string
  }
  learn: string
  layout: {
    articles: string
    concepts: string
    glossary: string
    home: string
    practice: string
    search: string
    startHere: string
    themeToggle: string
    tracks: string
    topics: string
  }
  search: {
    copy: string
    devNotice: string
    title: string
  }
  topicIndex: {
    copy: string
    title: string
  }
}

const siteCopy: Record<SiteLocale, SiteCopy> = {
  en: {
    article: {
      categoryLabel: 'Category',
      chatShare: 'Share in chat',
      comments: 'Comments',
      completed: 'Completed',
      exploreRelated: 'Or explore related',
      finishedArticle: 'You finished this article',
      confirmBody:
        'When you mark this as complete, it will stop showing up in suggestions. You can still practice the topic later. Do you want to continue?',
      confirmCancel: 'Cancel',
      confirmConfirm: 'Yes, continue',
      confirmTitle: 'Mark this guide as completed?',
      copyLink: 'Copy link',
      copyLinkError: 'This browser could not copy the link.',
      copyLinkSuccess: 'Link copied. You can paste it into any chat.',
      levelLabel: 'Level',
      markCompleted: 'Mark as completed',
      markUnread: 'Mark as unread',
      nextReads: 'Next reads',
      practice: 'Practice',
      practiceChecklist: 'Practice checklist',
      practiceChecklistTitle: 'Use this when you answer',
      practiceInApp: 'Practice in the app',
      practiceInAppTitle: 'Turn this idea into reps',
      partOfTrack: 'Part of the track',
      quickSummary: 'Quick summary',
      quickSummaryTitle: 'What to keep in your head',
      readingTimeLabel: 'Reading time',
      share: 'Share',
      shareArticleTitle: 'Share this page',
      shareDescription: 'Share this page directly from the site, open it in chat, or copy the link.',
      shareFallback: 'This browser could not open the share menu. Use copy link instead.',
      shareTitle: 'Share this page',
      tableOfContents: 'On this page',
      nextStep: 'Next step',
      updatedPrefix: 'Updated',
    },
    footer: {
      description: 'Guided editorial maps and clear guides for people who want to think better before they solve.',
      glossary: 'Glossary',
      home: 'Home',
      learn: 'Articles',
      privacy: 'Privacy policy',
      practice: 'Practice',
      rss: 'RSS feed',
      rights: 'All rights reserved.',
      search: 'Search',
      startHere: 'Start Here',
      terms: 'Terms and conditions',
      tracks: 'Tracks',
      title: 'SeniorPath',
      topics: 'Topics',
    },
    header: {
      brand: 'SeniorPath',
      closeMenu: 'Close menu',
      explore: 'Explore',
      menu: 'Menu',
      primaryNav: 'Primary',
      languageSwitcher: 'Language switcher',
    },
    startHere: {
      articleLabel: 'Article',
      backToRoadmap: 'Back to trail',
      browseLibrary: 'Browse articles',
      completedCountSuffix: 'completed',
      continueWhereLeftOff: 'Continue where you left off',
      conceptLabel: 'Concept',
      copy:
        'A guided reading path for how to think before you jump into solutions, interviews, or challenge-style problems.',
      exploreFurther: 'Explore further',
      glossary: 'Look up a term',
      inThisTrack: 'In this track',
      introEyebrow: 'Trail',
      linearHeading: 'Follow the reading in order',
      nextArticle: 'Next article',
      nextTrack: 'Next track',
      previousArticle: 'Previous article',
      progressLabel: 'Track progress',
      roadmapEyebrow: 'Trail',
      reviewTrack: 'Review the track',
      stepLabel: 'Step',
      stepsLabel: 'Steps',
      supportCopy: 'When you want to browse more freely, use articles, topics, or the glossary as support.',
      supportHeading: 'Keep exploring',
      trackCompleted: 'Track completed',
      title: 'How to think before you solve',
      topics: 'Explore topics',
    },
    guideIndex: {
      allItems: 'All',
      articleItems: 'Articles',
      comingSoon: 'Coming soon',
      copy: 'Direct explanations so you can actually understand the idea, without extra jargon.',
      filterLabel: 'Pick a topic',
      guideItems: 'Guides',
      title: 'Articles without the fluff',
    },
    challengeIndex: {
      copy: 'This section is reserved for future editorial walkthroughs and worked examples.',
      title: 'Challenges',
    },
    glossaryIndex: {
      copy: 'Short reference entries for concepts that keep showing up across guides and interviews.',
      title: 'Glossary',
    },
    learn: 'Articles',
    layout: {
      articles: 'Articles',
      concepts: 'Concepts',
      glossary: 'Glossary',
      home: 'Home',
      practice: 'Practice',
      search: 'Search',
      startHere: 'Start Here',
      themeToggle: 'Toggle theme',
      tracks: 'Tracks',
      topics: 'Topics',
    },
    search: {
      copy: 'Search across articles, topics, and glossary entries from one place.',
      devNotice: 'Search index is generated during build. Use preview/build to test Pagefind locally.',
      title: 'Search the site',
    },
    topicIndex: {
      copy: 'Cross-cutting hubs that connect articles by theme instead of by curriculum branch.',
      title: 'Topics',
    },
  },
  'pt-br': {
    article: {
      categoryLabel: 'Categoria',
      chatShare: 'Compartilhar no chat',
      comments: 'Comentarios',
      completed: 'Concluido',
      exploreRelated: 'Ou explore relacionados',
      finishedArticle: 'Voce concluiu este artigo',
      confirmBody:
        'Quando voce marcar este guia como concluido, ele para de aparecer nas sugestoes. Ainda sera possivel praticar o tema depois. Quer continuar?',
      confirmCancel: 'Cancelar',
      confirmConfirm: 'Sim, continuar',
      confirmTitle: 'Marcar este guia como concluido?',
      copyLink: 'Copiar link',
      copyLinkError: 'Este navegador nao conseguiu copiar o link.',
      copyLinkSuccess: 'Link copiado. Agora voce pode colar em qualquer chat.',
      levelLabel: 'Nivel',
      markCompleted: 'Marcar como concluido',
      markUnread: 'Marcar como nao lido',
      nextReads: 'Proximas leituras',
      practice: 'Praticar',
      practiceChecklist: 'Checklist de pratica',
      practiceChecklistTitle: 'Use isto ao responder',
      practiceInApp: 'Pratique no app',
      practiceInAppTitle: 'Transforme esta ideia em repeticoes',
      partOfTrack: 'Parte da trilha',
      quickSummary: 'Resumo rapido',
      quickSummaryTitle: 'O que vale manter na cabeca',
      readingTimeLabel: 'Tempo de leitura',
      share: 'Compartilhar',
      shareArticleTitle: 'Compartilhar esta pagina',
      shareDescription: 'Compartilhe esta pagina direto do site, abra no chat ou copie o link.',
      shareFallback: 'Este navegador nao conseguiu abrir o menu de compartilhamento. Use copiar link.',
      shareTitle: 'Compartilhar esta pagina',
      tableOfContents: 'Nesta pagina',
      nextStep: 'Proximo passo',
      updatedPrefix: 'Atualizado',
    },
    footer: {
      description: 'Mapas editoriais guiados e guias claros para quem quer pensar melhor antes de resolver.',
      glossary: 'Glossario',
      home: 'Inicio',
      learn: 'Artigos',
      privacy: 'Politica de privacidade',
      practice: 'Praticar',
      rss: 'Feed RSS',
      rights: 'Todos os direitos reservados.',
      search: 'Busca',
      startHere: 'Comece aqui',
      terms: 'Termos e condicoes',
      tracks: 'Trilhas',
      title: 'SeniorPath',
      topics: 'Topicos',
    },
    header: {
      brand: 'SeniorPath',
      closeMenu: 'Fechar menu',
      explore: 'Explorar',
      menu: 'Menu',
      primaryNav: 'Principal',
      languageSwitcher: 'Alternar idioma',
    },
    startHere: {
      articleLabel: 'Artigo',
      backToRoadmap: 'Voltar para a trilha',
      browseLibrary: 'Explorar artigos',
      completedCountSuffix: 'concluidos',
      continueWhereLeftOff: 'Continuar de onde voce parou',
      conceptLabel: 'Conceito',
      copy:
        'Uma trilha guiada de leitura para pensar melhor antes de pular para solucoes, entrevistas ou desafios de codigo.',
      exploreFurther: 'Explore mais',
      glossary: 'Consultar um termo',
      inThisTrack: 'Nesta trilha',
      introEyebrow: 'Trilha',
      linearHeading: 'Siga a leitura em ordem',
      nextArticle: 'Proximo artigo',
      nextTrack: 'Proxima trilha',
      previousArticle: 'Artigo anterior',
      progressLabel: 'Progresso da trilha',
      roadmapEyebrow: 'Trilha',
      reviewTrack: 'Rever a trilha',
      stepLabel: 'Etapa',
      stepsLabel: 'Etapas',
      supportCopy: 'Quando voce quiser explorar com mais liberdade, use os artigos, os topicos e o glossario como apoio.',
      supportHeading: 'Continue explorando',
      trackCompleted: 'Trilha concluida',
      title: 'Como pensar antes de resolver',
      topics: 'Explorar topicos',
    },
    guideIndex: {
      allItems: 'Tudo',
      articleItems: 'Artigos',
      comingSoon: 'Em breve',
      copy: 'Explicacoes diretas para entender de verdade, sem jargao desnecessario.',
      filterLabel: 'Escolha um tema',
      guideItems: 'Guias',
      title: 'Artigos sem enrolação',
    },
    challengeIndex: {
      copy: 'Esta secao fica reservada para walkthroughs editoriais e exemplos resolvidos no futuro.',
      title: 'Desafios',
    },
    glossaryIndex: {
      copy: 'Entradas curtas de referencia para conceitos que aparecem o tempo todo em guias e entrevistas.',
      title: 'Glossario',
    },
    learn: 'Artigos',
    layout: {
      articles: 'Artigos',
      concepts: 'Conceitos',
      glossary: 'Glossario',
      home: 'Inicio',
      practice: 'Praticar',
      search: 'Busca',
      startHere: 'Comece aqui',
      themeToggle: 'Alternar tema',
      tracks: 'Trilhas',
      topics: 'Topicos',
    },
    search: {
      copy: 'Busque em artigos, topicos e termos do glossario em um unico lugar.',
      devNotice: 'O indice de busca e gerado no build. Use preview/build para testar o Pagefind localmente.',
      title: 'Buscar no site',
    },
    topicIndex: {
      copy: 'Hubs transversais que conectam os artigos por tema, nao so pela trilha curricular.',
      title: 'Topicos',
    },
  },
}

export function getSiteLocale(value?: string | null): SiteLocale {
  return value === 'pt-br' ? 'pt-br' : 'en'
}

export function getSiteCopy(value?: string | null) {
  return siteCopy[getSiteLocale(value)]
}
