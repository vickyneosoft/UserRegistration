import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { AddUserPayload } from '../../types'

function* idMaker() {
    let index = 0;
    while (true) {
        yield index++;
    }
}

const generateUniqueId = idMaker();

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
        registerNewUser: (state, action: PayloadAction<AddUserPayload>) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            const nextID = "USER_" + generateUniqueId.next().value
            state.data = [{ id: nextID, ...action.payload }, ...state.data]
        },
    },
})

// Action creators are generated for each case reducer function
export const { registerNewUser } = usersSlice.actions

export default usersSlice.reducer