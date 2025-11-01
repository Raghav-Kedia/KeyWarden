export interface Field {
  name: string
  value: string
  masked: boolean
}

export interface ApiKey {
  id: string
  fields: Field[]
  createdAt: Date
  // lastUsed and status removed
}

export interface GlobalField {
  id: string
  name: string
}
