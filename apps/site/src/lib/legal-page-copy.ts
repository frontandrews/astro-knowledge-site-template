import { getSiteLocale, type SiteLocale } from '@/lib/site-copy'

type PrivacyContext = {
  governingLaw: string
  operatorLocation: string
  operatorName: string
  siteName: string
}

type TermsContext = PrivacyContext & {
  venue: string
}

type LegalSection<TContext> = {
  body: (context: TContext) => string
  items?: string[]
  title: string
}

type PrivacyCopy = {
  applicableLaw: LegalSection<PrivacyContext>
  changes: LegalSection<PrivacyContext>
  collectedData: LegalSection<PrivacyContext>
  contact: {
    bodyPrefix: string
    title: string
  }
  cookies: LegalSection<PrivacyContext>
  description: (siteName: string) => string
  howDataIsUsed: LegalSection<PrivacyContext>
  intro: (siteName: string) => string
  retention: LegalSection<PrivacyContext>
  templateNoteLabel: string
  thirdPartyServices: LegalSection<PrivacyContext>
  title: string
  whoControls: LegalSection<PrivacyContext> & {
    contactPrefix: string
  }
  yourRights: LegalSection<PrivacyContext>
}

type TermsCopy = {
  acceptableUse: LegalSection<TermsContext>
  accounts: LegalSection<TermsContext>
  availability: LegalSection<TermsContext>
  contact: {
    intro: string
    lastSeparator: string
    middleSeparator: string
    title: string
  }
  contentOwnership: LegalSection<TermsContext>
  description: (siteName: string) => string
  disclaimer: LegalSection<TermsContext>
  governingLawVenue: LegalSection<TermsContext>
  intro: (siteName: string) => string
  noProfessionalAdvice: LegalSection<TermsContext>
  templateNoteLabel: string
  thirdPartyServices: LegalSection<TermsContext>
  title: string
  whoOperates: LegalSection<TermsContext>
}

type LegalPageCopy = {
  privacy: PrivacyCopy
  terms: TermsCopy
}

const legalPageCopy: Record<string, LegalPageCopy> = {
  en: {
    privacy: {
      applicableLaw: {
        body: ({ governingLaw }) =>
          `This starter policy assumes compliance with ${governingLaw}. Replace this section with the real legal basis, jurisdiction, and notice requirements that apply to your project.`,
        title: 'Applicable law',
      },
      changes: {
        body: () =>
          'The operator may update this policy as the product, vendors, or legal requirements change. The current version should always be published on this page with an effective date if your jurisdiction requires it.',
        title: 'Changes to this policy',
      },
      collectedData: {
        body: () => '',
        items: [
          'Contact details you choose to send, such as name, email, or support messages',
          'Account or authentication data if login features are enabled',
          'Usage data such as visited pages, clicks, timestamps, and navigation paths',
          'Technical data such as IP address, browser, device type, and operating system',
          'Preference data stored in the browser, such as locale, progress markers, or UI state',
          'Data received from third-party providers you actively use, such as auth, payments, or comments',
        ],
        title: 'What data may be collected',
      },
      contact: {
        bodyPrefix: 'If you have questions about this policy or how personal data is handled, contact',
        title: 'Contact',
      },
      cookies: {
        body: () =>
          'This template may use cookies, local storage, analytics scripts, or similar technologies for core site behavior, preferences, security, traffic measurement, and optional marketing flows. Review the exact tools you enable before publishing.',
        title: 'Cookies, local storage, and analytics',
      },
      description: (siteName) => `How ${siteName} handles personal data, cookies, and site preferences.`,
      howDataIsUsed: {
        body: () => '',
        items: [
          'Run, maintain, and improve the site and any related features',
          'Remember preferences and keep optional account or progress flows working',
          'Measure traffic, understand usage, and improve navigation or content quality',
          'Send newsletters, updates, transactional messages, or launch communications when enabled',
          'Prevent abuse, investigate incidents, and comply with legal obligations',
        ],
        title: 'How data may be used',
      },
      intro: (siteName) =>
        `This Privacy Policy is a reusable starting point for projects built on this template. It explains how ${siteName} may collect, use, store, and share personal data when someone browses the site, subscribes to updates, or uses optional product features.`,
      retention: {
        body: () =>
          'Personal data should be kept only for as long as needed for the feature, legal obligation, or operational purpose involved. Operators should also apply reasonable technical and organizational safeguards, while recognizing that no system is perfectly secure.',
        title: 'Retention and security',
      },
      templateNoteLabel: 'Template note.',
      thirdPartyServices: {
        body: () =>
          'Projects built from this template may connect to third-party providers such as hosting, analytics, email, auth, comments, or payment tools. Those providers operate under their own terms and privacy policies.',
        title: 'Third-party services',
      },
      title: 'Privacy Policy',
      whoControls: {
        body: ({ operatorLocation, operatorName, siteName }) =>
          `${operatorName} operates ${siteName}. The operator is based in ${operatorLocation}.`,
        contactPrefix: 'For privacy requests or questions about your data, contact',
        title: 'Who controls your data',
      },
      yourRights: {
        body: () =>
          'Depending on the law that applies to your project, users may have rights to access, correct, delete, export, restrict, or object to certain uses of personal data. Review this section against the actual laws and providers you use before launch.',
        title: 'Your rights',
      },
    },
    terms: {
      acceptableUse: {
        body: () =>
          'You may use the site only for lawful purposes and in a way that does not harm the platform or other users.',
        items: [
          'Do not interfere with the site, its infrastructure, or its security controls',
          'Do not scrape or reuse the content in abusive or unauthorized ways',
          'Do not upload spam, malware, unlawful material, or deceptive content',
          'Do not misrepresent your identity or your relationship with a company or brand',
        ],
        title: 'Acceptable use',
      },
      accounts: {
        body: () =>
          'Some deployments may add accounts, comments, subscriptions, payments, downloads, or other gated features. When those features exist, users must provide accurate information and keep their credentials secure.',
        title: 'Accounts and optional features',
      },
      availability: {
        body: () =>
          'The operator may update, pause, rename, limit, or discontinue parts of the site at any time. These terms may also change as the product or legal requirements change.',
        title: 'Availability and changes',
      },
      contact: {
        intro: 'For legal notices or support questions related to these terms, contact',
        lastSeparator: ' or ',
        middleSeparator: ', ',
        title: 'Contact',
      },
      contentOwnership: {
        body: () =>
          'Unless stated otherwise, the site structure, design, and original content belong to the operator or its licensors. Users may share links and quote limited excerpts with attribution, but broader reuse depends on the license or permissions published for that deployment.',
        title: 'Content and intellectual property',
      },
      description: (siteName) => `Starter terms for using ${siteName} and related features.`,
      disclaimer: {
        body: () =>
          'The site may be provided on an "as is" and "as available" basis to the maximum extent allowed by law. Review and adapt this clause to match the jurisdiction, business model, and actual risk profile of the project before launch.',
        title: 'Disclaimer and limitation of liability',
      },
      governingLawVenue: {
        body: ({ governingLaw, venue }) =>
          `This starter document assumes that disputes are governed by ${governingLaw} and handled in ${venue}. Replace this section with the real law, forum, and mandatory consumer rules that apply to your operation.`,
        title: 'Governing law and venue',
      },
      intro: (siteName) =>
        `These Terms of Service are a reusable starting point for projects built on this template. They govern access to ${siteName} and to any content, accounts, downloads, newsletters, or product features the operator decides to enable.`,
      noProfessionalAdvice: {
        body: () =>
          'This template is commonly used for editorial or educational projects. Content published on top of it should be treated as general information unless the operator clearly states otherwise.',
        title: 'No professional advice',
      },
      templateNoteLabel: 'Template note.',
      thirdPartyServices: {
        body: () =>
          'Projects built from this template may rely on providers such as hosting, analytics, auth, comments, email, or payments. Those providers operate under their own terms and policies.',
        title: 'Third-party services',
      },
      title: 'Terms of Service',
      whoOperates: {
        body: ({ operatorLocation, operatorName, siteName }) =>
          `${operatorName} operates ${siteName} from ${operatorLocation}. In these terms, "we" refers to that operator and the project built on this template.`,
        title: 'Who operates the site',
      },
    },
  },
  'pt-br': {
    privacy: {
      applicableLaw: {
        body: ({ governingLaw }) =>
          `Esta politica-base assume conformidade com ${governingLaw}. Troque esta secao pela base legal, jurisdicao e obrigacoes de aviso que realmente se aplicam ao seu projeto.`,
        title: 'Lei aplicavel',
      },
      changes: {
        body: () =>
          'O operador pode atualizar esta politica quando produto, fornecedores ou exigencias legais mudarem. A versao atual deve ficar publicada nesta pagina com data de vigencia quando isso for exigido pela jurisdicao aplicavel.',
        title: 'Mudancas nesta politica',
      },
      collectedData: {
        body: () => '',
        items: [
          'Dados de contato que a pessoa decidir enviar, como nome, email ou mensagens de suporte',
          'Dados de conta ou autenticacao, se recursos de login estiverem habilitados',
          'Dados de uso, como paginas visitadas, cliques, horarios e caminhos de navegacao',
          'Dados tecnicos, como IP, navegador, tipo de dispositivo e sistema operacional',
          'Dados de preferencia guardados no navegador, como locale, progresso ou estado da interface',
          'Dados recebidos de provedores terceiros usados de forma ativa, como auth, pagamentos ou comentarios',
        ],
        title: 'Que dados podem ser coletados',
      },
      contact: {
        bodyPrefix: 'Se voce tiver duvidas sobre esta politica ou sobre o tratamento de dados pessoais, entre em contato por',
        title: 'Contato',
      },
      cookies: {
        body: () =>
          'Este template pode usar cookies, local storage, scripts de analytics e tecnologias parecidas para comportamento basico do site, preferencias, seguranca, medicao de trafego e fluxos opcionais de marketing. Revise as ferramentas habilitadas antes de publicar.',
        title: 'Cookies, local storage e analytics',
      },
      description: (siteName) => `Como ${siteName} trata dados pessoais, cookies e preferencias do site.`,
      howDataIsUsed: {
        body: () => '',
        items: [
          'Operar, manter e melhorar o site e os recursos relacionados',
          'Memorizar preferencias e manter funcionando fluxos opcionais de conta ou progresso',
          'Medir trafego, entender uso e melhorar navegacao ou qualidade do conteudo',
          'Enviar newsletter, atualizacoes, mensagens transacionais ou comunicacoes de lancamento quando existir',
          'Prevenir abuso, investigar incidentes e cumprir obrigacoes legais',
        ],
        title: 'Como os dados podem ser usados',
      },
      intro: (siteName) =>
        `Esta Politica de Privacidade e um ponto de partida reutilizavel para projetos feitos com este template. Ela explica como ${siteName} pode coletar, usar, armazenar e compartilhar dados pessoais quando alguem navega no site, assina atualizacoes ou usa recursos opcionais do produto.`,
      retention: {
        body: () =>
          'Dados pessoais devem ser mantidos apenas pelo tempo necessario para o recurso, a obrigacao legal ou a necessidade operacional envolvida. O operador tambem deve aplicar salvaguardas tecnicas e organizacionais razoaveis, sabendo que nenhum sistema e totalmente seguro.',
        title: 'Retencao e seguranca',
      },
      templateNoteLabel: 'Aviso de template.',
      thirdPartyServices: {
        body: () =>
          'Projetos criados a partir deste template podem se integrar com hospedagem, analytics, email, auth, comentarios ou pagamentos. Esses provedores operam sob seus proprios termos e politicas de privacidade.',
        title: 'Servicos de terceiros',
      },
      title: 'Politica de Privacidade',
      whoControls: {
        body: ({ operatorLocation, operatorName, siteName }) =>
          `${operatorName} opera ${siteName}. O operador esta baseado em ${operatorLocation}.`,
        contactPrefix: 'Para pedidos de privacidade ou duvidas sobre seus dados, entre em contato por',
        title: 'Quem controla seus dados',
      },
      yourRights: {
        body: () =>
          'Dependendo da lei aplicavel ao seu projeto, usuarios podem ter direitos de acesso, correcao, exclusao, portabilidade, restricao ou oposicao a certos usos de dados pessoais. Revise esta secao com base nas leis e nos provedores reais antes do lancamento.',
        title: 'Seus direitos',
      },
    },
    terms: {
      acceptableUse: {
        body: () =>
          'Voce so pode usar o site para fins licitos e sem prejudicar a plataforma ou outras pessoas.',
        items: [
          'Nao interfira no site, na infraestrutura ou nos controles de seguranca',
          'Nao faca scraping nem reutilize o conteudo de forma abusiva ou sem autorizacao',
          'Nao envie spam, malware, material ilegal ou conteudo enganoso',
          'Nao deturpe sua identidade nem sua relacao com empresa, marca ou organizacao',
        ],
        title: 'Uso aceitavel',
      },
      accounts: {
        body: () =>
          'Algumas implementacoes podem adicionar contas, comentarios, assinaturas, pagamentos, downloads ou outros recursos restritos. Quando esses recursos existirem, usuarios devem fornecer dados corretos e manter suas credenciais seguras.',
        title: 'Contas e recursos opcionais',
      },
      availability: {
        body: () =>
          'O operador pode atualizar, pausar, renomear, limitar ou encerrar partes do site a qualquer momento. Estes termos tambem podem mudar conforme o produto ou as exigencias legais mudarem.',
        title: 'Disponibilidade e mudancas',
      },
      contact: {
        intro: 'Para notificacoes juridicas ou duvidas de suporte relacionadas a estes termos, entre em contato por',
        lastSeparator: ' ou ',
        middleSeparator: ', ',
        title: 'Contato',
      },
      contentOwnership: {
        body: () =>
          'Salvo indicacao em contrario, estrutura do site, design e conteudo original pertencem ao operador ou aos seus licenciadores. Usuarios podem compartilhar links e citar trechos curtos com atribuicao, mas reutilizacao maior depende da licenca ou das permissoes publicadas naquela instalacao.',
        title: 'Conteudo e propriedade intelectual',
      },
      description: (siteName) => `Termos-base para uso de ${siteName} e dos recursos relacionados.`,
      disclaimer: {
        body: () =>
          'O site pode ser fornecido "como esta" e "conforme disponivel" na maior extensao permitida por lei. Revise e adapte esta clausula para a jurisdicao, o modelo de negocio e o risco real do projeto antes do lancamento.',
        title: 'Isencao e limitacao de responsabilidade',
      },
      governingLawVenue: {
        body: ({ governingLaw, venue }) =>
          `Este documento-base assume que disputas sao regidas por ${governingLaw} e tratadas em ${venue}. Troque esta secao pela lei, pelo foro e pelas regras obrigatorias de consumo que realmente se aplicam a sua operacao.`,
        title: 'Lei aplicavel e foro',
      },
      intro: (siteName) =>
        `Estes Termos de Uso sao um ponto de partida reutilizavel para projetos feitos com este template. Eles regem o acesso a ${siteName} e a qualquer conteudo, conta, download, newsletter ou recurso de produto que o operador resolver habilitar.`,
      noProfessionalAdvice: {
        body: () =>
          'Este template costuma ser usado em projetos editoriais ou educacionais. O conteudo publicado em cima dele deve ser tratado como informacao geral, salvo quando o operador declarar algo mais especifico.',
        title: 'Sem aconselhamento profissional',
      },
      templateNoteLabel: 'Aviso de template.',
      thirdPartyServices: {
        body: () =>
          'Projetos criados a partir deste template podem depender de hospedagem, analytics, auth, comentarios, email ou pagamentos. Esses provedores operam sob seus proprios termos e politicas.',
        title: 'Servicos de terceiros',
      },
      title: 'Termos de Uso',
      whoOperates: {
        body: ({ operatorLocation, operatorName, siteName }) =>
          `${operatorName} opera ${siteName} a partir de ${operatorLocation}. Nestes termos, "nos" se refere a esse operador e ao projeto construido sobre este template.`,
        title: 'Quem opera o site',
      },
    },
  },
}

export function getLegalPageCopy(locale?: SiteLocale): LegalPageCopy {
  return legalPageCopy[getSiteLocale(locale)] ?? legalPageCopy.en
}
