import http from './http'
import type { Post } from './types'

type RequestOptions = { signal?: AbortSignal }

export async function getPosts({ signal }: RequestOptions = {}): Promise<Post[]> {
  const { data } = await http.get<Post[]>('/posts', { signal })
  return data
}

export async function getPostsByUser(
  userId: number,
  { signal }: RequestOptions = {},
): Promise<Post[]> {
  const { data } = await http.get<Post[]>('/posts', { params: { userId }, signal })
  return data
}
