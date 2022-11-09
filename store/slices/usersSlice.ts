import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface UsersState {
    data: any[]
}

const initialState: UsersState = {
    data: [],
}

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        registerNewUser: (state, action: PayloadAction<number>) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            // state.value += action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { registerNewUser } = usersSlice.actions

export default usersSlice.reducer