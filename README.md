# vkr2026 — Next.js

MVP веб-интерфейса персонализированных рекомендаций образовательных курсов.

## Стек

- Next.js Pages Router
- React
- TypeScript
- Prisma ORM
- PostgreSQL
- NextAuth.js

## Локальный запуск

1. Скопируйте `.env.example` в `.env`.
2. Укажите PostgreSQL connection string в `DATABASE_URL`.
   Для Vercel подойдет Neon, Supabase или Vercel Postgres.
3. Синхронизируйте схему с базой:

```bash
npm run db:push
```

4. Запустите проект:

```bash
npm run dev
```

Стартовые курсы добавляются в базу автоматически при первом обращении к страницам каталога, главной или курса.



