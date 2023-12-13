import { createAsyncThunk } from '@reduxjs/toolkit'
import { ThunkApi } from 'store'
import { selectIsDeveloperMode } from 'store/settings/advanced/slice'
import AccountsService from 'services/account/AccountsService'
import {
  reducerName,
  selectAccounts,
  setAccount,
  setActiveAccountIndex
} from './slice'

export const addAccount = createAsyncThunk<void, void, ThunkApi>(
  `${reducerName}/addAccount`,
  async (_, thunkApi) => {
    const state = thunkApi.getState()
    const isDeveloperMode = selectIsDeveloperMode(state)

    const accounts = selectAccounts(state)
    const accIndex = Object.keys(accounts).length
    const acc = await AccountsService.createNextAccount(
      isDeveloperMode,
      accIndex
    )

    thunkApi.dispatch(setAccount(acc))

    // update active account index
    thunkApi.dispatch(setActiveAccountIndex(acc.index))
  }
)