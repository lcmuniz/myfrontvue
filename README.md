# Vue + Vite — API Layer Example (Users)

Este projeto é um **exemplo de arquitetura Vue 3 + Vite** com uma **camada de API organizada**, usando a variável de ambiente `VITE_API_URL` para comunicação com uma **API externa**.

O objetivo é demonstrar **boas práticas** de:
- Separação de responsabilidades
- Centralização de chamadas HTTP
- Uso de variáveis de ambiente
- Escalabilidade para projetos reais

---

## 🧱 Arquitetura

```
src/
├── api/
│   ├── http.js
│   ├── users.api.js
│   ├── auth.api.js
│   └── index.js
│
├── views/
│   └── UsersView.vue
│
├── App.vue
├── main.js
└── vite.config.js
```

---

## 🔐 Variáveis de Ambiente

### `.env`
```env
VITE_API_URL=https://api.exemplo.com
```

Uso no código:
```js
import.meta.env.VITE_API_URL
```

---

## 🌐 Cliente HTTP Central

`src/api/http.js`

```js
import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default http
```

---

## 👤 Users API

`src/api/users.api.js`

```js
import http from './http'

export function getUsers() {
  return http.get('/users')
}

export function getUserById(id) {
  return http.get(`/users/${id}`)
}

export function createUser(payload) {
  return http.post('/users', payload)
}
```

---

## 📦 Barrel File

`src/api/index.js`

```js
export { default as http } from './http'
export * from './users.api'
export * from './auth.api'
```

---

## 🖥️ Consumindo na View

`src/views/UsersView.vue`

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { getUsers } from '@/api'

const users = ref([])

onMounted(async () => {
  const { data } = await getUsers()
  users.value = data
})
</script>
```

---

## 🚀 Rodando o Projeto

```bash
npm install
npm run dev
```

Acesse:
http://localhost:5173

---

## 📄 Licença

Exemplo educacional.
