// Предложения с пропусками для каждого звука
export const sentences = {
  "hard-r": [
    {
      id: 1,
      sentence: "Мальчик играет с _____.",
      correctAnswer: "ракетой",
      targetWord: "ракета",
      options: [
        { text: "ракетой", emoji: "🚀" },
        { text: "куклой", emoji: "🪆" },
        { text: "машиной", emoji: "🚗" }
      ],
      emoji: "🚀",
      audioPrompt: "Привет! Мальчик играет с ракетой. Повтори: ракета!"
    },
    {
      id: 2,
      sentence: "На небе яркая _____.",
      correctAnswer: "радуга",
      targetWord: "радуга",
      options: [
        { text: "радуга", emoji: "🌈" },
        { text: "туча", emoji: "☁️" },
        { text: "птица", emoji: "🐦" }
      ],
      emoji: "🌈",
      audioPrompt: "Смотри! На небе яркая радуга. Повтори: радуга!"
    },
    {
      id: 3,
      sentence: "В аквариуме плавает _____.",
      correctAnswer: "рыба",
      targetWord: "рыба",
      options: [
        { text: "рыба", emoji: "🐟" },
        { text: "утка", emoji: "🦆" },
        { text: "кошка", emoji: "🐱" }
      ],
      emoji: "🐟",
      audioPrompt: "В аквариуме плавает рыба. Повтори: рыба!"
    },
    {
      id: 4,
      sentence: "Мама дарит красивую _____.",
      correctAnswer: "розу",
      targetWord: "роза",
      options: [
        { text: "розу", emoji: "🌹" },
        { text: "книгу", emoji: "📚" },
        { text: "игру", emoji: "🎮" }
      ],
      emoji: "🌹",
      audioPrompt: "Мама дарит красивую розу. Повтори: роза!"
    },
    {
      id: 5,
      sentence: "Ребёнок рисует _____.",
      correctAnswer: "робота",
      targetWord: "робот",
      options: [
        { text: "робота", emoji: "🤖" },
        { text: "дом", emoji: "🏠" },
        { text: "кота", emoji: "🐈" }
      ],
      emoji: "🤖",
      audioPrompt: "Ребёнок рисует робота. Повтори: робот!"
    },
    {
      id: 6,
      sentence: "На пляже ползёт _____.",
      correctAnswer: "рак",
      targetWord: "рак",
      options: [
        { text: "рак", emoji: "🦀" },
        { text: "жук", emoji: "🪲" },
        { text: "муха", emoji: "🪰" }
      ],
      emoji: "🦀",
      audioPrompt: "На пляже ползёт рак. Повтори: рак!"
    },
    {
      id: 7,
      sentence: "Папа поднял _____.",
      correctAnswer: "руку",
      targetWord: "рука",
      options: [
        { text: "руку", emoji: "✋" },
        { text: "ногу", emoji: "🦵" },
        { text: "голову", emoji: "🗣️" }
      ],
      emoji: "✋",
      audioPrompt: "Папа поднял руку. Повтори: рука!"
    },
  ],
  "soft-r": [
    {
      id: 1,
      sentence: "В школу я несу _____.",
      correctAnswer: "рюкзак",
      targetWord: "рюкзак",
      options: [
        { text: "рюкзак", emoji: "🎒" },
        { text: "портфель", emoji: "💼" },
        { text: "сумку", emoji: "👜" }
      ],
      emoji: "🎒",
      audioPrompt: "В школу я несу рюкзак. Повтори: рюкзак!"
    },
    {
      id: 2,
      sentence: "На завтрак мама дала _____.",
      correctAnswer: "ряженку",
      targetWord: "ряженка",
      options: [
        { text: "ряженку", emoji: "🥛" },
        { text: "молоко", emoji: "🍼" },
        { text: "воду", emoji: "💧" }
      ],
      emoji: "🥛",
      audioPrompt: "На завтрак мама дала ряженку. Повтори: ряженка!"
    },
    {
      id: 3,
      sentence: "Осенью краснеет _____.",
      correctAnswer: "рябина",
      targetWord: "рябина",
      options: [
        { text: "рябина", emoji: "🌳" },
        { text: "берёза", emoji: "🌲" },
        { text: "сосна", emoji: "🎄" }
      ],
      emoji: "🌳",
      audioPrompt: "Осенью краснеет рябина. Повтори: рябина!"
    },
    {
      id: 4,
      sentence: "Мы пошли купаться на _____.",
      correctAnswer: "реку",
      targetWord: "река",
      options: [
        { text: "реку", emoji: "🏞️" },
        { text: "море", emoji: "🌊" },
        { text: "озеро", emoji: "💦" }
      ],
      emoji: "🏞️",
      audioPrompt: "Мы пошли купаться на реку. Повтори: река!"
    },
    {
      id: 5,
      sentence: "На обед бабушка сварила _____.",
      correctAnswer: "рис",
      targetWord: "рис",
      options: [
        { text: "рис", emoji: "🍚" },
        { text: "суп", emoji: "🍲" },
        { text: "кашу", emoji: "🥣" }
      ],
      emoji: "🍚",
      audioPrompt: "На обед бабушка сварила рис. Повтори: рис!"
    },
    {
      id: 6,
      sentence: "Мама читает сказку маленькому _____.",
      correctAnswer: "ребёнку",
      targetWord: "ребёнок",
      options: [
        { text: "ребёнку", emoji: "🧒" },
        { text: "щенку", emoji: "🐶" },
        { text: "котёнку", emoji: "🐱" }
      ],
      emoji: "🧒",
      audioPrompt: "Мама читает сказку маленькому ребёнку. Повтори: ребёнок!"
    },
    {
      id: 7,
      sentence: "У бабушки на грядке выросла _____.",
      correctAnswer: "редиска",
      targetWord: "редиска",
      options: [
        { text: "редиска", emoji: "🔴" },
        { text: "морковка", emoji: "🥕" },
        { text: "репка", emoji: "🟡" }
      ],
      emoji: "🔴",
      audioPrompt: "У бабушки на грядке выросла редиска. Повтори: редиска!"
    }
  ],
  "hard-l": [
    {
      id: 1,
      sentence: "Ночью светит яркая _____.",
      correctAnswer: "луна",
      targetWord: "луна",
      options: [
        { text: "луна", emoji: "🌙" },
        { text: "звезда", emoji: "⭐" },
        { text: "комета", emoji: "☄️" }
      ],
      emoji: "🌙",
      audioPrompt: "Ночью светит яркая луна. Повтори: луна!"
    },
    {
      id: 2,
      sentence: "На столе стоит _____.",
      correctAnswer: "лампа",
      targetWord: "лампа",
      options: [
        { text: "лампа", emoji: "💡" },
        { text: "ваза", emoji: "🏺" },
        { text: "часы", emoji: "⏰" }
      ],
      emoji: "💡",
      audioPrompt: "На столе стоит лампа. Повтори: лампа!"
    },
    {
      id: 3,
      sentence: "По реке плывёт _____.",
      correctAnswer: "лодка",
      targetWord: "лодка",
      options: [
        { text: "лодка", emoji: "⛵" },
        { text: "рыба", emoji: "🐟" },
        { text: "утка", emoji: "🦆" }
      ],
      emoji: "⛵",
      audioPrompt: "По реке плывёт лодка. Повтори: лодка!"
    },
    {
      id: 4,
      sentence: "В супе лежит _____.",
      correctAnswer: "лук",
      targetWord: "лук",
      options: [
        { text: "лук", emoji: "🧅" },
        { text: "мясо", emoji: "🥩" },
        { text: "хлеб", emoji: "🍞" }
      ],
      emoji: "🧅",
      audioPrompt: "В супе лежит лук. Повтори: лук!"
    },
    {
      id: 5,
      sentence: "У стены стоит деревянный _____.",
      correctAnswer: "стол",
      targetWord: "стол",
      options: [
        { text: "стол", emoji: "🪑" },
        { text: "шкаф", emoji: "🗄️" },
        { text: "диван", emoji: "🛋️" }
      ],
      emoji: "🪑",
      audioPrompt: "У стены стоит деревянный стол. Повтори: стол!"
    },
    {
      id: 6,
      sentence: "На кухне стоит плетёное _____.",
      correctAnswer: "лукошко",
      targetWord: "лукошко",
      options: [
        { text: "лукошко", emoji: "🧺" },
        { text: "ведёрко", emoji: "🪣" },
        { text: "коробка", emoji: "📦" }
      ],
      emoji: "🧺",
      audioPrompt: "На кухне стоит плетёное лукошко. Повтори: лукошко!"
    },
    {
      id: 7,
      sentence: "В саду расцвёл белый _____.",
      correctAnswer: "ландыш",
      targetWord: "ландыш",
      options: [
        { text: "ландыш", emoji: "🌼" },
        { text: "тюльпан", emoji: "🌷" },
        { text: "мак", emoji: "🌺" }
      ],
      emoji: "🌼",
      audioPrompt: "В саду расцвёл белый ландыш. Повтори: ландыш!"
    }
  ],
  "soft-l": [
    {
      id: 1,
      sentence: "Из жёлтого _____ делают сок.",
      correctAnswer: "лимона",
      targetWord: "лимон",
      options: [
        { text: "лимона", emoji: "🍋" },
        { text: "апельсина", emoji: "🍊" },
        { text: "яблока", emoji: "🍎" }
      ],
      emoji: "🍋",
      audioPrompt: "Из жёлтого лимона делают сок. Повтори: лимон!"
    },
    {
      id: 2,
      sentence: "Рыжая _____ живёт в норе.",
      correctAnswer: "лиса",
      targetWord: "лиса",
      options: [
        { text: "лиса", emoji: "🦊" },
        { text: "белка", emoji: "🐿️" },
        { text: "мышь", emoji: "🐭" }
      ],
      emoji: "🦊",
      audioPrompt: "Рыжая лиса живёт в норе. Повтори: лиса!"
    },
    {
      id: 3,
      sentence: "На озере плавает белый _____.",
      correctAnswer: "лебедь",
      targetWord: "лебедь",
      options: [
        { text: "лебедь", emoji: "🦢" },
        { text: "гусь", emoji: "🦢" },
        { text: "утка", emoji: "🦆" }
      ],
      emoji: "🦢",
      audioPrompt: "На озере плавает белый лебедь. Повтори: лебедь!"
    },
    {
      id: 4,
      sentence: "С дерева упал жёлтый _____.",
      correctAnswer: "лист",
      targetWord: "лист",
      options: [
        { text: "лист", emoji: "🍂" },
        { text: "плод", emoji: "🍇" },
        { text: "цветок", emoji: "🌸" }
      ],
      emoji: "🍂",
      audioPrompt: "С дерева упал жёлтый лист. Повтори: лист!"
    },
    {
      id: 5,
      sentence: "Девочка завязала красивую _____.",
      correctAnswer: "ленту",
      targetWord: "лента",
      options: [
        { text: "ленту", emoji: "🎀" },
        { text: "косу", emoji: "👧" },
        { text: "бант", emoji: "🎗️" }
      ],
      emoji: "🎀",
      audioPrompt: "Девочка завязала красивую ленту. Повтори: лента!"
    },
    {
      id: 6,
      sentence: "У леса растёт высокая _____.",
      correctAnswer: "ель",
      targetWord: "ель",
      options: [
        { text: "ель", emoji: "🌲" },
        { text: "сосна", emoji: "🌲" },
        { text: "берёза", emoji: "🌳" }
      ],
      emoji: "🌲",
      audioPrompt: "У леса растёт высокая ель. Повтори: ель!"
    },
    {
      id: 7,
      sentence: "В море плавает большой _____.",
      correctAnswer: "тюлень",
      targetWord: "тюлень",
      options: [
        { text: "тюлень", emoji: "🦭" },
        { text: "дельфин", emoji: "🐬" },
        { text: "кит", emoji: "🐳" }
      ],
      emoji: "🦭",
      audioPrompt: "В море плавает большой тюлень. Повтори: тюлень!"
    }
  ],
  "hard-s": [
    {
      id: 1,
      sentence: "Мама купила яблочный _____.",
      correctAnswer: "сок",
      targetWord: "сок",
      options: [
        { text: "сок", emoji: "🧃" },
        { text: "чай", emoji: "🍵" },
        { text: "компот", emoji: "🥤" }
      ],
      emoji: "🧃",
      audioPrompt: "Мама купила яблочный сок. Повтори: сок!"
    },
    {
      id: 2,
      sentence: "В зоопарке живёт большой _____.",
      correctAnswer: "слон",
      targetWord: "слон",
      options: [
        { text: "слон", emoji: "🐘" },
        { text: "тигр", emoji: "🐯" },
        { text: "лев", emoji: "🦁" }
      ],
      emoji: "🐘",
      audioPrompt: "В зоопарке живёт большой слон. Повтори: слон!"
    },
    {
      id: 3,
      sentence: "На дереве сидит мудрая _____.",
      correctAnswer: "сова",
      targetWord: "сова",
      options: [
        { text: "сова", emoji: "🦉" },
        { text: "ворона", emoji: "🐦‍⬛" },
        { text: "галка", emoji: "🐦" }
      ],
      emoji: "🦉",
      audioPrompt: "На дереве сидит мудрая сова. Повтори: сова!"
    },
    {
      id: 4,
      sentence: "Утром встаёт яркое _____.",
      correctAnswer: "солнце",
      targetWord: "солнце",
      options: [
        { text: "солнце", emoji: "☀️" },
        { text: "облако", emoji: "☁️" },
        { text: "небо", emoji: "🌤️" }
      ],
      emoji: "☀️",
      audioPrompt: "Утром встаёт яркое солнце. Повтори: солнце!"
    },
    {
      id: 5,
      sentence: "Во дворе лает _____.",
      correctAnswer: "собака",
      targetWord: "собака",
      options: [
        { text: "собака", emoji: "🐕" },
        { text: "кошка", emoji: "🐈" },
        { text: "птица", emoji: "🐦" }
      ],
      emoji: "🐕",
      audioPrompt: "Во дворе лает собака. Повтори: собака!"
    },
    {
      id: 6,
      sentence: "Маша взяла в школу тяжёлую _____.",
      correctAnswer: "сумку",
      targetWord: "сумка",
      options: [
        { text: "сумку", emoji: "👜" },
        { text: "книгу", emoji: "📚" },
        { text: "коробку", emoji: "📦" }
      ],
      emoji: "👜",
      audioPrompt: "Маша взяла в школу тяжёлую сумку. Повтори: сумка!"
    },
    {
      id: 7,
      sentence: "У кота холодный мокрый _____.",
      correctAnswer: "нос",
      targetWord: "нос",
      options: [
        { text: "нос", emoji: "🐱" },
        { text: "хвост", emoji: "🐈" },
        { text: "лапа", emoji: "🐾" }
      ],
      emoji: "🐱",
      audioPrompt: "У кота холодный мокрый нос. Повтори: нос!"
    }
  ],
  "soft-s": [
    {
      id: 1,
      sentence: "На ветке чирикает _____.",
      correctAnswer: "синица",
      targetWord: "синица",
      options: [
        { text: "синица", emoji: "🐦" },
        { text: "воробей", emoji: "🐦‍⬛" },
        { text: "голубь", emoji: "🕊️" }
      ],
      emoji: "🐦",
      audioPrompt: "На ветке чирикает синица. Повтори: синица!"
    },
    {
      id: 2,
      sentence: "Весной цветёт душистая _____.",
      correctAnswer: "сирень",
      targetWord: "сирень",
      options: [
        { text: "сирень", emoji: "💜" },
        { text: "роза", emoji: "🌹" },
        { text: "ромашка", emoji: "🌼" }
      ],
      emoji: "💜",
      audioPrompt: "Весной цветёт душистая сирень. Повтори: сирень!"
    },
    {
      id: 3,
      sentence: "Бабушка просеивает муку через _____.",
      correctAnswer: "сито",
      targetWord: "сито",
      options: [
        { text: "сито", emoji: "🥄" },
        { text: "дуршлаг", emoji: "🍲" },
        { text: "миску", emoji: "🥣" }
      ],
      emoji: "🥄",
      audioPrompt: "Бабушка просеивает муку через сито. Повтори: сито!"
    },
    {
      id: 4,
      sentence: "Дней в неделе ровно _____.",
      correctAnswer: "семь",
      targetWord: "семь",
      options: [
        { text: "семь", emoji: "7️⃣" },
        { text: "пять", emoji: "5️⃣" },
        { text: "десять", emoji: "🔟" }
      ],
      emoji: "7️⃣",
      audioPrompt: "Дней в неделе ровно семь. Повтори: семь!"
    },
    {
      id: 5,
      sentence: "Коза жуёт душистое _____.",
      correctAnswer: "сено",
      targetWord: "сено",
      options: [
        { text: "сено", emoji: "🌾" },
        { text: "салат", emoji: "🥗" },
        { text: "траву", emoji: "🌿" }
      ],
      emoji: "🌾",
      audioPrompt: "Коза жуёт душистое сено. Повтори: сено!"
    },
    {
      id: 6,
      sentence: "Бабушка надела красивые _____.",
      correctAnswer: "серьги",
      targetWord: "серьги",
      options: [
        { text: "серьги", emoji: "💎" },
        { text: "бусы", emoji: "📿" },
        { text: "кольца", emoji: "💍" }
      ],
      emoji: "💎",
      audioPrompt: "Бабушка надела красивые серьги. Повтори: серьги!"
    },
    {
      id: 7,
      sentence: "После лета наступила _____.",
      correctAnswer: "осень",
      targetWord: "осень",
      options: [
        { text: "осень", emoji: "🍂" },
        { text: "весна", emoji: "🌷" },
        { text: "зима", emoji: "❄️" }
      ],
      emoji: "🍂",
      audioPrompt: "После лета наступила осень. Повтори: осень!"
    }
  ],
  "hard-z": [
    {
      id: 1,
      sentence: "По лесу прыгает серый _____.",
      correctAnswer: "заяц",
      targetWord: "заяц",
      options: [
        { text: "заяц", emoji: "🐰" },
        { text: "волк", emoji: "🐺" },
        { text: "медведь", emoji: "🐻" }
      ],
      emoji: "🐰",
      audioPrompt: "По лесу прыгает серый заяц. Повтори: заяц!"
    },
    {
      id: 2,
      sentence: "Когда идёт дождь, я беру _____.",
      correctAnswer: "зонт",
      targetWord: "зонт",
      options: [
        { text: "зонт", emoji: "☂️" },
        { text: "шапку", emoji: "🧢" },
        { text: "шарф", emoji: "🧣" }
      ],
      emoji: "☂️",
      audioPrompt: "Когда идёт дождь, я беру зонт. Повтори: зонт!"
    },
    {
      id: 3,
      sentence: "У короля есть большой _____.",
      correctAnswer: "замок",
      targetWord: "замок",
      options: [
        { text: "замок", emoji: "🏰" },
        { text: "дворец", emoji: "🏛️" },
        { text: "башня", emoji: "🗼" }
      ],
      emoji: "🏰",
      audioPrompt: "У короля есть большой замок. Повтори: замок!"
    },
    {
      id: 4,
      sentence: "Летом мы разрезали спелый _____.",
      correctAnswer: "арбуз",
      targetWord: "арбуз",
      options: [
        { text: "арбуз", emoji: "🍉" },
        { text: "дыню", emoji: "🍈" },
        { text: "тыкву", emoji: "🎃" }
      ],
      emoji: "🍉",
      audioPrompt: "Летом мы разрезали спелый арбуз. Повтори: арбуз!"
    },
    {
      id: 5,
      sentence: "Коза зовёт маленького _____.",
      correctAnswer: "козлёнка",
      targetWord: "козлёнок",
      options: [
        { text: "козлёнка", emoji: "🐐" },
        { text: "ягнёнка", emoji: "🐑" },
        { text: "телёнка", emoji: "🐮" }
      ],
      emoji: "🐐",
      audioPrompt: "Коза зовёт маленького козлёнка. Повтори: козлёнок!"
    },
    {
      id: 6,
      sentence: "Ночью на небе ярко светит _____.",
      correctAnswer: "звезда",
      targetWord: "звезда",
      options: [
        { text: "звезда", emoji: "⭐" },
        { text: "луна", emoji: "🌙" },
        { text: "комета", emoji: "☄️" }
      ],
      emoji: "⭐",
      audioPrompt: "Ночью на небе ярко светит звезда. Повтори: звезда!"
    },
    {
      id: 7,
      sentence: "В комнате звучит весёлая _____.",
      correctAnswer: "музыка",
      targetWord: "музыка",
      options: [
        { text: "музыка", emoji: "🎵" },
        { text: "тишина", emoji: "🤫" },
        { text: "сказка", emoji: "📖" }
      ],
      emoji: "🎵",
      audioPrompt: "В комнате звучит весёлая музыка. Повтори: музыка!"
    }
  ],
  "soft-z": [
    {
      id: 1,
      sentence: "Когда холодно, наступает _____.",
      correctAnswer: "зима",
      targetWord: "зима",
      options: [
        { text: "зима", emoji: "❄️" },
        { text: "осень", emoji: "🍂" },
        { text: "весна", emoji: "🌸" }
      ],
      emoji: "❄️",
      audioPrompt: "Когда холодно, наступает зима. Повтори: зима!"
    },
    {
      id: 2,
      sentence: "Мы живём на планете _____.",
      correctAnswer: "Земля",
      targetWord: "Земля",
      options: [
        { text: "Земля", emoji: "🌍" },
        { text: "Марс", emoji: "🔴" },
        { text: "Луна", emoji: "🌙" }
      ],
      emoji: "🌍",
      audioPrompt: "Мы живём на планете Земля. Повтори: Земля!"
    },
    {
      id: 3,
      sentence: "Девочка смотрится в _____.",
      correctAnswer: "зеркало",
      targetWord: "зеркало",
      options: [
        { text: "зеркало", emoji: "🪞" },
        { text: "окно", emoji: "🪟" },
        { text: "экран", emoji: "📱" }
      ],
      emoji: "🪞",
      audioPrompt: "Девочка смотрится в зеркало. Повтори: зеркало!"
    },
    {
      id: 4,
      sentence: "На лугу пасётся полосатая _____.",
      correctAnswer: "зебра",
      targetWord: "зебра",
      options: [
        { text: "зебра", emoji: "🦓" },
        { text: "лошадь", emoji: "🐴" },
        { text: "корова", emoji: "🐄" }
      ],
      emoji: "🦓",
      audioPrompt: "На лугу пасётся полосатая зебра. Повтори: зебра!"
    },
    {
      id: 5,
      sentence: "На верёвке завязали крепкий _____.",
      correctAnswer: "узел",
      targetWord: "узел",
      options: [
        { text: "узел", emoji: "🪢" },
        { text: "бантик", emoji: "🎀" },
        { text: "петлю", emoji: "➰" }
      ],
      emoji: "🪢",
      audioPrompt: "На верёвке завязали крепкий узел. Повтори: узел!"
    },
    {
      id: 6,
      sentence: "Мама купила детям ванильный _____.",
      correctAnswer: "зефир",
      targetWord: "зефир",
      options: [
        { text: "зефир", emoji: "🍬" },
        { text: "шоколад", emoji: "🍫" },
        { text: "пряник", emoji: "🍪" }
      ],
      emoji: "🍬",
      audioPrompt: "Мама купила детям ванильный зефир. Повтори: зефир!"
    },
    {
      id: 7,
      sentence: "В сказке живёт добрая _____.",
      correctAnswer: "Зина",
      targetWord: "Зина",
      options: [
        { text: "Зина", emoji: "👧" },
        { text: "Маша", emoji: "👧" },
        { text: "Аня", emoji: "👧" }
      ],
      emoji: "👧",
      audioPrompt: "В сказке живёт добрая Зина. Повтори: Зина!"
    }
  ],
  "hard-sh": [
    {
      id: 1,
      sentence: "На празднике я держу воздушный _____.",
      correctAnswer: "шар",
      targetWord: "шар",
      options: [
        { text: "шар", emoji: "🎈" },
        { text: "флаг", emoji: "🚩" },
        { text: "цветок", emoji: "🌸" }
      ],
      emoji: "🎈",
      audioPrompt: "На празднике я держу воздушный шар. Повтори: шар!"
    },
    {
      id: 2,
      sentence: "Зимой я надеваю тёплую _____.",
      correctAnswer: "шапку",
      targetWord: "шапка",
      options: [
        { text: "шапку", emoji: "🧢" },
        { text: "куртку", emoji: "🧥" },
        { text: "обувь", emoji: "👢" }
      ],
      emoji: "🧢",
      audioPrompt: "Зимой я надеваю тёплую шапку. Повтори: шапка!"
    },
    {
      id: 3,
      sentence: "Бабушка носит меховую _____.",
      correctAnswer: "шубу",
      targetWord: "шуба",
      options: [
        { text: "шубу", emoji: "🧥" },
        { text: "шаль", emoji: "🧣" },
        { text: "юбку", emoji: "👗" }
      ],
      emoji: "🧥",
      audioPrompt: "Бабушка носит меховую шубу. Повтори: шуба!"
    },
    {
      id: 4,
      sentence: "В норке живёт маленькая _____.",
      correctAnswer: "мышь",
      targetWord: "мышь",
      options: [
        { text: "мышь", emoji: "🐭" },
        { text: "крыса", emoji: "🐀" },
        { text: "хомяк", emoji: "🐹" }
      ],
      emoji: "🐭",
      audioPrompt: "В норке живёт маленькая мышь. Повтори: мышь!"
    },
    {
      id: 5,
      sentence: "На столе стоит красивая _____.",
      correctAnswer: "чашка",
      targetWord: "чашка",
      options: [
        { text: "чашка", emoji: "☕" },
        { text: "ваза", emoji: "🏺" },
        { text: "тарелка", emoji: "🍽️" }
      ],
      emoji: "☕",
      audioPrompt: "На столе стоит красивая чашка. Повтори: чашка!"
    },
    {
      id: 6,
      sentence: "На шее у папы тёплый _____.",
      correctAnswer: "шарф",
      targetWord: "шарф",
      options: [
        { text: "шарф", emoji: "🧣" },
        { text: "галстук", emoji: "👔" },
        { text: "ошейник", emoji: "🐕" }
      ],
      emoji: "🧣",
      audioPrompt: "На шее у папы тёплый шарф. Повтори: шарф!"
    },
    {
      id: 7,
      sentence: "На полке лежит пушистая _____.",
      correctAnswer: "шаль",
      targetWord: "шаль",
      options: [
        { text: "шаль", emoji: "🧣" },
        { text: "шапка", emoji: "🧢" },
        { text: "варежка", emoji: "🧤" }
      ],
      emoji: "🧣",
      audioPrompt: "На полке лежит пушистая шаль. Повтори: шаль!"
    }
  ],
  "hard-zh": [
    {
      id: 1,
      sentence: "По листу ползёт зелёный _____.",
      correctAnswer: "жук",
      targetWord: "жук",
      options: [
        { text: "жук", emoji: "🪲" },
        { text: "червяк", emoji: "🪱" },
        { text: "паук", emoji: "🕷️" }
      ],
      emoji: "🪲",
      audioPrompt: "По листу ползёт зелёный жук. Повтори: жук!"
    },
    {
      id: 2,
      sentence: "В Африке живёт высокий _____.",
      correctAnswer: "жираф",
      targetWord: "жираф",
      options: [
        { text: "жираф", emoji: "🦒" },
        { text: "слон", emoji: "🐘" },
        { text: "носорог", emoji: "🦏" }
      ],
      emoji: "🦒",
      audioPrompt: "В Африке живёт высокий жираф. Повтори: жираф!"
    },
    {
      id: 3,
      sentence: "В лесу под деревом сидит колючий _____.",
      correctAnswer: "ёж",
      targetWord: "ёж",
      options: [
        { text: "ёж", emoji: "🦔" },
        { text: "ёршик", emoji: "🧹" },
        { text: "ёлка", emoji: "🎄" }
      ],
      emoji: "🦔",
      audioPrompt: "В лесу под деревом сидит колючий ёж. Повтори: ёж!"
    },
    {
      id: 4,
      sentence: "У пруда квакает зелёная _____.",
      correctAnswer: "жаба",
      targetWord: "жаба",
      options: [
        { text: "жаба", emoji: "🐸" },
        { text: "лягушка", emoji: "🐸" },
        { text: "утка", emoji: "🦆" }
      ],
      emoji: "🐸",
      audioPrompt: "У пруда квакает зелёная жаба. Повтори: жаба!"
    },
    {
      id: 5,
      sentence: "В саду расцвёл душистый _____.",
      correctAnswer: "жасмин",
      targetWord: "жасмин",
      options: [
        { text: "жасмин", emoji: "🌼" },
        { text: "тюльпан", emoji: "🌷" },
        { text: "кактус", emoji: "🌵" }
      ],
      emoji: "🌼",
      audioPrompt: "В саду расцвёл душистый жасмин. Повтори: жасмин!"
    },
    {
      id: 6,
      sentence: "В морозилке лежит сладкое _____.",
      correctAnswer: "мороженое",
      targetWord: "мороженое",
      options: [
        { text: "мороженое", emoji: "🍨" },
        { text: "печенье", emoji: "🍪" },
        { text: "каша", emoji: "🥣" }
      ],
      emoji: "🍨",
      audioPrompt: "В морозилке лежит сладкое мороженое. Повтори: мороженое!"
    },
    {
      id: 7,
      sentence: "Белка нашла большой _____.",
      correctAnswer: "жёлудь",
      targetWord: "жёлудь",
      options: [
        { text: "жёлудь", emoji: "🌰" },
        { text: "орех", emoji: "🥜" },
        { text: "гриб", emoji: "🍄" }
      ],
      emoji: "🌰",
      audioPrompt: "Белка нашла большой жёлудь. Повтори: жёлудь!"
    },
  ],
  "soft-shch": [
    {
      id: 1,
      sentence: "Я чищу зубы зубной _____.",
      correctAnswer: "щёткой",
      targetWord: "щётка",
      options: [
        { text: "щёткой", emoji: "🪥" },
        { text: "пастой", emoji: "🧴" },
        { text: "нитью", emoji: "🧵" }
      ],
      emoji: "🪥",
      audioPrompt: "Я чищу зубы зубной щёткой. Повтори: щётка!"
    },
    {
      id: 2,
      sentence: "В реке плавает хищная _____.",
      correctAnswer: "щука",
      targetWord: "щука",
      options: [
        { text: "щука", emoji: "🐟" },
        { text: "сом", emoji: "🐠" },
        { text: "карась", emoji: "🐡" }
      ],
      emoji: "🐟",
      audioPrompt: "В реке плавает хищная щука. Повтори: щука!"
    },
    {
      id: 3,
      sentence: "У собаки родился маленький _____.",
      correctAnswer: "щенок",
      targetWord: "щенок",
      options: [
        { text: "щенок", emoji: "🐶" },
        { text: "котёнок", emoji: "🐱" },
        { text: "телёнок", emoji: "🐮" }
      ],
      emoji: "🐶",
      audioPrompt: "У собаки родился маленький щенок. Повтори: щенок!"
    },
    {
      id: 4,
      sentence: "Когда идёт дождь, я надеваю _____.",
      correctAnswer: "плащ",
      targetWord: "плащ",
      options: [
        { text: "плащ", emoji: "🧥" },
        { text: "куртку", emoji: "🧥" },
        { text: "шубу", emoji: "🧥" }
      ],
      emoji: "🧥",
      audioPrompt: "Когда идёт дождь, я надеваю плащ. Повтори: плащ!"
    },
    {
      id: 5,
      sentence: "На обед мама сварила вкусные _____.",
      correctAnswer: "щи",
      targetWord: "щи",
      options: [
        { text: "щи", emoji: "🍲" },
        { text: "кашу", emoji: "🥣" },
        { text: "макароны", emoji: "🍝" }
      ],
      emoji: "🍲",
      audioPrompt: "На обед мама сварила вкусные щи. Повтори: щи!"
    },
    {
      id: 6,
      sentence: "Мама добавила в салат свежие _____.",
      correctAnswer: "овощи",
      targetWord: "овощи",
      options: [
        { text: "овощи", emoji: "🥕" },
        { text: "ягоды", emoji: "🍓" },
        { text: "орехи", emoji: "🥜" }
      ],
      emoji: "🥕",
      audioPrompt: "Мама добавила в салат свежие овощи. Повтори: овощи!"
    },
    {
      id: 7,
      sentence: "Мы играем на детской _____.",
      correctAnswer: "площадке",
      targetWord: "площадка",
      options: [
        { text: "площадке", emoji: "🛝" },
        { text: "горке", emoji: "🎢" },
        { text: "качелях", emoji: "🛝" }
      ],
      emoji: "🛝",
      audioPrompt: "Мы играем на детской площадке. Повтори: площадка!"
    }
  ]
};

export const getSentences = (soundId) => {
  return sentences[soundId] || [];
};
