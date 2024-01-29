import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid'

import type { Task, List } from '@/types'
import { saveItem, loadItem } from '@/helpers/localStorage'

export interface MainState {
  lists: List[]
  tasks: Task[]
  editedTaskId: string | null
  editSheetOpened: boolean
}

const initialState: MainState = {
  lists: loadItem('lists') || [],
  tasks: loadItem('tasks') || [],
  editedTaskId: null,
  editSheetOpened: false,
}

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    createTask: (state, action: PayloadAction<Pick<Task, 'text' | 'listId'>>) => {
      state.tasks.unshift({
        ...action.payload,
        id: nanoid(),
        completed: false,
        isImportant: false,
      })
      saveItem('tasks', state.tasks)
    },
    setEditedTaskId(state, action: PayloadAction<string | null>) {
      state.editedTaskId = action.payload
      state.editSheetOpened = Boolean(action.payload)
    },
    deleteTaskById: (state, action: PayloadAction<string>) => {
      const index = state.tasks.findIndex(item => item.id === action.payload)
      state.tasks.splice(index, 1)
      saveItem('tasks', state.tasks)
    },
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload
      saveItem('tasks', action.payload)
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(item => item.id === action.payload.id)
      state.tasks.splice(index, 1, {
        ...action.payload
      })
      saveItem('tasks', state.tasks)
    },
    createList: (state, action: PayloadAction<Pick<List, 'name'>>) => {
      state.lists.push({
        ...action.payload,
        id: nanoid(),
      })
      saveItem('lists', state.lists)
    },
    updateList: (state, action: PayloadAction<List>) => {
      const index = state.lists.findIndex(item => item.id === action.payload.id)
      state.lists.splice(index, 1, {
        ...action.payload
      })
      saveItem('lists', state.lists)
    },
    deleteListById: (state, action: PayloadAction<string>) => {
      const index = state.lists.findIndex(item => item.id === action.payload)
      if (index === -1) return;
      state.lists.splice(index, 1)
      saveItem('lists', state.lists)
      saveItem('tasks', state.tasks.filter(item => item.listId !== action.payload))
    },
    setLists: (state, action: PayloadAction<List[]>) => {
      state.lists = action.payload
      saveItem('lists', action.payload)
    },
  },
})

export const {
  createTask,
  deleteTaskById,
  updateTask,
  setEditedTaskId,
  createList,
  deleteListById,
  setTasks,
  setLists,
  updateList
} = mainSlice.actions

export default mainSlice.reducer