import { siteConfig } from '@/lib/site-config'
import { getDefaultLocale, normalizeSiteLocale } from '@/lib/locale-config'

export type SiteLocale = string
type ArticleLevel = 'advanced' | 'beginner' | 'intermediate'
type ChallengeLevel = 'advanced' | 'beginner' | 'intermediate'

type SiteCopy = {
  locale: {
    dateLocale: string
    giscusLang: string
    lowerCaseLocale: string
  }
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
    shareOnLinkedIn: string
    shareOnTwitter: string
    shareOnWhatsApp: string
    shareTitle: string
    tableOfContents: string
    nextStep: string
    openComments: string
    updatedPrefix: string
  }
  articleMeta: {
    categoryLabels: Record<string, string>
    levelLabels: Record<ArticleLevel, string>
  }
  footer: {
    description: string
    glossary: string
    home: string
    newsletterDisclaimerAfterLinks: string
    newsletterDisclaimerBeforeLinks: string
    newsletterDisclaimerBetweenLinks: string
    learn: string
    newsletterInputPlaceholder: string
    newsletterSubmitLabel: string
    newsletterCopy: string
    newsletterTitle: string
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
  articlesIndex: {
    allItems: string
    browseTopicsLabel: string
    comingSoon: string
    copy: string
    filterLabel: string
    articleItems: string
    noteItems: string
    title: string
    viewAllLabel: string
  }
  challengeIndex: {
    allItems: string
    copy: string
    emptyState: string
    filterLabel: string
    more: string
    showLess: string
    title: string
  }
  challenge: {
    commonMistakes: string
    complexity: string
    complexitySpaceLabel: string
    complexityTimeLabel: string
    estimatedTime: string
    levelLabel: string
    nextChallenge: string
    previousChallenge: string
    readChallenge: string
    relatedChallenges: string
    relatedArticles: string
    solutionLanguage: string
    typeLabel: string
    whatToNotice: string
  }
  challengeMeta: {
    levelLabels: Record<ChallengeLevel, string>
  }
  conceptsIndex: {
    copy: string
    title: string
  }
  directory: {
    allItems: string
    filterByConcept: string
    filterBySubtopic: string
    filterByTag: string
    filterByTopic: string
    articleItems: string
    more: string
    nextPage: string
    noteItems: string
    noteBadge: string
    page: string
    previousPage: string
    readAgain: string
    readMore: string
    relatedArticles: string
    showLess: string
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
  searchLauncher: {
    close: string
    emptyNoSections: string
    emptyWithSections: string
    error: string
    hint: string
    loading: string
    noResults: string
    placeholder: string
    shortcut: string
    title: string
    unavailable: string
  }
  siteLabels: Record<string, string>
  solutionReveal: {
    buttonLabel: string
    cancel: string
    confirmSolved: string
    confirmUnsolved: string
    solutionLabel: string
    solvedMessage: string
    solvedTitle: string
    unsolvedMessage: string
    unsolvedTitle: string
  }
  trackProgress: {
    continueTrack: string
    nextLabel: string
    ofLabel: string
  }
  topicIndex: {
    copy: string
    title: string
    viewAllLabel: string
  }
  tracksIndex: {
    copy: string
    filterLabel: string
    title: string
  }
}

const siteCopy: Record<string, SiteCopy> = {
  en: {
    locale: {
      dateLocale: 'en-US',
      giscusLang: 'en',
      lowerCaseLocale: 'en-US',
    },
    article: {
      categoryLabel: 'Category',
      chatShare: 'Share in chat',
      comments: 'Comments',
      completed: 'Completed',
      exploreRelated: 'Or explore related',
      finishedArticle: 'You finished this article',
      confirmBody:
        'When you mark this article as complete, it will stop showing up in suggestions. You can still practice the topic later. Do you want to continue?',
      confirmCancel: 'Cancel',
      confirmConfirm: 'Yes, continue',
      confirmTitle: 'Mark this article as completed?',
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
      shareOnLinkedIn: 'Share on LinkedIn',
      shareOnTwitter: 'Share on X',
      shareOnWhatsApp: 'Share on WhatsApp',
      shareTitle: 'Share this page',
      tableOfContents: 'On this page',
      nextStep: 'Next step',
      openComments: 'View comments',
      updatedPrefix: 'Updated on',
    },
    articleMeta: {
      categoryLabels: {
        frontend: 'Frontend',
        systems: 'Systems',
        thinking: 'Thinking',
      },
      levelLabels: {
        advanced: 'Advanced',
        beginner: 'Beginner',
        intermediate: 'Intermediate',
      },
    },
    footer: {
      description: 'Organized content and easy-to-understand explanations for people who want to think better before they solve.',
      glossary: 'Glossary',
      home: 'Home',
      newsletterDisclaimerAfterLinks: '',
      newsletterDisclaimerBeforeLinks: 'By subscribing, you agree to the ',
      newsletterDisclaimerBetweenLinks: ' and the ',
      learn: 'Articles',
      newsletterInputPlaceholder: 'Your main email',
      newsletterSubmitLabel: 'Subscribe',
      newsletterCopy: 'Sign up to receive important insights about senior growth. No spam.',
      newsletterTitle: 'Subscribe to our newsletter',
      privacy: 'Privacy policy',
      practice: 'Practice',
      rss: 'RSS feed',
      rights: 'All rights reserved.',
      search: 'Search',
      startHere: 'Start Here',
      terms: 'Terms and conditions',
      tracks: 'Tracks',
      title: siteConfig.site.name,
      topics: 'Topics',
    },
    header: {
      brand: siteConfig.site.name,
      closeMenu: 'Close menu',
      explore: 'Explore',
      menu: 'Menu',
      primaryNav: 'Primary navigation',
      languageSwitcher: 'Language switcher',
    },
    startHere: {
      articleLabel: 'Article',
      backToRoadmap: 'Back to track',
      browseLibrary: 'Explore articles',
      completedCountSuffix: 'completed',
      continueWhereLeftOff: 'Continue where you left off',
      conceptLabel: 'Concept',
      copy:
        'A guided reading track for thinking better before you jump into solutions, interviews, or coding-style challenges.',
      exploreFurther: 'Explore further',
      glossary: 'Look up a term',
      inThisTrack: 'In this track',
      introEyebrow: 'Track',
      linearHeading: 'Follow the reading in order',
      nextArticle: 'Next article',
      nextTrack: 'Next track',
      previousArticle: 'Previous article',
      progressLabel: 'Track progress',
      roadmapEyebrow: 'Track',
      reviewTrack: 'Review the track',
      stepLabel: 'Step',
      stepsLabel: 'Steps',
      supportCopy: 'When you want to browse more freely, use articles, topics, or the glossary as support.',
      supportHeading: 'Keep exploring',
      trackCompleted: 'Track completed',
      title: 'How to think before you solve',
      topics: 'Explore topics',
    },
    articlesIndex: {
      allItems: 'All',
      browseTopicsLabel: 'Browse topics',
      comingSoon: 'Coming soon',
      copy: 'Articles, notes, and tracks to help you understand better and decide with more clarity.',
      filterLabel: 'Choose a theme',
      articleItems: 'Articles',
      noteItems: 'Notes',
      title: 'Explaining the things people pretend to understand',
      viewAllLabel: 'View all articles',
    },
    challengeIndex: {
      allItems: 'All',
      copy: 'Step-by-step explanations to help you learn how to solve coding tests and pass live coding interviews.',
      emptyState: 'No challenges have been published here yet.',
      filterLabel: 'Filter by type or level',
      more: 'more',
      showLess: 'Show less',
      title: 'Challenges',
    },
    challenge: {
      commonMistakes: 'Common mistakes',
      complexity: 'Final complexity',
      complexitySpaceLabel: 'Space',
      complexityTimeLabel: 'Time',
      estimatedTime: 'Estimated time',
      levelLabel: 'Level',
      nextChallenge: 'Next challenge',
      previousChallenge: 'Previous challenge',
      readChallenge: 'Open challenge',
      relatedArticles: 'Related articles',
      relatedChallenges: 'Related challenges',
      solutionLanguage: 'Solution language',
      typeLabel: 'Type',
      whatToNotice: 'What to notice before coding',
    },
    challengeMeta: {
      levelLabels: {
        advanced: 'Advanced',
        beginner: 'Beginner',
        intermediate: 'Intermediate',
      },
    },
    conceptsIndex: {
      copy: 'Master the most important concepts to grow your understanding.',
      title: 'Concepts',
    },
    directory: {
      allItems: 'All',
      filterByConcept: 'Filter by concept',
      filterBySubtopic: 'Filter by subtopic',
      filterByTag: 'Filter by tag',
      filterByTopic: 'Filter by topic',
      articleItems: 'Articles',
      more: 'more',
      nextPage: 'Next page',
      noteItems: 'Notes',
      noteBadge: 'Note',
      page: 'Page',
      previousPage: 'Previous page',
      readAgain: 'Read again',
      readMore: 'Read more',
      relatedArticles: 'Related articles',
      showLess: 'Show less',
    },
    glossaryIndex: {
      copy: 'Short reference entries for concepts that keep showing up across articles and interviews.',
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
    searchLauncher: {
      close: 'Close search',
      emptyNoSections: 'No searchable sections are enabled right now.',
      emptyWithSections: 'Type to search across {sections}.',
      error: 'Search is currently unavailable.',
      hint: 'Site search',
      loading: 'Searching...',
      noResults: 'No results found.',
      placeholder: 'Search',
      shortcut: 'Ctrl K',
      title: 'Search',
      unavailable: 'Search is only available in preview/build.',
    },
    siteLabels: {
      'Thinking Like a Senior': 'Thinking Like a Senior',
      'Problem Breakdown': 'Problem Breakdown',
      'Trade-offs and Constraints': 'Trade-offs and Constraints',
      'Code for Humans': 'Code for Humans',
      'Runtime & Execution': 'Runtime & Execution',
      'Event Loop and Execution Order': 'Event loop and execution order',
      'Concurrency and Parallelism': 'Concurrency and parallelism',
      'Memory Basics': 'Memory Basics',
      'Problem Solving & Interview Thinking': 'Problem Solving & Interview Thinking',
      'Approach and Framing': 'Approach and Framing',
      'Pattern Recognition': 'Pattern Recognition',
      'Communicating Solutions': 'Communicating Solutions',
      'State & UI Thinking': 'State & UI Thinking',
      'State Ownership': 'State Ownership',
      'Effects and Side Effects': 'Effects without the mess',
      'Server and Client Thinking': 'Server and Client Thinking',
      'System Thinking': 'System Thinking',
      'AI Systems and Retrieval': 'AI, retrieval, and context',
      'Execution & Communication': 'Execution and communication',
      'Estimation and Risk': 'Estimation and risk',
      'Communication in Work and Interviews': 'Communication at work and in interviews',
      'coding-interview': 'Coding interview',
    },
    solutionReveal: {
      buttonLabel: 'View solution',
      cancel: "I'll keep trying",
      confirmSolved: 'View anyway',
      confirmUnsolved: 'View anyway',
      solutionLabel: 'Solution',
      solvedMessage: 'You already solved this challenge. Want to see the reference solution?',
      solvedTitle: 'Challenge solved!',
      unsolvedMessage: "Viewing the solution now may reduce learning. It's worth trying a bit more.",
      unsolvedTitle: "Haven't solved it yet?",
    },
    trackProgress: {
      continueTrack: 'Continue on this track',
      nextLabel: 'Next',
      ofLabel: 'of',
    },
    topicIndex: {
      copy: 'Content organized by theme. Explore articles and deepen your understanding without confusion.',
      title: 'Topics',
      viewAllLabel: 'View all topics',
    },
    tracksIndex: {
      copy: 'Content organized in sequence to make your progress easier.',
      filterLabel: 'Filter by tag',
      title: 'Tracks to grow with consistency',
    },
  },
  'pt-br': {
    locale: {
      dateLocale: 'pt-BR',
      giscusLang: 'pt',
      lowerCaseLocale: 'pt-BR',
    },
    article: {
      categoryLabel: 'Categoria',
      chatShare: 'Compartilhar no chat',
      comments: 'Comentários',
      completed: 'Concluído',
      exploreRelated: 'Ou explore relacionados',
      finishedArticle: 'Você concluiu este artigo',
      confirmBody:
        'Quando você marcar este artigo como concluído, ele para de aparecer nas sugestões. Ainda será possível praticar o tema depois. Quer continuar?',
      confirmCancel: 'Cancelar',
      confirmConfirm: 'Sim, continuar',
      confirmTitle: 'Marcar este artigo como concluído?',
      copyLink: 'Copiar link',
      copyLinkError: 'Este navegador não conseguiu copiar o link.',
      copyLinkSuccess: 'Link copiado. Agora você pode colar em qualquer chat.',
      levelLabel: 'Nível',
      markCompleted: 'Marcar como concluído',
      markUnread: 'Marcar como não lido',
      nextReads: 'Próximas leituras',
      practice: 'Praticar',
      practiceChecklist: 'Checklist de pratica',
      practiceChecklistTitle: 'Use isto ao responder',
      practiceInApp: 'Pratique no app',
      practiceInAppTitle: 'Transforme esta ideia em repeticoes',
      partOfTrack: 'Parte da trilha',
      quickSummary: 'Resumo rápido',
      quickSummaryTitle: 'O que vale manter na cabeça',
      readingTimeLabel: 'Tempo de leitura',
      share: 'Compartilhar',
      shareArticleTitle: 'Compartilhar esta página',
      shareDescription: 'Compartilhe esta página direto do site, abra no chat ou copie o link.',
      shareFallback: 'Este navegador não conseguiu abrir o menu de compartilhamento. Use copiar link.',
      shareOnLinkedIn: 'Compartilhar no LinkedIn',
      shareOnTwitter: 'Compartilhar no X',
      shareOnWhatsApp: 'Compartilhar no WhatsApp',
      shareTitle: 'Compartilhar esta página',
      tableOfContents: 'Nesta página',
      nextStep: 'Próximo passo',
      openComments: 'Ver comentarios',
      updatedPrefix: 'Atualizado em',
    },
    articleMeta: {
      categoryLabels: {
        frontend: 'Frontend',
        systems: 'Sistemas',
        thinking: 'Pensamento',
      },
      levelLabels: {
        advanced: 'Avancado',
        beginner: 'Iniciante',
        intermediate: 'Intermediario',
      },
    },
    footer: {
      description: 'Conteúdo organizado e explicações fáceis de entender pra quem quer pensar melhor antes de resolver.',
      glossary: 'Glossário',
      home: 'Inicio',
      newsletterDisclaimerAfterLinks: '',
      newsletterDisclaimerBeforeLinks: 'Ao se inscrever, você concorda com os ',
      newsletterDisclaimerBetweenLinks: ' e ',
      learn: 'Artigos',
      newsletterInputPlaceholder: 'Seu email principal',
      newsletterSubmitLabel: 'Inscrever-se',
      newsletterCopy: 'Cadastre-se para receber insights importantes sobre senioridade. Sem spam.',
      newsletterTitle: 'Inscreva-se na nossa newsletter',
      privacy: 'Política de privacidade',
      practice: 'Praticar',
      rss: 'Feed RSS',
      rights: 'Todos os direitos reservados.',
      search: 'Busca',
      startHere: 'Comece aqui',
      terms: 'Termos e condições',
      tracks: 'Trilhas',
      title: siteConfig.site.name,
      topics: 'Tópicos',
    },
    header: {
      brand: siteConfig.site.name,
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
      completedCountSuffix: 'concluídos',
      continueWhereLeftOff: 'Continuar de onde você parou',
      conceptLabel: 'Conceito',
      copy:
        'Uma trilha guiada de leitura para pensar melhor antes de pular para soluções, entrevistas ou desafios de código.',
      exploreFurther: 'Explore mais',
      glossary: 'Consultar um termo',
      inThisTrack: 'Nesta trilha',
      introEyebrow: 'Trilha',
      linearHeading: 'Siga a leitura em ordem',
      nextArticle: 'Próximo artigo',
      nextTrack: 'Próxima trilha',
      previousArticle: 'Artigo anterior',
      progressLabel: 'Progresso da trilha',
      roadmapEyebrow: 'Trilha',
      reviewTrack: 'Rever a trilha',
      stepLabel: 'Etapa',
      stepsLabel: 'Etapas',
      supportCopy: 'Quando você quiser explorar com mais liberdade, use os artigos, os tópicos e o glossário como apoio.',
      supportHeading: 'Continue explorando',
      trackCompleted: 'Trilha concluída',
      title: 'Como pensar antes de resolver',
      topics: 'Explorar tópicos',
    },
    articlesIndex: {
      allItems: 'Tudo',
      browseTopicsLabel: 'Explorar tópicos',
      comingSoon: 'Em breve',
      copy: 'Artigos, notas e trilhas para ajudar você a entender melhor e decidir com mais clareza.',
      filterLabel: 'Escolha um tema',
      articleItems: 'Artigos',
      noteItems: 'Notas',
      title: 'Explicando as coisas que as pessoas fingem entender',
      viewAllLabel: 'Ver todos os artigos',
    },
    challengeIndex: {
      allItems: 'Tudo',
      copy: 'Passo a passo explicado para voce aprender a resolver testes e passar nas entrevistas de live coding.',
      emptyState: 'Ainda nao ha desafios publicados aqui.',
      filterLabel: 'Filtrar por tipo ou nivel',
      more: 'mais',
      showLess: 'Mostrar menos',
      title: 'Desafios',
    },
    challenge: {
      commonMistakes: 'Erros comuns',
      complexity: 'Complexidade final',
      complexitySpaceLabel: 'Espaço',
      complexityTimeLabel: 'Tempo',
      estimatedTime: 'Tempo estimado',
      levelLabel: 'Nivel',
      nextChallenge: 'Proximo desafio',
      previousChallenge: 'Desafio anterior',
      readChallenge: 'Abrir desafio',
      relatedArticles: 'Artigos relacionados',
      relatedChallenges: 'Desafios relacionados',
      solutionLanguage: 'Linguagem da solucao',
      typeLabel: 'Tipo',
      whatToNotice: 'O que perceber antes de codar',
    },
    challengeMeta: {
      levelLabels: {
        advanced: 'Avancado',
        beginner: 'Iniciante',
        intermediate: 'Intermediario',
      },
    },
    conceptsIndex: {
      copy: 'Domine os conceitos mais importantes para evoluir seu conhecimento.',
      title: 'Conceitos',
    },
    directory: {
      allItems: 'Tudo',
      filterByConcept: 'Filtrar por conceito',
      filterBySubtopic: 'Filtrar por subtema',
      filterByTag: 'Filtrar por tag',
      filterByTopic: 'Filtrar por tópico',
      articleItems: 'Artigos',
      more: 'mais',
      nextPage: 'Próxima página',
      noteItems: 'Notas',
      noteBadge: 'Nota',
      page: 'Página',
      previousPage: 'Página anterior',
      readAgain: 'Ler novamente',
      readMore: 'Ler mais',
      relatedArticles: 'Artigos relacionados',
      showLess: 'Mostrar menos',
    },
    glossaryIndex: {
      copy: 'Entradas curtas de referência para conceitos que aparecem o tempo todo em artigos e entrevistas.',
      title: 'Glossário',
    },
    learn: 'Artigos',
    layout: {
      articles: 'Artigos',
      concepts: 'Conceitos',
      glossary: 'Glossário',
      home: 'Inicio',
      practice: 'Praticar',
      search: 'Busca',
      startHere: 'Comece aqui',
      themeToggle: 'Alternar tema',
      tracks: 'Trilhas',
      topics: 'Tópicos',
    },
    search: {
      copy: 'Busque em artigos, tópicos e termos do glossário em um único lugar.',
      devNotice: 'O índice de busca é gerado no build. Use preview/build para testar o Pagefind localmente.',
      title: 'Buscar no site',
    },
    searchLauncher: {
      close: 'Fechar busca',
      emptyNoSections: 'Nenhuma area pesquisavel esta habilitada.',
      emptyWithSections: 'Digite para buscar em {sections}.',
      error: 'A busca não está disponível no momento.',
      hint: 'Busca no site',
      loading: 'Buscando...',
      noResults: 'Nenhum resultado encontrado.',
      placeholder: 'Buscar',
      shortcut: 'Ctrl K',
      title: 'Buscar',
      unavailable: 'A busca só fica disponível em preview/build.',
    },
    siteLabels: {
      'Thinking Like a Senior': 'Pensar como senior',
      'Problem Breakdown': 'Quebrar o problema',
      'Trade-offs and Constraints': 'Trade-offs e limites',
      'Code for Humans': 'Codigo para humanos',
      'Runtime & Execution': 'Como o codigo roda',
      'Event Loop and Execution Order': 'Event loop e ordem de execucao',
      'Concurrency and Parallelism': 'Concorrencia e paralelismo',
      'Memory Basics': 'Memoria',
      'Problem Solving & Interview Thinking': 'Pensamento de entrevista e resolucao de problemas',
      'Approach and Framing': 'Abordagem',
      'Pattern Recognition': 'Reconhecer padroes',
      'Communicating Solutions': 'Explicar solucoes',
      'State & UI Thinking': 'Estado e interface',
      'State Ownership': 'Estado',
      'Effects and Side Effects': 'Effects sem bagunca',
      'Server and Client Thinking': 'Cliente e servidor',
      'Data & Persistence': 'Dados e armazenamento',
      'Data Modeling': 'Modelagem de dados',
      'SQL vs NoSQL': 'SQL vs NoSQL',
      'Cache and Consistency': 'Cache e consistencia',
      'System Thinking': 'Sistemas na pratica',
      'Scalability and Bottlenecks': 'Escala e gargalos',
      'API and Service Design': 'APIs e servicos',
      'AI Systems and Retrieval': 'IA, busca e contexto',
      'Debugging & Production Thinking': 'Debug e producao',
      'Production Failures': 'Falhas em producao',
      'Logs and Observability': 'Logs e observabilidade',
      'Async and Race Bugs': 'Bugs assincronos e race conditions',
      'Patterns That Actually Matter': 'Padroes que ajudam de verdade',
      'Composition vs Abstraction': 'Composicao ou abstracao',
      'Reuse vs Complexity': 'Reuso sem complicar',
      'Avoiding Overengineering': 'Sem overengineering',
      'Performance That Makes Sense': 'Performance sem achismo',
      'Bottleneck Detection': 'Onde esta o gargalo',
      'Rendering, Network, and CPU': 'Renderizacao, rede e CPU',
      'Measurement Before Optimization': 'Medir antes de otimizar',
      'Security Thinking': 'Seguranca na pratica',
      'Trust Boundaries': 'Limites de confianca',
      'Auth and Authorization': 'Autenticacao e permissao',
      'Input and API Safety': 'Entradas e APIs mais seguras',
      'Accessibility That Actually Matters': 'Acessibilidade que importa',
      'Semantics and Structure': 'Semantica e estrutura',
      'Keyboard and Focus': 'Teclado e foco',
      'Accessible React Components': 'Componentes React acessiveis',
      'Execution & Communication': 'Execucao e comunicacao',
      'Ticket and Task Thinking': 'Tickets e tarefas',
      'Estimation and Risk': 'Estimativa e risco',
      'Communication in Work and Interviews': 'Comunicacao no trabalho e em entrevistas',
      'Real-World Scenarios': 'Cenarios reais',
      'Scalable API Scenarios': 'Cenarios de API em escala',
      'Failure and Recovery Scenarios': 'Falha e recuperacao',
      'AI Feature Scenarios': 'Cenarios com IA',
      'AI Engineering': 'Engenharia de IA',
      'Coding Challenges': 'Desafios de Codigo',
      Delivery: 'Entrega',
      Leadership: 'Lideranca',
      'System Design': 'Design de Sistemas',
      'Tech English': 'Ingles para Tech',
      'Problem Solving': 'Resolucao de Problemas',
      React: 'React',
      JavaScript: 'JavaScript',
      Node: 'Node',
      javascript: 'JavaScript',
      react: 'React',
      node: 'Node',
      async: 'assincrono',
      'event loop': 'event loop',
      state: 'estado',
      rendering: 'renderizacao',
      'coding-interview': 'entrevista de codigo',
      'coding interview': 'entrevista de codigo',
      'senior-thinking': 'pensamento senior',
      'problem-solving': 'resolucao de problemas',
      interviews: 'entrevistas',
      rag: 'rag',
      retrieval: 'retrieval',
      llms: 'llms',
      delivery: 'entrega',
      communication: 'comunicacao',
      risk: 'risco',
    },
    solutionReveal: {
      buttonLabel: 'Ver solução',
      cancel: 'Vou tentar mais',
      confirmSolved: 'Ver mesmo assim',
      confirmUnsolved: 'Ver mesmo assim',
      solutionLabel: 'Solução',
      solvedMessage: 'Você já resolveu este desafio. Quer ver a solução de referência?',
      solvedTitle: 'Desafio resolvido!',
      unsolvedMessage: 'Ver a solução agora pode reduzir o aprendizado. Vale a pena tentar mais um pouco.',
      unsolvedTitle: 'Ainda não resolveu?',
    },
    trackProgress: {
      continueTrack: 'Continue nesta trilha',
      nextLabel: 'Próximo',
      ofLabel: 'de',
    },
    topicIndex: {
      copy: 'Conteúdos organizados por tema. Explore artigos e aprofunde seu entendimento sem confusão.',
      title: 'Tópicos',
      viewAllLabel: 'Ver todos os tópicos',
    },
    tracksIndex: {
      copy: 'Conteúdo organizado em sequência pra facilitar seu progresso.',
      filterLabel: 'Filtrar por tag',
      title: 'Trilhas pra evoluir com consistência',
    },
  },
}

export function getSiteLocale(value?: string | null): SiteLocale {
  return normalizeSiteLocale(value)
}

export function getSiteCopy(value?: string | null) {
  const locale = getSiteLocale(value)

  return siteCopy[locale] ?? siteCopy[getDefaultLocale()]
}

export function getSiteDateLocale(value?: string | null) {
  return getSiteCopy(value).locale.dateLocale
}

export function getSiteLowerCaseLocale(value?: string | null) {
  return getSiteCopy(value).locale.lowerCaseLocale
}

export function getSiteGiscusLang(value?: string | null) {
  return getSiteCopy(value).locale.giscusLang
}

export function getSearchLauncherEmptyState(value: string | null | undefined, sections: string) {
  const copy = getSiteCopy(value)
  return sections
    ? copy.searchLauncher.emptyWithSections.replace('{sections}', sections)
    : copy.searchLauncher.emptyNoSections
}
