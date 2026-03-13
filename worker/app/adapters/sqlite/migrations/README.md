# SQLite migrations (Alembic)

This project uses **SQLModel** (SQLAlchemy) for the SQLite relational DB.

## Commands (from `worker/`)

```zsh
uv run alembic -c app/adapters/sqlite/migrations/alembic.ini revision --autogenerate -m "init"
uv run alembic -c app/adapters/sqlite/migrations/alembic.ini upgrade head
```

Notes:
- The SQLite URL is taken from `app.adapters.sqlite.database.DATABASE_URL` inside `env.py`.
