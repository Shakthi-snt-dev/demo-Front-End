// Shared types for FlowTap

export type User = {
  id: string
  email: string
  username: string
  avatar?: string
  role: string
  storeId?: string
}

export type SignupData = {
  email: string
  password: string
  username: string
}

