export type Locale = 'en' | 'ru';

export type Work = {
  id: string;
  title: string;
  focus: string;
  summary: string;
  contribution: string;
  outcome: string;
  outcomeLabel: string;
  technologies: string[];
};

export type Experience = {
  dates: string;
  employer: string;
  title: string;
  description: string;
  details: string[];
};

export type SkillCategory = {
  title: string;
  tags: string[];
  note?: string;
};

export type LanguageItem = {
  name: string;
  level: string;
};

export type PrintCv = {
  sectionTitles: {
    experience: string;
    skills: string;
    education: string;
    languages: string;
  };
  jobs: {
    company: string;
    role: string;
    dates: string;
    meta: string;
    highlights: { label: string; text: string }[];
  }[];
  skills: {
    category: string;
    items: string;
  }[];
  education: {
    school: string;
    faculty: string;
    degrees: string[];
  };
  languagesAndProjects: {
    languages: string;
    project: string;
    projectUrl: string;
  };
};

export type Profile = {
  name: string;
  headline: string;
  roleShort: string;
  description: string;
  remote: string;
  location: string;
  avatarUrl: string;
  summaryLead: string;
  summaryTagline: string;
  highlights: { id: string; text: string }[];
  labels: {
    skip: string;
    language: string;
    contact: string;
    work: string;
    contribution: string;
    experience: string;
    skills: string;
    education: string;
    projects: string;
    languages: string;
    email: string;
    top: string;
    pdf: string;
    rtf: string;
    updated: string;
  };
  work: Work[];
  experience: Experience[];
  skills: SkillCategory[];
  university: string;
  faculty: string;
  degrees: { year: string; degree: string; program: string }[];
  research: string;
  languages: LanguageItem[];
  projects: { title: string; description: string; url?: string }[];
  contactTitle: string;
  contactDescription: string;
  printCv: PrintCv;
};

export const contact = {
  website: 'https://valentineshishkin.dev',
  email: 'valentinnsh@gmail.com',
  telegram: 'https://t.me/valentinnsh',
  github: 'https://github.com/valentinnsh',
};

export const profiles: Record<Locale, Profile> = {
  en: {
    name: 'Valentine Shishkin',
    headline: 'Fullstack Software Engineer',
    roleShort: 'Fullstack Software Engineer · .NET · Go · React',
    description: 'C#/.NET · Go · React/TypeScript',
    remote: 'Remote',
    location: 'Remote · Worldwide',
    avatarUrl: 'https://avatars.githubusercontent.com/valentinnsh',
    summaryLead: 'I build backend services and React interfaces, from design through deployment and support.',
    summaryTagline: 'About four years of commercial experience, mainly in C#/.NET and React. My work includes logistics integrations, geospatial search, and Kafka workflows.',
    highlights: [
      { id: 'pickup-points', text: 'Rolled out pickup-point search across city boundaries' },
      { id: 'kafka', text: 'Weekly overloads → several months without related alerts' },
    ],
    labels: {
      skip: 'Skip to content',
      language: 'Language selector',
      contact: 'Get in touch',
      work: 'Selected work',
      contribution: 'My work',
      experience: 'Work Experience',
      skills: 'Skills',
      education: 'Education',
      projects: 'Beyond work',
      languages: 'Languages',
      email: 'Email me',
      top: 'Back to top',
      pdf: 'PDF',
      rtf: 'RTF',
      updated: 'Updated Oct 2026',
    },
    work: [
      {
        id: 'identity',
        title: 'Authentication and user management',
        focus: 'Backend and frontend',
        summary: 'An OAuth 2.0 service with React interfaces for login, users, and roles.',
        contribution: 'I design and implement the backend, BFF, and frontend, and maintain the CI and deployment configuration.',
        outcomeLabel: '',
        outcome: '',
        technologies: ['C#', 'ASP.NET Core', 'OAuth 2.0', 'React', 'TypeScript'],
      },
      {
        id: 'pickup-points',
        title: 'Pickup-point search',
        focus: 'Service migration',
        summary: 'Pickup-point search was limited to individual cities, and provider data was refreshed during customer requests.',
        contribution: 'Replaced the Redis-based storage with a PostgreSQL/PostGIS service. Moved provider updates to a schedule, migrated consumers in stages, and retired the old integration code.',
        outcomeLabel: 'Result',
        outcome: 'Customers can search across city boundaries and filter by cargo requirements and available services. Support can correct provider data without losing those changes on the next refresh.',
        technologies: ['PostgreSQL', 'PostGIS', 'gRPC', 'REST', 'Grafana'],
      },
      {
        id: 'kafka',
        title: 'Reliable Kafka workflows',
        focus: 'Production troubleshooting',
        summary: 'An event processor overloaded weekly, delaying support tasks and order transfers. Adding replicas did not help.',
        contribution: 'Found and fixed problems in the Kafka configuration and our internal Kafka wrapper, and separated heavy workloads. Added dead-letter queues and switched critical services to manual offset commits.',
        outcomeLabel: 'Result',
        outcome: 'No related overload alerts occurred for several months after the changes.',
        technologies: ['Apache Kafka', 'Kubernetes'],
      },
    ],
    experience: [
      {
        dates: 'June 2024 — present',
        employer: 'versta.io / ООО «Цифровая логистика»',
        title: 'Current title: Leading Developer',
        description: 'B2B platform for comparing delivery options across logistics providers, placing and tracking orders, automating customer-specific workflows, and exchanging electronic shipping documents.',
        details: [
          'Develop microservices and Kafka workflows, integrate logistics and electronic document exchange providers via APIs, and build OAuth 2.0 services and React interfaces.',
          'Managed the team from February to September 2026; since September, my focus has been technical leadership. Introduced designated reviewers and shared responsibility for changes, and gradually added automated tests and development conventions.',
          'Built a CLI for working across the platform’s repositories, including local setup, database migrations, and diagnostics.',
        ],
      },
      {
        dates: 'June 2022 — January 2024',
        employer: 'Studio Mobile / Qoden',
        title: 'Junior Backend Developer',
        description: 'Trading software for a cryptocurrency exchange.',
        details: [
          'Developed backend modules, API endpoints, and Blazor administration panels.',
          'Implemented service interactions using IObservable/ReactiveX and wrote automated tests.',
          'Investigated PostgreSQL queries and execution plans; documented architecture with UML.',
        ],
      },
    ],
    skills: [
      {
        title: 'Backend',
        tags: ['C#', '.NET', 'Go', 'Python', 'ASP.NET Core', 'REST', 'gRPC'],
        note: 'Commercial focus: C#/.NET. Go: astronomy bot; Python: academic research.',
      },
      {
        title: 'Frontend',
        tags: ['React', 'TypeScript', 'JavaScript', 'Blazor'],
      },
      {
        title: 'Data & Messaging',
        tags: ['PostgreSQL', 'PostGIS', 'Entity Framework', 'Dapper', 'Redis', 'Apache Kafka'],
      },
      {
        title: 'Delivery & Operations',
        tags: ['Kubernetes', 'CI/CD', 'Grafana', 'Database migrations'],
      },
      {
        title: 'Engineering Practices',
        tags: ['Code review', 'Automated testing', 'CLI tooling'],
      },
    ],
    university: 'Saint Petersburg State University',
    faculty: 'Faculty of Applied Mathematics and Control Processes',
    degrees: [
      { year: '2024', degree: 'Master’s degree', program: 'Artificial Intelligence and Big Data Technologies' },
      { year: '2021', degree: 'Bachelor’s degree', program: 'Programming and Information Technology' },
    ],
    research: 'My master’s thesis focused on training neural networks to study edge-on galaxies. I follow advances in machine learning and intend to continue research.',
    languages: [
      { name: 'Russian', level: 'Native' },
      { name: 'English', level: 'C1' },
    ],
    projects: [
      {
        title: 'Astronomy bot',
        url: 'https://github.com/valentinnsh/SkyHelperV2',
        description: 'Building a Telegram bot in Go to monitor astronomical events for the Laboratory of Observational Astrophysics at Saint Petersburg State University.',
      },
    ],
    contactTitle: 'Open to remote development roles',
    contactDescription: 'I’m looking for remote backend and fullstack roles using .NET, Go, or Python. I’m also open to working with other stacks.',
    printCv: {
      sectionTitles: {
        experience: 'Work Experience',
        skills: 'Technical Skills',
        education: 'Education',
        languages: 'Languages & Projects',
      },
      jobs: [
        {
          company: 'versta.io / ООО «Цифровая логистика»',
          role: 'Current title: Leading Developer',
          dates: 'June 2024 — Present',
          meta: 'B2B logistics platform: delivery comparison, ordering, tracking, and electronic documents',
          highlights: [
            {
              label: 'Pickup-point search',
              text: 'Designed and rolled out a PostgreSQL/PostGIS service replacing Redis storage. Enabled cross-city search, decoupled provider refreshes from customer requests, and migrated all consumers.',
            },
            {
              label: 'Kafka reliability',
              text: 'Resolved weekly event-processor overloads by fixing Kafka configuration and wrapper issues and separating heavy workloads. Added DLQs and manual commits; no related overload alerts for several months afterward.',
            },
            {
              label: 'Identity & access',
              text: 'Design and implement an OAuth 2.0 service, BFF, and React interfaces for login, users, and roles, including CI and deployment configuration.',
            },
            {
              label: 'Integrations',
              text: 'Develop microservices and React interfaces; integrate logistics and electronic document exchange providers via APIs.',
            },
            {
              label: 'Tooling & leadership',
              text: 'Built a CLI for local setup, migrations, and diagnostics. Managed the team February–September 2026; continue technical leadership, with designated reviewers, shared accountability, and automated tests.',
            },
          ],
        },
        {
          company: 'Studio Mobile / Qoden',
          role: 'Junior Backend Developer',
          dates: 'June 2022 — January 2024',
          meta: 'Trading software for a cryptocurrency exchange',
          highlights: [
            {
              label: 'Trading platform',
              text: 'Developed backend modules, APIs, and Blazor administration panels. Implemented service interactions using IObservable/ReactiveX.',
            },
            {
              label: 'Database & testing',
              text: 'Investigated PostgreSQL queries and execution plans; wrote automated tests; documented architecture with UML.',
            },
          ],
        },
      ],
      skills: [
        {
          category: 'Backend',
          items: 'C#/.NET, ASP.NET Core, REST, gRPC; Go (project), Python (research)',
        },
        {
          category: 'Frontend',
          items: 'React, TypeScript, JavaScript, Blazor',
        },
        {
          category: 'Data & Messaging',
          items: 'PostgreSQL, PostGIS, Entity Framework, Dapper, Redis, Apache Kafka',
        },
        {
          category: 'Delivery',
          items: 'Kubernetes, CI/CD, Grafana, database migrations',
        },
        {
          category: 'Practices',
          items: 'Code review, automated testing, CLI tooling',
        },
      ],
      education: {
        school: 'Saint Petersburg State University',
        faculty: 'Faculty of Applied Mathematics and Control Processes',
        degrees: [
          'Master’s in AI and Big Data Technologies (2024) · Thesis: neural networks for studying edge-on galaxies',
          'Bachelor’s in Programming and Information Technology (2021)',
        ],
      },
      languagesAndProjects: {
        languages: 'Russian: Native · English: C1',
        project: 'Go: Telegram bot monitoring astronomical events for SPbU’s Laboratory of Observational Astrophysics.',
        projectUrl: 'https://github.com/valentinnsh/SkyHelperV2',
      },
    },
  },
  ru: {
    name: 'Валентин Шишкин',
    headline: 'Fullstack-разработчик',
    roleShort: 'Fullstack-разработчик · .NET · Go · React',
    description: 'C#/.NET · Go · React/TypeScript',
    remote: 'Удалённо',
    location: 'Удалённая работа',
    avatarUrl: 'https://avatars.githubusercontent.com/valentinnsh',
    summaryLead: 'Разрабатываю backend-сервисы и интерфейсы на React — от проектирования до внедрения и сопровождения.',
    summaryTagline: 'Около четырёх лет коммерческого опыта, преимущественно с C#/.NET и React. Работаю над логистическими интеграциями, геопоиском и обработкой событий в Kafka.',
    highlights: [
      { id: 'pickup-points', text: 'Внедрил поиск пунктов выдачи без границ города' },
      { id: 'kafka', text: 'Еженедельные перегрузки → несколько месяцев без связанных алертов' },
    ],
    labels: {
      skip: 'К содержимому',
      language: 'Переключатель языка',
      contact: 'Связаться',
      work: 'Проекты',
      contribution: 'Моя работа',
      experience: 'Опыт работы',
      skills: 'Навыки',
      education: 'Образование',
      projects: 'Личные проекты',
      languages: 'Языки',
      email: 'Написать на почту',
      top: 'Наверх',
      pdf: 'PDF',
      rtf: 'RTF',
      updated: 'Обновлено: октябрь 2026',
    },
    work: [
      {
        id: 'identity',
        title: 'Аутентификация и управление пользователями',
        focus: 'Backend и frontend',
        summary: 'Сервис OAuth 2.0 и интерфейсы на React для входа, управления пользователями и ролями.',
        contribution: 'Проектирую и разрабатываю backend, BFF и frontend, настраиваю CI и развёртывание.',
        outcomeLabel: '',
        outcome: '',
        technologies: ['C#', 'ASP.NET Core', 'OAuth 2.0', 'React', 'TypeScript'],
      },
      {
        id: 'pickup-points',
        title: 'Поиск пунктов выдачи',
        focus: 'Миграция сервиса',
        summary: 'Поиск пунктов выдачи был ограничен отдельными городами, а данные провайдеров обновлялись во время пользовательских запросов.',
        contribution: 'Заменил хранилище на Redis сервисом на PostgreSQL/PostGIS. Перенёс обновление данных в фоновые задачи по расписанию, поэтапно перевёл потребителей и удалил старый код интеграций.',
        outcomeLabel: 'Результат',
        outcome: 'Клиенты могут искать пункты выдачи за пределами города с учётом груза и доступных услуг. Поддержка может исправлять данные провайдеров — правки сохраняются при следующем обновлении.',
        technologies: ['PostgreSQL', 'PostGIS', 'gRPC', 'REST', 'Grafana'],
      },
      {
        id: 'kafka',
        title: 'Надёжность обработки событий в Kafka',
        focus: 'Проблемы в продакшене',
        summary: 'Обработчик событий перегружался каждую неделю, задерживая задачи поддержки и передачу заказов. Добавление реплик не помогало.',
        contribution: 'Нашёл и исправил проблемы в конфигурации Kafka и нашей обёртке над ней, разделил тяжёлые нагрузки. Добавил DLQ и перевёл критические сервисы на ручной коммит смещений (manual commit).',
        outcomeLabel: 'Результат',
        outcome: 'В течение нескольких месяцев после изменений не было алертов, связанных с этими перегрузками.',
        technologies: ['Apache Kafka', 'Kubernetes'],
      },
    ],
    experience: [
      {
        dates: 'Июнь 2024 — настоящее время',
        employer: 'versta.io / ООО «Цифровая логистика»',
        title: 'Текущая должность: ведущий программист',
        description: 'B2B-платформа для сравнения вариантов доставки у разных логистических операторов, оформления и отслеживания заказов, автоматизации процессов под клиента и электронного документооборота по перевозкам.',
        details: [
          'Разрабатываю микросервисы, обработку событий в Kafka, сервисы OAuth 2.0 и интерфейсы на React. Интегрирую по API поставщиков логистических услуг и операторов электронного документооборота.',
          'С февраля по сентябрь 2026 года управлял командой; с сентября сосредоточился преимущественно на техническом руководстве. Ввёл назначение ответственных за ревью и совместную ответственность автора и ревьюера за изменения, постепенно добавлял автотесты и соглашения по разработке.',
          'Разработал CLI для работы с репозиториями платформы: настройка локального окружения, миграции БД и диагностика.',
        ],
      },
      {
        dates: 'Июнь 2022 — январь 2024',
        employer: 'Studio Mobile / Qoden',
        title: 'Junior Backend Developer',
        description: 'Торговая платформа криптовалютной биржи.',
        details: [
          'Разрабатывал backend-модули, API и панели администрирования на Blazor.',
          'Реализовывал взаимодействие сервисов через IObservable/ReactiveX и писал автотесты.',
          'Анализировал запросы и планы выполнения PostgreSQL, документировал архитектуру с помощью UML.',
        ],
      },
    ],
    skills: [
      {
        title: 'Backend',
        tags: ['C#', '.NET', 'Go', 'Python', 'ASP.NET Core', 'REST', 'gRPC'],
        note: 'Основной коммерческий опыт — C#/.NET. Go — бот для астрономов, Python — университетские исследования.',
      },
      {
        title: 'Frontend',
        tags: ['React', 'TypeScript', 'JavaScript', 'Blazor'],
      },
      {
        title: 'Данные и события',
        tags: ['PostgreSQL', 'PostGIS', 'Entity Framework', 'Dapper', 'Redis', 'Apache Kafka'],
      },
      {
        title: 'Внедрение и эксплуатация',
        tags: ['Kubernetes', 'CI/CD', 'Grafana', 'Миграции БД'],
      },
      {
        title: 'Инженерные практики',
        tags: ['Код-ревью', 'Автотесты', 'CLI-инструменты'],
      },
    ],
    university: 'Санкт-Петербургский государственный университет',
    faculty: 'Факультет прикладной математики — процессов управления',
    degrees: [
      { year: '2024', degree: 'Магистратура', program: 'Технологии искусственного интеллекта и Big Data' },
      { year: '2021', degree: 'Бакалавриат', program: 'Программирование и информационные технологии' },
    ],
    research: 'В магистратуре обучал нейросети для исследования галактик, видимых с ребра. Слежу за развитием машинного обучения и планирую продолжать исследования.',
    languages: [
      { name: 'Русский', level: 'Родной' },
      { name: 'Английский', level: 'C1' },
    ],
    projects: [
      {
        title: 'Бот для астрономов',
        url: 'https://github.com/valentinnsh/SkyHelperV2',
        description: 'Разрабатываю на Go Telegram-бота для мониторинга астрономических событий для лаборатории наблюдательной астрофизики СПбГУ.',
      },
    ],
    contactTitle: 'Ищу удалённую работу разработчиком',
    contactDescription: 'Ищу удалённую работу на backend- или fullstack-позиции с .NET, Go или Python. Готов рассмотреть и другие стеки.',
    printCv: {
      sectionTitles: {
        experience: 'Опыт работы',
        skills: 'Технические навыки',
        education: 'Образование',
        languages: 'Языки и проекты',
      },
      jobs: [
        {
          company: 'versta.io / ООО «Цифровая логистика»',
          role: 'Текущая должность: ведущий программист',
          dates: 'Июнь 2024 — настоящее время',
          meta: 'B2B-платформа логистики: сравнение доставки, оформление и отслеживание заказов, ЭДО',
          highlights: [
            {
              label: 'Поиск пунктов выдачи',
              text: 'Спроектировал и внедрил сервис на PostgreSQL/PostGIS вместо Redis. Добавил поиск за пределами города, отделил обновления провайдеров от запросов клиентов и перевёл всех потребителей.',
            },
            {
              label: 'Надёжность Kafka',
              text: 'Устранил еженедельные перегрузки обработчика: исправил конфигурацию и обёртку Kafka, разделил тяжёлые нагрузки. Добавил DLQ и ручной коммит смещений. Несколько месяцев после изменений — без связанных алертов.',
            },
            {
              label: 'Идентификация и доступ',
              text: 'Проектирую и разрабатываю сервис OAuth 2.0, BFF и интерфейсы на React для входа, управления пользователями и ролями. Настраиваю CI и развёртывание.',
            },
            {
              label: 'Интеграции',
              text: 'Разрабатываю микросервисы и интерфейсы на React. Интегрирую по API поставщиков логистических услуг и операторов ЭДО.',
            },
            {
              label: 'Инструменты и команда',
              text: 'Разработал CLI для локального окружения, миграций и диагностики. Управлял командой в феврале–сентябре 2026; продолжаю техническое руководство. Ввёл ответственных за ревью, совместную ответственность и автотесты.',
            },
          ],
        },
        {
          company: 'Studio Mobile / Qoden',
          role: 'Junior Backend Developer',
          dates: 'Июнь 2022 — январь 2024',
          meta: 'Торговая платформа криптовалютной биржи',
          highlights: [
            {
              label: 'Торговая платформа',
              text: 'Разрабатывал backend-модули, API и панели администрирования на Blazor. Реализовывал взаимодействие сервисов через IObservable/ReactiveX.',
            },
            {
              label: 'Базы данных и тесты',
              text: 'Анализировал запросы и планы выполнения PostgreSQL, писал автотесты, документировал архитектуру с помощью UML.',
            },
          ],
        },
      ],
      skills: [
        {
          category: 'Backend',
          items: 'C#/.NET, ASP.NET Core, REST, gRPC; Go (проект), Python (исследования)',
        },
        {
          category: 'Frontend',
          items: 'React, TypeScript, JavaScript, Blazor',
        },
        {
          category: 'Данные и брокеры',
          items: 'PostgreSQL, PostGIS, Entity Framework, Dapper, Redis, Apache Kafka',
        },
        {
          category: 'Развёртывание',
          items: 'Kubernetes, CI/CD, Grafana, миграции БД',
        },
        {
          category: 'Практики',
          items: 'Код-ревью, автотесты, CLI-инструменты',
        },
      ],
      education: {
        school: 'Санкт-Петербургский государственный университет',
        faculty: 'Факультет прикладной математики — процессов управления',
        degrees: [
          'Магистратура: Технологии ИИ и Big Data (2024) · Диплом: нейросети для исследования галактик, видимых с ребра',
          'Бакалавриат: Программирование и информационные технологии (2021)',
        ],
      },
      languagesAndProjects: {
        languages: 'Русский: Родной · Английский: C1',
        project: 'Go: Telegram-бот для мониторинга астрономических событий для лаборатории наблюдательной астрофизики СПбГУ.',
        projectUrl: 'https://github.com/valentinnsh/SkyHelperV2',
      },
    },
  },
};
