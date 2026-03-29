# Open Brain Test

## Что реализовано
- Backend на NestJS с JWT-аутентификацией.
- CRUD-операции для заявок (applications):
  - получение списка с фильтрацией по статусу и пагинацией,
  - получение деталей заявки по id,
  - создание заявки,
  - обновление заявки (в т.ч. статуса).
- Frontend на React:
  - авторизация,
  - дашборд с доской заявок по статусам,
  - фильтрация заявок,
  - обновление статуса,
  - просмотр деталей заявки,
  - создание заявки через модальное окно.
- PostgreSQL + TypeORM миграции и seed-скрипты.
- Docker Compose для локального запуска всего стека.

## Стек
- Frontend: React 19, TypeScript, Vite, Tailwind CSS, React Router.
- Backend: NestJS 11, TypeScript, TypeORM, class-validator, JWT/Passport.
- База данных: PostgreSQL 16.
- Инфраструктура: Docker, Docker Compose.

## Как запустить

### Вариант 1. Через Docker (рекомендуется)
Из корня проекта:

```bash
docker compose up -d --build
```

Сервисы:
- Frontend: http://localhost:5173
- Backend: http://localhost:4004
- Postgres: localhost:5433

Остановить:

```bash
docker compose down
```

Перезапустить только frontend:

```bash
docker compose restart frontend
```

### Вариант 2. Локально без Docker
1. Установить зависимости:

```bash
cd backend && npm ci
cd ../frontend && npm ci
```

2. Поднять PostgreSQL (локально или в контейнере) и настроить переменные окружения backend.

3. Применить миграции и сиды:

```bash
cd backend
npm run migration:run
npm run database:seed
```

4. Запустить backend:

```bash
npm run start:dev
```

5. В отдельном терминале запустить frontend:

```bash
cd ../frontend
npm run dev
```

## Какие есть допущения
- Список статусов заявки фиксированный: `new`, `in_review`, `approved`, `rejected`.
- Нет ролевой модели (RBAC): для MVP достаточно авторизованного пользователя.
- Для MVP отсутствуют вложения/файлы и сложные бизнес-переходы статусов.
- Токены доступа хранятся в БД (таблица `user_access_tokens`) и проверяются на backend.

## Что не успел сделать
- Полноценные e2e тесты пользовательских сценариев frontend + backend.
- Аудит действий по заявкам (кто и когда сменил статус).
- Поиск/сортировки/расширенные фильтры по заявкам.
- Переходы статусов по строгой state machine.
- Уведомления (email/webhook) при изменении статуса.

## Что бы улучшил в production-версии
- Добавил RBAC и разграничение прав по ролям.
- Вынес конфигурацию и секреты в централизованный secret manager.
- Добавил observability: structured logging, tracing, метрики, алерты.
- Усилил безопасность: rate limiting, CORS policy, refresh token flow, hardening headers.
- Настроил CI/CD: quality gates, автотесты, миграции на деплое, rolling/blue-green.
- Добавил кеширование и индексы под реальные паттерны запросов.

## Архитектурное описание (кратко)

### Почему выбран такой стек
- NestJS + TypeScript дают предсказуемую модульную архитектуру, DI и удобную тестируемость.
- React + Vite обеспечивают быстрый цикл разработки и простую поставку SPA.
- PostgreSQL подходит для транзакционной доменной модели и надежной консистентности.

### Как устроены модули
- Backend организован по feature-модулям (например, `auth`, `applications`).
- Внутри модуля разделены слои:
  - presenter (контроллеры, transport DTO),
  - domain (бизнес-логика сервисов),
  - data (репозитории/доступ к БД).
- Frontend разделен на страницы, API-слой и общие UI-компоненты.

### Как устроена БД
- Основные таблицы:
  - `users` — учетные записи пользователей,
  - `applications` — заявки,
  - `user_access_tokens` — выданные access tokens.
- Миграции TypeORM версионируют схему, сиды инициализируют стартовые данные.
- Между `user_access_tokens.user_id` и `users.id` настроен FK с `ON DELETE CASCADE`.

### Как обрабатываются ошибки
- Используется единый `GlobalExceptionFilter`.
- Бизнес-ошибки формируются как `HttpException` с `error_code` и опциональными `details`.
- Ответы ошибок нормализуются в единый JSON-формат (`statusCode`, `error_code`, `message/details`, `timestamp`, `path`).
