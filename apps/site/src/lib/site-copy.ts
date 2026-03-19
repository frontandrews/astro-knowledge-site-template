export type SiteLocale = 'en' | 'pt-br'

type SiteCopy = {
  article: {
    comments: string
    completed: string
    confirmBody: string
    confirmCancel: string
    confirmConfirm: string
    confirmTitle: string
    markCompleted: string
    nextReads: string
    practice: string
    practiceChecklist: string
    practiceChecklistTitle: string
    practiceInApp: string
    practiceInAppTitle: string
    quickSummary: string
    quickSummaryTitle: string
    updatedPrefix: string
  }
  footer: {
    description: string
    glossary: string
    home: string
    learn: string
    privacy: string
    practice: string
    rights: string
    search: string
    startHere: string
    terms: string
    title: string
    topics: string
  }
  guideIndex: {
    comingSoon: string
    copy: string
    filterLabel: string
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
  }
  startHere: {
    articleLabel: string
    backToRoadmap: string
    browseLibrary: string
    conceptLabel: string
    copy: string
    glossary: string
    introEyebrow: string
    linearHeading: string
    nextArticle: string
    previousArticle: string
    roadmapEyebrow: string
    stepLabel: string
    supportCopy: string
    supportHeading: string
    title: string
    topics: string
  }
  learn: string
  layout: {
    glossary: string
    home: string
    practice: string
    search: string
    startHere: string
    themeToggle: string
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
      comments: 'Comments',
      completed: 'Completed',
      confirmBody:
        'When you mark this as complete, it will stop showing up in suggestions. You can still practice the topic later. Do you want to continue?',
      confirmCancel: 'Cancel',
      confirmConfirm: 'Yes, continue',
      confirmTitle: 'Mark this guide as completed?',
      markCompleted: 'Mark as completed',
      nextReads: 'Next reads',
      practice: 'Practice',
      practiceChecklist: 'Practice checklist',
      practiceChecklistTitle: 'Use this when you answer',
      practiceInApp: 'Practice in the app',
      practiceInAppTitle: 'Turn this idea into reps',
      quickSummary: 'Quick summary',
      quickSummaryTitle: 'What to keep in your head',
      updatedPrefix: 'Updated',
    },
    footer: {
      description: 'Guided editorial maps and clear guides for people who want to think better before they solve.',
      glossary: 'Glossary',
      home: 'Home',
      learn: 'Path to Senior',
      privacy: 'Privacy policy',
      practice: 'Practice',
      rights: 'All rights reserved.',
      search: 'Search',
      startHere: 'Start Here',
      terms: 'Terms and conditions',
      title: 'SeniorPath',
      topics: 'Topics',
    },
    header: {
      brand: 'SeniorPath',
    },
    startHere: {
      articleLabel: 'Article',
      backToRoadmap: 'Back to Start Here',
      browseLibrary: 'Browse the library',
      conceptLabel: 'Concept',
      copy:
        'A guided editorial roadmap for how to think before you jump into solutions, interviews, or challenge-style problems.',
      glossary: 'Look up a term',
      introEyebrow: 'Editorial roadmap',
      linearHeading: 'Follow the route in order',
      nextArticle: 'Next article',
      previousArticle: 'Previous article',
      roadmapEyebrow: 'Start Here',
      stepLabel: 'Step',
      supportCopy: 'When you want to browse more freely, use the library, topics, or glossary as support.',
      supportHeading: 'Keep exploring',
      title: 'How to think before you solve',
      topics: 'Explore topics',
    },
    guideIndex: {
      comingSoon: 'Coming soon',
      copy: 'Direct explanations so you can actually understand the idea, without extra jargon.',
      filterLabel: 'Pick a topic',
      title: 'Learn without the fluff',
    },
    challengeIndex: {
      copy: 'This section is reserved for future editorial walkthroughs and worked examples.',
      title: 'Challenges',
    },
    glossaryIndex: {
      copy: 'Short reference entries for concepts that keep showing up across guides and interviews.',
      title: 'Glossary',
    },
    learn: 'Learn',
    layout: {
      glossary: 'Glossary',
      home: 'Home',
      practice: 'Practice',
      search: 'Search',
      startHere: 'Start Here',
      themeToggle: 'Toggle theme',
      topics: 'Topics',
    },
    search: {
      copy: 'Search across guides, topics, and glossary entries from one place.',
      devNotice: 'Search index is generated during build. Use preview/build to test Pagefind locally.',
      title: 'Search the site',
    },
    topicIndex: {
      copy: 'Cross-cutting hubs that connect guides by theme instead of by curriculum branch.',
      title: 'Topics',
    },
  },
  'pt-br': {
    article: {
      comments: 'Comentarios',
      completed: 'Concluido',
      confirmBody:
        'Quando voce marcar este guia como concluido, ele para de aparecer nas sugestoes. Ainda sera possivel praticar o tema depois. Quer continuar?',
      confirmCancel: 'Cancelar',
      confirmConfirm: 'Sim, continuar',
      confirmTitle: 'Marcar este guia como concluido?',
      markCompleted: 'Marcar como concluido',
      nextReads: 'Proximas leituras',
      practice: 'Praticar',
      practiceChecklist: 'Checklist de pratica',
      practiceChecklistTitle: 'Use isto ao responder',
      practiceInApp: 'Pratique no app',
      practiceInAppTitle: 'Transforme esta ideia em repeticoes',
      quickSummary: 'Resumo rapido',
      quickSummaryTitle: 'O que vale manter na cabeca',
      updatedPrefix: 'Atualizado',
    },
    footer: {
      description: 'Mapas editoriais guiados e guias claros para quem quer pensar melhor antes de resolver.',
      glossary: 'Glossario',
      home: 'Inicio',
      learn: 'Caminho para Senior',
      privacy: 'Politica de privacidade',
      practice: 'Praticar',
      rights: 'Todos os direitos reservados.',
      search: 'Busca',
      startHere: 'Comece aqui',
      terms: 'Termos e condicoes',
      title: 'SeniorPath',
      topics: 'Topicos',
    },
    header: {
      brand: 'SeniorPath',
    },
    startHere: {
      articleLabel: 'Artigo',
      backToRoadmap: 'Voltar para Comece aqui',
      browseLibrary: 'Explorar a biblioteca',
      conceptLabel: 'Conceito',
      copy:
        'Um roadmap editorial guiado para como pensar antes de pular para solucoes, entrevistas ou desafios de codigo.',
      glossary: 'Consultar um termo',
      introEyebrow: 'Roadmap editorial',
      linearHeading: 'Siga a rota em ordem',
      nextArticle: 'Proximo artigo',
      previousArticle: 'Artigo anterior',
      roadmapEyebrow: 'Comece aqui',
      stepLabel: 'Etapa',
      supportCopy: 'Quando voce quiser explorar com mais liberdade, use a biblioteca, os topicos e o glossario como apoio.',
      supportHeading: 'Continue explorando',
      title: 'Como pensar antes de resolver',
      topics: 'Explorar topicos',
    },
    guideIndex: {
      comingSoon: 'Em breve',
      copy: 'Explicacoes diretas para entender de verdade, sem jargao desnecessario.',
      filterLabel: 'Escolha um tema',
      title: 'Aprenda sem enrolação',
    },
    challengeIndex: {
      copy: 'Esta secao fica reservada para walkthroughs editoriais e exemplos resolvidos no futuro.',
      title: 'Desafios',
    },
    glossaryIndex: {
      copy: 'Entradas curtas de referencia para conceitos que aparecem o tempo todo em guias e entrevistas.',
      title: 'Glossario',
    },
    learn: 'Aprender',
    layout: {
      glossary: 'Glossario',
      home: 'Inicio',
      practice: 'Praticar',
      search: 'Busca',
      startHere: 'Comece aqui',
      themeToggle: 'Alternar tema',
      topics: 'Topicos',
    },
    search: {
      copy: 'Busque em guias, topicos e termos do glossario em um unico lugar.',
      devNotice: 'O indice de busca e gerado no build. Use preview/build para testar o Pagefind localmente.',
      title: 'Buscar no site',
    },
    topicIndex: {
      copy: 'Hubs transversais que conectam os guias por tema, nao so pela trilha curricular.',
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
