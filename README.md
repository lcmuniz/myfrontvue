# MyFrontVue — Vue 3 API layer example

[![CI](https://github.com/lcmuniz/myfrontvue/actions/workflows/ci.yml/badge.svg)](https://github.com/lcmuniz/myfrontvue/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A small **Vue 3 + TypeScript + Vite** reference app that shows how to keep HTTP concerns out of
components. It talks to the public [JSONPlaceholder](https://jsonplaceholder.typicode.com) API
and lists users, a user's details with their posts, and all posts.

The point is the structure, not the screens:

- **One configured HTTP client** (`axios`) with base URL, timeout and a response interceptor.
- **Typed resource modules** (`users.api.ts`, `posts.api.ts`) that return domain objects, not raw responses.
- **Normalized errors**: everything leaves the API layer as an `ApiError` with a user-safe message
  and optional HTTP status, so views never depend on axios internals.
- **Cancellable requests**: the `useAsync` composable aborts in-flight requests when a new one
  starts or the component unmounts, so stale responses never overwrite fresh data.
- **Loading / error / empty / retry** states handled in one reusable component.

## Tech stack

Vue 3 (`<script setup>`), TypeScript, Vue Router 4, axios, Vite · Vitest + Vue Test Utils ·
ESLint + Prettier · GitHub Actions · Docker (unprivileged nginx).

## Project structure

```
src/
├── api/
│   ├── http.ts          # axios instance factory + error interceptor
│   ├── errors.ts        # ApiError and toApiError()
│   ├── types.ts         # User, Post, ...
│   ├── users.api.ts     # getUsers, getUserById, createUser
│   ├── posts.api.ts     # getPosts, getPostsByUser
│   └── index.ts         # barrel: views import from '@/api' only
├── composables/
│   └── useAsync.ts      # loading/error/data + AbortController
├── components/
│   └── AsyncStatus.vue  # loading, error with retry, empty state
├── views/               # Home, Users, UserDetail, Posts, NotFound
└── router/index.ts      # typed routes, numeric :id, 404 fallback
```

Example of a view using the layer:

```vue
<script setup lang="ts">
import { getUsers } from '@/api'
import { useAsync } from '@/composables/useAsync'
import AsyncStatus from '@/components/AsyncStatus.vue'

const { data: users, error, loading, run } = useAsync((signal) => getUsers({ signal }))
</script>

<template>
  <AsyncStatus :loading :error @retry="run">
    <li v-for="user in users" :key="user.id">{{ user.name }}</li>
  </AsyncStatus>
</template>
```

## Getting started

Requires Node.js 20.19+ or 22.12+.

```bash
npm ci
npm run dev        # http://localhost:5173
```

### Configuration

| Variable       | Default                                | Description         |
| -------------- | -------------------------------------- | ------------------- |
| `VITE_API_URL` | `https://jsonplaceholder.typicode.com` | Base URL of the API |

Copy `.env.example` to `.env` to override it. `.env` files are git-ignored. Remember that every
`VITE_*` variable is embedded in the public JavaScript bundle, so never put secrets in them.

## Scripts

| Command                 | What it does                                |
| ----------------------- | ------------------------------------------- |
| `npm run dev`           | Dev server with hot reload (localhost only) |
| `npm test`              | Unit and component tests (Vitest)           |
| `npm run test:coverage` | Tests with coverage report                  |
| `npm run type-check`    | `vue-tsc` type checking                     |
| `npm run lint`          | ESLint (`lint:fix` to auto-fix)             |
| `npm run format:check`  | Prettier check (`format` to write)          |
| `npm run build`         | Type-check and production build to `dist/`  |

## Docker

Production image (multi-stage build, served by unprivileged nginx on port 8080 with security
headers and a strict Content-Security-Policy):

```bash
docker build -t myfrontvue .
docker run --rm -p 127.0.0.1:8080:8080 myfrontvue
```

If you point the build at another API (`--build-arg VITE_API_URL=...`), also add that origin to
`connect-src` in [`nginx.conf`](nginx.conf).

Development with hot reload:

```bash
docker compose up
```

The compose file publishes the dev server on `127.0.0.1` only, so it is not reachable from
other machines on your network.

## License

[MIT](LICENSE)
