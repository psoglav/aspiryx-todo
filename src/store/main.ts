import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid'

import type { Task } from '@/types'
import { saveItem, loadItem } from '@/helpers/localStorage'

export interface MainState {
  tasks: Task[]
  editedTaskId: string | null
  editSheetOpened: boolean
}

const initialState: MainState = {
  tasks: loadItem('tasks') || [],
  editedTaskId: null,
  editSheetOpened: false,
}

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Pick<Task, 'text'>>) => {
      state.tasks.unshift({
        ...action.payload,
        id: nanoid(),
        completed: false,
        isFavorite: false,
      })
      saveItem('tasks', state.tasks)
    },
    setEditedTaskId(state, action: PayloadAction<string | null>) {
      state.editedTaskId = action.payload
      state.editSheetOpened = Boolean(action.payload)
    },
    removeTask: (state, action: PayloadAction<string>) => {
      const index = state.tasks.findIndex(item => item.id === action.payload)
      state.tasks.splice(index, 1)
      saveItem('tasks', state.tasks)
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(item => item.id === action.payload.id)
      state.tasks.splice(index, 1, {
        ...action.payload
      })
      saveItem('tasks', state.tasks)
    },
  },
})

export const { addTask, removeTask, updateTask, setEditedTaskId } = mainSlice.actions

export default mainSlice.reducer