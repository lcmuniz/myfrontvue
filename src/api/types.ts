/** Domain models returned by the API (shape of https://jsonplaceholder.typicode.com). */

export interface Address {
  street: string
  suite: string
  city: string
  zipcode: string
}

export interface Company {
  name: string
  catchPhrase: string
  bs: string
}

export interface User {
  id: number
  name: string
  username: string
  email: string
  phone?: string
  website?: string
  address?: Address
  company?: Company
}

export type NewUser = Omit<User, 'id'>

export interface Post {
  id: number
  userId: number
  title: string
  body: string
}
