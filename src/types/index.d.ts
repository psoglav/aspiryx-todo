export type Task = {
  id: string
  text: string
  completed: boolean
  isFavorite: boolean
  listId?: string
}

export type List = {
  id: string
  name: string
}