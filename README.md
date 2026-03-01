# Персональное портфолио - Кожевников Антон

Портфолио разработчика, созданное на базе Quasar Framework.

## Технологии

- **Vue 3** - современный JavaScript фреймворк
- **Quasar Framework** - framework для создания responsive веб-приложений
- **TypeScript** - типизированный JavaScript
- **Vue Router** - routing для SPA
- **Pinia** - state management
- **ApexCharts** - для визуализации навыков

## Особенности

- Адаптивный дизайн для всех устройств
- Визуализация навыков с помощью ApexCharts
- Четкая структура информации с использованием Quasar Expansion Items
- Поддержка русского языка

## Как запустить

### Установка зависимостей

```bash
npm install
```

### Режим разработки

```bash
npm run dev
```

### Сборка для продакшена

```bash
npm run build
```

## Деплой на GitHub Pages

Для деплоя на GitHub Pages выполните:

```bash
npm run deploy
```

Это автоматически выполнит:
1. Сборку проекта с правильным путём для GitHub Pages
2. Деплой в ветку `gh-pages`

### Ручной деплой

Если автоматический деплой не работает, можно выполнить вручную:

1. Соберите проект:
```bash
npm run build:gh-pages
```

2. Залейте содержимое папки `dist/spa` в ветку `gh-pages` вашего репозитория

## Структура проекта

```
src/
├── app/
│   ├── layouts/
│   │   └── portfolioLayout/      # Основной макет портфолио
│   ├── router/                   # Конфигурация роутинга
│   └── stores/                   # Pinia store
└── pages/
    └── portfolio/
        └── sections/             # Секции портфолио
            ├── AboutSection.vue
            ├── ExperienceSection.vue
            ├── SkillsSection.vue
            └── TechStackSection.vue
```

## Лицензия

MIT