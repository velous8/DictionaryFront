# Dictionary Frontend

Frontend для приложения **LexiDrill** — сервиса для изучения английских слов.

Приложение позволяет просматривать словарь, тренировать неизвестные слова, отслеживать прогресс обучения и управлять словарём в административной панели.

## Стек

* **Vue 3**
* **Vite**
* **Vue Router**
* **Chart.js / vue-chartjs**
* **JavaScript**
* **Fetch API**

## Основные возможности

* Регистрация и авторизация пользователей
* JWT-аутентификация с автоматическим обновлением access token
* Просмотр словаря
* Фильтрация слов по прогрессу
* Сортировка слов
* Тренировка неизвестных слов
* Тестирование слов после тренировки
* Отображение прогресса обучения
* Административное создание, редактирование и удаление слов
* Адаптивная навигация для desktop и mobile

## Структура проекта

```text
src/
├── assets/
│   ├── hideLogo.svg
│   ├── knowLogo.svg
│   ├── logo.svg
│   ├── progressLogo.svg
│   ├── showLogo.svg
│   ├── studyLogo.svg
│   └── wordsLogo.svg
│
├── components/
│   ├── BottomNavPanel.vue
│   ├── castmSelect.vue
│   ├── DiagramProgress.vue
│   ├── Header.vue
│   ├── NavPanel.vue
│   ├── TrainWordsCard.vue
│   ├── UnknownWordsCard.vue
│   ├── Word.vue
│   └── WordsCard.vue
│
├── composables/
│   └── useAuth.js
│
├── pages/
│   ├── AdminWords.vue
│   ├── Login.vue
│   ├── Progress.vue
│   ├── Register.vue
│   ├── Train.vue
│   └── WordList.vue
│
├── styles/
│   └── main.css
│
├── utils/
│   ├── api.js
│   └── auth.js
│
├── App.vue
├── axios.js
└── main.js
```

## Страницы

### WordList

Главная страница `/`.

Отображает словарь пользователя и позволяет:

* просматривать все слова;
* фильтровать слова:

  * Все;
  * Незнакомые;
  * Изучаемые;
  * Выученные;
* сортировать слова по алфавиту;
* видеть количество слов и текущий прогресс.

### Train

Страница `/train` для тренировки слов.

Сценарий тренировки:

1. Загружаются неизвестные пользователю слова.
2. Формируется набор слов для тренировки.
3. Пользователь отмечает, знает он слово или нет.
4. Формируется пул слов для изучения.
5. Запускается тестирование.
6. Результаты теста отправляются на backend и обновляют прогресс.

### Progress

Страница `/progress`.

Отображает статистику слов пользователя в виде круговой диаграммы:

* выученные;
* изучаемые;
* неизвестные.

Также содержит рекомендации по использованию приложения.

### Login

Страница `/login`.

Предоставляет:

* ввод email;
* ввод пароля;
* валидацию формы;
* авторизацию через API;
* обработку ошибок авторизации.

### Register

Страница `/register`.

Предоставляет:

* регистрацию пользователя;
* проверку email;
* проверку длины пароля;
* проверку совпадения паролей;
* сообщение о необходимости активировать аккаунт через email.

### AdminWords

Страница `/admin`.

Доступна пользователям с ролью `ADMIN`.

Позволяет:

* просматривать слова;
* создавать слова;
* редактировать слова;
* удалять слова.

## Router

Маршрутизация реализована через **Vue Router**.

| Route       | Страница     | Назначение          |
| ----------- | ------------ | ------------------- |
| `/`         | `WordList`   | Словарь             |
| `/train`    | `Train`      | Тренировка          |
| `/progress` | `Progress`   | Прогресс            |
| `/register` | `Register`   | Регистрация         |
| `/login`    | `Login`      | Авторизация         |
| `/admin`    | `AdminWords` | Управление словарём |

Маршрут `/admin` защищён через `meta.requiresAdmin` и проверку роли пользователя.

## Основные компоненты

### `Word.vue`

Отображает отдельное слово:

* английское слово;
* транскрипцию;
* перевод;
* процент прогресса.

### `WordsCard.vue`

Карточка слова для тренировки.

Позволяет:

* показать или скрыть перевод;
* отметить слово как известное;
* отметить слово как неизвестное.

### `TrainWordsCard.vue`

Компонент тестирования слов из сформированного пула.

Хранит список слов в `localStorage` и определяет слова, которые пользователь правильно узнал.

### `DiagramProgress.vue`

Строит Doughnut Chart с использованием `Chart.js`.

Получает данные о прогрессе и общем количестве слов через API.

### `NavPanel.vue`

Desktop-навигация приложения.

Содержит переходы к:

* словам;
* тренировке;
* прогрессу;
* авторизации;
* регистрации;
* выходу из аккаунта.

### `BottomNavPanel.vue`

Мобильная навигация с основными разделами:

* Слова;
* Тренировка;
* Прогресс.

### `Header.vue`

Верхняя панель приложения с названием **LexiDrill**.

### `castmSelect.vue`

Кастомный dropdown-компонент, используемый для фильтрации и сортировки слов.

## Авторизация

Логика авторизации реализована в `composables/useAuth.js`.

Composable управляет:

* `accessToken`;
* текущим пользователем;
* состоянием авторизации;
* login;
* register;
* logout;
* восстановлением сессии через refresh token.

Access token сохраняется в `localStorage`.

Refresh token используется через `httpOnly` cookie backend API.

При получении `401` API-слой автоматически пытается получить новый access token.

## API

Работа с backend реализована в `utils/api.js`.

### Authentication

```text
POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/refresh
```

### Words

```text
GET   /word
GET   /word/amount
GET   /word/idsUnknown
GET   /word/unknown
GET   /word/known
GET   /word/progress
PATCH /word/progress
```

### Admin

```text
POST   /admin/word
PATCH  /admin/word/:id
DELETE /admin/word/:id
```

API автоматически добавляет JWT в `Authorization` header для защищённых запросов и выполняет refresh access token при `401`.

## Запуск

Установить зависимости:

```bash
npm install
```

Запустить development server:

```bash
npm run dev
```

Собрать production-версию:

```bash
npm run build
```

Запустить проверку ESLint:

```bash
npm run lint
```

По умолчанию frontend использует backend API:

```text
http://localhost:3000
```

## Архитектура

```text
Vue Application
│
├── Pages
│   ├── WordList
│   ├── Train
│   ├── Progress
│   ├── Login
│   ├── Register
│   └── AdminWords
│
├── Components
│   ├── Word
│   ├── WordsCard
│   ├── TrainWordsCard
│   ├── DiagramProgress
│   └── Navigation
│
├── Composables
│   └── useAuth
│
├── Utils
│   ├── api
│   └── auth
│
└── Backend API
    └── Nest Dictionary API
```
