import { ActionCreatorWithPayload, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'

import { AddUserPayload, UserPayload } from '../../types'
import { UnknownAsyncThunkRejectedAction } from '@reduxjs/toolkit/dist/matchers'
import constants from '../../constants'
import { RootState } from '..'
import { BaseThunkAPI } from '@reduxjs/toolkit/dist/createAsyncThunk'

export interface UsersState {
    isLoading: boolean
    registerUserSuccess: boolean
    registerUserFailure: boolean
    data: any[]
    error: any
    lastDocSnap: any
}

const initialState: UsersState = {
    isLoading: false,
    data: [],
    error: null,
    registerUserSuccess: false,
    registerUserFailure: false,
}

export const createAuthUserThunk = createAsyncThunk<UserPayload, AddUserPayload>(
    'createAuthUserThunk',
    async (payload) => {
        const {
            email,
            password,
            profilePhoto,
            dob,
            firstName,
            gender,
            lastName,
            mobileNumber,
            qualification
        } = payload

        const registerUserRes = await auth()
            .createUserWithEmailAndPassword(email, password)

        const fileExtension = profilePhoto.substring(profilePhoto.lastIndexOf('.'))

        const path = `users/${registerUserRes.user.uid}.${fileExtension}`;
        const ref = storage().ref(path);
        await ref.putFile(profilePhoto, {
            cacheControl: 'no-store', // disable caching
        });

        const downloadUrl = await storage().ref(path).getDownloadURL()

        const newUserObj: UserPayload = {
            id: registerUserRes.user.uid,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email,
            gender: gender,
            profilePhoto: downloadUrl,
            mobileNumber: mobileNumber,
            qualification,
            dob: dob,
        }

        await firestore()
            .collection(constants.FIREBASE_USERS_COLLECTION)
            .doc(registerUserRes.user.uid)
            .set(newUserObj)

        return newUserObj
    }
)

export const getUsersThunk = createAsyncThunk(
    'getUsersThunk',
    async (arg, thunkAPI) => {
        const usersRes = await firestore()
            .collection(constants.FIREBASE_USERS_COLLECTION)
            .get();

        return usersRes.docs.map(doc => doc.data())

    }
)

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        resetFlags: (state) => {
            state.isLoading = false
            state.registerUserSuccess = false
            state.registerUserFailure = false
            state.error = ''
        }
    },
    extraReducers(builder) {
        /**
         * Get users
         */
        builder.addCase(getUsersThunk.pending, (state, _action) => {
            state.isLoading = true
        })
        builder.addCase(getUsersThunk.fulfilled, (state, action) => {
            const { payload } = action
            state.isLoading = false
            state.data = payload
        })
        builder.addCase(getUsersThunk.rejected, (state, action: UnknownAsyncThunkRejectedAction) => {
            state.isLoading = false
            state.error = action.error.message
        })


        /**
         * Create User
         */
        builder.addCase(createAuthUserThunk.pending, (state, _action) => {
            state.registerUserFailure = false
            state.registerUserSuccess = false
            state.isLoading = true
        })
        builder.addCase(createAuthUserThunk.fulfilled, (state, action) => {
            const { payload } = action
            state.isLoading = false
            state.registerUserSuccess = true
            state.data = [payload, ...state.data]
        })
        builder.addCase(createAuthUserThunk.rejected, (state, action: UnknownAsyncThunkRejectedAction) => {
            state.isLoading = false
            state.registerUserFailure = true
            state.error = action.error.message
        })
        builder.addDefaultCase((state, _action) => {
            state.isLoading = false
            state.registerUserFailure = false
            state.registerUserSuccess = false
            state.error = ''
        })
    },
})

// Action creators are generated for each case reducer function
export const { resetFlags } = usersSlice.actions

export default usersSlice.reducer