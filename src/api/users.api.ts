import http from './http'
import type { NewUser, User } from './types'

type RequestOptions = { signal?: AbortSignal }

export async function getUsers({ signal }: RequestOptions = {}): Promise<User[]> {
  const { data } = await http.get<User[]>('/users', { signal })
  return data
}

export async function getUserById(id: number, { signal }: RequestOptions = {}): Promise<User> {
  const { data } = await http.get<User>(`/users/${encodeURIComponent(id)}`, { signal })
  return data
}

export async function createUser(payload: NewUser): Promise<User> {
  const { data } = await http.post<User>('/users', payload)
  return data
}
