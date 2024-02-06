export type Task = {
  id: string
  text: string
  completed: boolean
  isImportant: boolean
  listId?: string
}

export type ListStyle = 'aura' | 'pearl' | 'swamp' | 'black-swan'

export type List = {
  id: string
  name: string
  style?: string
}