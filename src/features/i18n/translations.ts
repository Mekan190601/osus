import type { AppLanguage } from "../settings/types/settings.types";



export const translations = {
  tk: {
    nav: {
      dashboard: "Baş sahypa",
      goals: "Maksatlar",
      finance: "Maliýe",
      analytics: "Ösüş analizi",
      aiCoach: "Akylly maslahatçy",
      planner: "Meýilnama",
      settings: "Sazlamalar",
    },

    goals: {
  title: "Maksatlar",
  mainGoal: "Esasy maksat",
  createGoal: "Maksat goş",
  editGoal: "Maksady üýtget",
  goalName: "Maksadyň ady",
  targetMoney: "Maksat puly",
  currentMoney: "Ýygnalan pul",
  deadline: "Soňky möhlet",
  save: "Ýatda sakla",
  cancel: "Goýbolsun",
  progress: "Ösüş",
  noGoal: "Esasy maksat entek girizilmedi",
},

    planner: {
      goalTree: "Maksat gurluşy",
yearlyGoal: "Ýyllyk maksat",
monthlyGoal: "Aýlyk maksat",
weeklyGoal: "Hepdelik maksat",
dailyGoal: "Günlük maksat",
noLinkedGoal: "Baglanan maksat ýok",

currentFocus: "Häzirki esasy üns",
focusDescription:
  "Häzirki wagtda iň möhüm ýerine ýetirilmeli işi görkezýär.",

plannerOverview: "Meýilnama ýagdaýy",
openPlanner: "Meýilnama geç",
      selectedPeriod: "Saýlanan döwür",
today: "Şu gün",

totalTasks: "Jemi işler",
completedTasks: "Tamamlanan",
urgentTasks: "Möhüm + gyssagly",
completion: "Meýilnama ýerine ýetirilişi",

taskPlaceholder: "Meselem: Müşderilere jaň etmek",
choosePriority: "Iş üçin prioritet saýla.",

quadrantEmpty: "Bu bölümde entek iş ýok.",

doNow: "Häzir et",
schedule: "Meýilleşdir",
delegate: "Tabşyr",
remove: "Aýyr",
      pageDescription:
  "Günlük, hepdelik, aýlyk we ýyllyk işleriňi bir ýerden dolandyr.",
  daily: "Günlük",
  weekly: "Hepdelik",
  monthly: "Aýlyk",
  yearly: "Ýyllyk",

  title: "Meýilnama",
  todayPlan: "Şu günki meýilnama",
  addTask: "Iş goş",
  editTask: "Işi üýtget",
  taskTitle: "Işiň ady",
  description: "Düşündiriş",
  saveTask: "Ýatda sakla",
  cancel: "Goýbolsun",
  completed: "Tamamlandy",
  pending: "Garaşýar",
  progress: "Ösüş",
  tasks: "Işler",
  noTasks: "Häzir iş ýok",

  urgentImportant: "Möhüm + gyssagly",
  importantNotUrgent: "Möhüm + gyssagly däl",
  urgentNotImportant: "Gyssagly + möhüm däl",
  notUrgentNotImportant: "Gyssagly däl + möhüm däl",

  urgentImportantAction: "Häzir ýerine ýetir",
  importantNotUrgentAction: "Meýilleşdir",
  urgentNotImportantAction: "Başga birine tabşyr",
  notUrgentNotImportantAction: "Aýyr ýa-da soň goý",
},

    common: {
      total: "UMUMY",
      appName: "ÖSÜŞ",
      appDescription: "Şahsy ösüş dolandyryş ulgamy",
      save: "Ýatda sakla",
      cancel: "Goýbolsun",
      delete: "Poz",
      open: "Aç",
      back: "Yza",
      active: "Aktiw",
      completed: "Tamamlandy",
    },

    dashboard: {
      strategicProgressDescription:
  "Maliýe we meýilnama ösüşiniň birleşdirilen görnüşi.",
      netIncome: "Arassa girdeji",
      heroDescription:
  "Maksatlaryňy, maliýäňi we gündelik ösüşiňi bir ýerden dolandyr. ÖSÜŞ saňa diňe maglumat görkezmän, indiki iň möhüm ädimi görmäge kömek edýär.",
  welcome: "Hoş geldiň.",
  todayQuestion: "Şu gün näme ösdürýäris?",
  addGoal: "Maksat goş",
  getAdvice: "Maslahat al",

  mainGoal: "Esasy maksat",
  targetMoney: "Maksat puly",
  deadline: "Soňky möhlet",
  savedMoney: "Ýygnalan pul",

  overallProgress: "Umumy ösüş",
  goalProgress: "Maksada tarap ösüş",
  strategicProgress: "Strategik ösüş",

  active: "Aktiw",
  requiredMoney: "Gerek pul",

  goalDescription:
    "Maksadyň boýunça esasy maliýe görkezijileri we soňky möhleti şu ýerde görkezilýär.",

  financeStatus: "Maliýe ýagdaýy",
  monthlyFinance: "Aýlyk maliýe ýagdaýy",
  bankBalance: "Bank balansy",
  monthlyIncome: "Aýlyk girdeji",
  monthlyExpense: "Aýlyk çykdajy",

  smartAdvisor: "Akylly maslahatçy",
  personalGrowthAdvisor: "Şahsy ösüş boýunça maslahatçy",
  openAdvisor: "Maslahatça geç",
  advisorDescription:
    "Maksadyň, maliýe ýagdaýyň we meýilnamaň esasynda indiki iň peýdaly ädimi maslahat berýär.",

  plannerOverview: "Meýilnama ýagdaýy",
  openPlanner: "Meýilnama geç",
},

    settings: {
      title: "Programmanyň sazlamalary",
      description:
        "Dil, pul birligi, başlangyç sahypa, daşky görnüş we bildiriş sazlamalaryny dolandyr.",

      language: "Dil",
      languageDescription:
        "Programmanyň esasy dilini saýla.",

      currency: "Pul birligi",
      currencyDescription:
        "Maliýe maglumatlary üçin esasy pul birligini saýla.",

      startPage: "Başlangyç sahypa",
      startPageDescription:
        "Programma açylanda ilkinji görkeziljek bölümi saýla.",

      appearance: "Daşky görnüş",

      notifications: "Bildirişler",
      notificationsDescription:
        "Haýsy ýagdaýlarda bildiriş almak isleýändigiňi saýla.",

      reset: "Başlangyç sazlama",

      dark: "Garaňky",
      light: "Ýagty",
      system: "Sistema",

      autoSaveTitle:
        "Sazlamalar awtomatiki ýatda saklanýar",
      autoSaveDescription:
        "Üýtgeşmeler brauzeriň ýerli ýadynda saklanýar.",
    },
  },

  ru: {
    nav: {
      dashboard: "Главная",
      goals: "Цели",
      finance: "Финансы",
      analytics: "Аналитика роста",
      aiCoach: "Умный советник",
      planner: "Планирование",
      settings: "Настройки",
    },

    goals: {
  title: "Цели",
  mainGoal: "Главная цель",
  createGoal: "Добавить цель",
  editGoal: "Изменить цель",
  goalName: "Название цели",
  targetMoney: "Сумма цели",
  currentMoney: "Накоплено",
  deadline: "Срок",
  save: "Сохранить",
  cancel: "Отмена",
  progress: "Прогресс",
  noGoal: "Главная цель ещё не задана",
},

   planner: {
    goalTree: "Структура цели",
yearlyGoal: "Годовая цель",
monthlyGoal: "Месячная цель",
weeklyGoal: "Недельная цель",
dailyGoal: "Дневная цель",
noLinkedGoal: "Связанной цели нет",

currentFocus: "Текущий главный фокус",
focusDescription:
  "Показывает наиболее важную задачу, на которой стоит сосредоточиться сейчас.",

plannerOverview: "Состояние планирования",
openPlanner: "Открыть планирование",
    selectedPeriod: "Выбранный период",
today: "Сегодня",

totalTasks: "Всего задач",
completedTasks: "Выполнено",
urgentTasks: "Важно + срочно",
completion: "Выполнение плана",

taskPlaceholder: "Например: Позвонить клиентам",
choosePriority: "Выберите приоритет задачи.",

quadrantEmpty: "В этом разделе пока нет задач.",

doNow: "Сделать сейчас",
schedule: "Запланировать",
delegate: "Делегировать",
remove: "Убрать",
    pageDescription:
  "Управляйте ежедневными, недельными, месячными и годовыми задачами в одном месте.",
  daily: "День",
  weekly: "Неделя",
  monthly: "Месяц",
  yearly: "Год",

  title: "Планирование",
  todayPlan: "План на сегодня",
  addTask: "Добавить задачу",
  editTask: "Изменить задачу",
  taskTitle: "Название задачи",
  description: "Описание",
  saveTask: "Сохранить",
  cancel: "Отмена",
  completed: "Выполнено",
  pending: "Ожидает",
  progress: "Прогресс",
  tasks: "Задачи",
  noTasks: "Задач пока нет",

  urgentImportant: "Важно + срочно",
  importantNotUrgent: "Важно + не срочно",
  urgentNotImportant: "Срочно + не важно",
  notUrgentNotImportant: "Не срочно + не важно",

  urgentImportantAction: "Сделать сейчас",
  importantNotUrgentAction: "Запланировать",
  urgentNotImportantAction: "Делегировать",
  notUrgentNotImportantAction: "Убрать или отложить",
},

    common: {
      total: "ИТОГО",
      appName: "ÖSÜŞ",
      appDescription:
        "Система управления личным развитием",
      save: "Сохранить",
      cancel: "Отмена",
      delete: "Удалить",
      open: "Открыть",
      back: "Назад",
      active: "Активно",
      completed: "Завершено",
    },

    dashboard: {
      strategicProgressDescription:
  "Объединённый показатель финансового прогресса и выполнения плана.",
      netIncome: "Чистый доход",
      heroDescription:
  "Управляйте целями, финансами и ежедневным прогрессом в одном месте. ÖSÜŞ не только показывает данные, но и помогает увидеть следующий важный шаг.",
  welcome: "Добро пожаловать.",
  todayQuestion: "Что развиваем сегодня?",
  addGoal: "Добавить цель",
  getAdvice: "Получить совет",

  mainGoal: "Главная цель",
  targetMoney: "Сумма цели",
  deadline: "Срок",
  savedMoney: "Накоплено",

  overallProgress: "Общий прогресс",
  goalProgress: "Прогресс к цели",
  strategicProgress: "Стратегический прогресс",

  active: "Активно",
  requiredMoney: "Необходимая сумма",

  goalDescription:
    "Основные финансовые показатели цели и срок отображаются здесь.",

  financeStatus: "Финансовое состояние",
  monthlyFinance: "Финансы за месяц",
  bankBalance: "Баланс",
  monthlyIncome: "Доход за месяц",
  monthlyExpense: "Расход за месяц",

  smartAdvisor: "Умный советник",
  personalGrowthAdvisor: "Советник по личному развитию",
  openAdvisor: "Открыть советника",
  advisorDescription:
    "На основе цели, финансов и плана предлагает следующий наиболее полезный шаг.",

  plannerOverview: "Состояние плана",
  openPlanner: "Открыть план",
},

    settings: {
      title: "Настройки приложения",
      description:
        "Управляйте языком, валютой, стартовой страницей, внешним видом и уведомлениями.",

      language: "Язык",
      languageDescription:
        "Выберите основной язык приложения.",

      currency: "Валюта",
      currencyDescription:
        "Выберите основную валюту для финансовых данных.",

      startPage: "Стартовая страница",
      startPageDescription:
        "Выберите раздел, который будет открываться при запуске.",

      appearance: "Внешний вид",

      notifications: "Уведомления",
      notificationsDescription:
        "Выберите, какие уведомления вы хотите получать.",

      reset: "Сбросить настройки",

      dark: "Тёмная",
      light: "Светлая",
      system: "Системная",

      autoSaveTitle:
        "Настройки сохраняются автоматически",
      autoSaveDescription:
        "Изменения сохраняются в локальном хранилище браузера.",
    },
  },

  en: {
    nav: {
      dashboard: "Home",
      goals: "Goals",
      finance: "Finance",
      analytics: "Growth analysis",
      aiCoach: "Smart advisor",
      planner: "Planning",
      settings: "Settings",
    },

    goals: {
  title: "Goals",
  mainGoal: "Main goal",
  createGoal: "Add goal",
  editGoal: "Edit goal",
  goalName: "Goal name",
  targetMoney: "Target amount",
  currentMoney: "Saved",
  deadline: "Deadline",
  save: "Save",
  cancel: "Cancel",
  progress: "Progress",
  noGoal: "No main goal has been set yet",
},

    planner: {
      goalTree: "Goal structure",
yearlyGoal: "Yearly goal",
monthlyGoal: "Monthly goal",
weeklyGoal: "Weekly goal",
dailyGoal: "Daily goal",
noLinkedGoal: "No linked goal",

currentFocus: "Current priority",
focusDescription:
  "Shows the most important task to focus on right now.",

plannerOverview: "Planning overview",
openPlanner: "Open planning",
      selectedPeriod: "Selected period",
today: "Today",

totalTasks: "Total tasks",
completedTasks: "Completed",
urgentTasks: "Important + urgent",
completion: "Plan completion",

taskPlaceholder: "Example: Call customers",
choosePriority: "Choose a priority for the task.",

quadrantEmpty: "No tasks in this section yet.",

doNow: "Do now",
schedule: "Schedule",
delegate: "Delegate",
remove: "Remove",
      pageDescription:
  "Manage your daily, weekly, monthly and yearly tasks in one place.",
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",

  title: "Planning",
  todayPlan: "Today's plan",
  addTask: "Add task",
  editTask: "Edit task",
  taskTitle: "Task title",
  description: "Description",
  saveTask: "Save",
  cancel: "Cancel",
  completed: "Completed",
  pending: "Pending",
  progress: "Progress",
  tasks: "Tasks",
  noTasks: "No tasks yet",

  urgentImportant: "Important + urgent",
  importantNotUrgent: "Important + not urgent",
  urgentNotImportant: "Urgent + not important",
  notUrgentNotImportant: "Not urgent + not important",

  urgentImportantAction: "Do now",
  importantNotUrgentAction: "Schedule",
  urgentNotImportantAction: "Delegate",
  notUrgentNotImportantAction: "Remove or postpone",
},

    common: {
      total: "TOTAL",
      appName: "ÖSÜŞ",
      appDescription:
        "Personal Growth Management System",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      open: "Open",
      back: "Back",
      active: "Active",
      completed: "Completed",
    },

    dashboard: {
      strategicProgressDescription:
  "A combined view of financial progress and planning execution.",
      netIncome: "Net income",
      heroDescription:
  "Manage your goals, finances and daily progress in one place. ÖSÜŞ not only shows your data, but helps you identify the next most important step.",
  welcome: "Welcome.",
  todayQuestion: "What are we growing today?",
  addGoal: "Add goal",
  getAdvice: "Get advice",

  mainGoal: "Main goal",
  targetMoney: "Target amount",
  deadline: "Deadline",
  savedMoney: "Saved",

  overallProgress: "Overall progress",
  goalProgress: "Goal progress",
  strategicProgress: "Strategic progress",

  active: "Active",
  requiredMoney: "Required amount",

  goalDescription:
    "The main financial metrics and deadline for your goal are shown here.",

  financeStatus: "Financial status",
  monthlyFinance: "Monthly finances",
  bankBalance: "Bank balance",
  monthlyIncome: "Monthly income",
  monthlyExpense: "Monthly expense",

  smartAdvisor: "Smart advisor",
  personalGrowthAdvisor: "Personal growth advisor",
  openAdvisor: "Open advisor",
  advisorDescription:
    "Uses your goal, finances and plan to recommend the next most useful step.",

  plannerOverview: "Planning status",
  openPlanner: "Open planning",
},

    settings: {
      title: "Application settings",
      description:
        "Manage language, currency, start page, appearance and notifications.",

      language: "Language",
      languageDescription:
        "Choose the main application language.",

      currency: "Currency",
      currencyDescription:
        "Choose the primary currency for financial data.",

      startPage: "Start page",
      startPageDescription:
        "Choose the section that opens when the application starts.",

      appearance: "Appearance",

      notifications: "Notifications",
      notificationsDescription:
        "Choose which notifications you want to receive.",

      reset: "Reset settings",

      dark: "Dark",
      light: "Light",
      system: "System",

      autoSaveTitle:
        "Settings are saved automatically",
      autoSaveDescription:
        "Changes are stored in your browser's local storage.",
    },
  },
} as const;

export type TranslationKey =
  typeof translations.tk;

export function getTranslations(
  language: AppLanguage,
) {
  return translations[language];
}