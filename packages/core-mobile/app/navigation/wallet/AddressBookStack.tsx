import AppNavigation from 'navigation/AppNavigation'
import {
  createStackNavigator,
  StackNavigationOptions
} from '@react-navigation/stack'
import React, { useCallback, useEffect } from 'react'
import AddressBook from 'screens/drawer/addressBook/AddressBook'
import { MainHeaderOptions } from 'navigation/NavUtils'
import { useNavigation, useRoute } from '@react-navigation/native'
import AvaButton from 'components/AvaButton'
import AddSVG from 'components/svg/AddSVG'
import AddContact from 'screens/drawer/addressBook/AddContact'
import ContactDetails from 'screens/drawer/addressBook/ContactDetails'
import AvaText from 'components/AvaText'
import { useApplicationContext } from 'contexts/ApplicationContext'
import { useDispatch, useSelector } from 'react-redux'
import {
  removeContact,
  saveEditingContact,
  selectContact,
  selectEditingContact,
  setEditingContact
} from 'store/addressBook'
import WarningModal from 'components/WarningModal'
import {
  getContactValidationError,
  shareContact
} from 'screens/drawer/addressBook/utils'
import ContactShareModal from 'screens/drawer/addressBook/components/ContactShareModal'
import { showSnackBarCustom } from 'components/Snackbar'
import GeneralToast from 'components/toast/GeneralToast'
import { NameAndAddresses } from 'screens/drawer/addressBook/types'
import { Contact } from '@avalabs/types'
import { AddressBookScreenProps } from '../types'

export type AddressBookStackParamList = {
  [AppNavigation.AddressBook.List]: undefined
  [AppNavigation.AddressBook.Add]: undefined
  [AppNavigation.AddressBook.Details]: {
    contactId: string
    editable: boolean
    isContactValid?: boolean
  }
  [AppNavigation.AddressBook.DeleteConfirm]: { contactId: string }
  [AppNavigation.AddressBook.Share]: { contactId: string }
}
const Stack = createStackNavigator<AddressBookStackParamList>()

const AddressBookStack = (): JSX.Element => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen
        options={{
          headerShown: true,
          ...(MainHeaderOptions({
            title: 'Address Book',
            hideHeaderLeft: false,
            actionComponent: <AddAddressBookContact />
          }) as Partial<StackNavigationOptions>)
        }}
        name={AppNavigation.AddressBook.List}
        component={AddressBook}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          ...(MainHeaderOptions() as Partial<StackNavigationOptions>)
        }}
        name={AppNavigation.AddressBook.Add}
        component={AddContact}
      />
      <Stack.Screen
        options={{
          headerShown: true
        }}
        name={AppNavigation.AddressBook.Details}
        component={ContactDetailsComp}
      />
      <Stack.Screen
        options={{ presentation: 'transparentModal', headerShown: false }}
        name={AppNavigation.AddressBook.DeleteConfirm}
        component={DeleteConfirmModal}
      />
      <Stack.Screen
        options={{ presentation: 'transparentModal', headerShown: false }}
        name={AppNavigation.AddressBook.Share}
        component={ShareContactModal}
      />
    </Stack.Navigator>
  )
}

type ContactDetailsScreenProps = AddressBookScreenProps<
  typeof AppNavigation.AddressBook.Details
>

const ContactDetailsComp = (): JSX.Element => {
  const dispatch = useDispatch()
  const { setParams, setOptions, navigate, push } =
    useNavigation<ContactDetailsScreenProps['navigation']>()

  const { params } = useRoute<ContactDetailsScreenProps['route']>()
  const editable = params?.editable ?? false
  const isContactValid = params?.isContactValid ?? false
  const contact = useSelector(selectContact(params.contactId))
  const editingContact = useSelector(selectEditingContact)

  useEffect(() => {
    const err = getContactValidationError({
      name: editingContact?.name,
      cChainAddress: editingContact?.address,
      xpChainAddress: editingContact?.addressXP,
      btcAddress: editingContact?.addressBTC
    })
    setParams({ editable, isContactValid: err === undefined })
  }, [
    editable,
    editingContact?.address,
    editingContact?.addressBTC,
    editingContact?.addressXP,
    editingContact?.name,
    setParams
  ])

  useEffect(() => {
    setParams({ editable: false, isContactValid })
    setOptions({
      ...(MainHeaderOptions({
        title: '',
        hideHeaderLeft: false,
        actionComponent: <EditAddressBookContact onEdit={onEdit} />
      }) as Partial<StackNavigationOptions>)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    dispatch(
      setEditingContact(contact ? Object.assign({}, contact) : undefined)
    )

    return () => {
      dispatch(setEditingContact(undefined))
    }
  }, [contact, dispatch])

  function saveContact(): void {
    dispatch(saveEditingContact())
    setParams({ editable: false, isContactValid })
    setOptions({
      ...(MainHeaderOptions({
        title: '',
        hideHeaderLeft: false,
        actionComponent: <EditAddressBookContact onEdit={onEdit} />
      }) as Partial<StackNavigationOptions>)
    })
  }

  function onEdit(): void {
    setParams({ editable: true, isContactValid })
    setOptions({
      ...(MainHeaderOptions({
        title: '',
        hideHeaderLeft: false,
        actionComponent: <SaveAddressBookContact onSave={saveContact} />
      }) as Partial<StackNavigationOptions>)
    })
  }

  const deleteContact = useCallback(
    ({ id }: Contact) => {
      navigate(AppNavigation.AddressBook.DeleteConfirm, { contactId: id })
    },
    [navigate]
  )

  const showShareDialog = useCallback(
    ({ id }: Contact) => {
      push(AppNavigation.AddressBook.Share, { contactId: id })
    },
    [push]
  )

  const onChange = useCallback(
    (c: Contact) => {
      dispatch(setEditingContact(c))
    },
    [dispatch]
  )

  return (
    <ContactDetails
      editable={editable}
      contact={
        editingContact ??
        ({ id: '', name: '', address: '', addressBTC: '' } as Contact)
      }
      onChange={onChange}
      onDelete={deleteContact}
      onShareDialog={showShareDialog}
    />
  )
}

type AddContactNavigationProp = AddressBookScreenProps<
  typeof AppNavigation.AddressBook.List
>['navigation']

const AddAddressBookContact = (): JSX.Element => {
  const { navigate } = useNavigation<AddContactNavigationProp>()
  return (
    <AvaButton.Icon onPress={() => navigate(AppNavigation.AddressBook.Add)}>
      <AddSVG hideCircle size={38} />
    </AvaButton.Icon>
  )
}

const EditAddressBookContact = ({
  onEdit
}: {
  onEdit: () => void
}): JSX.Element => {
  const { theme } = useApplicationContext()

  return (
    <AvaButton.Icon onPress={() => onEdit()}>
      <AvaText.ButtonLarge textStyle={{ color: theme.colorPrimary1 }}>
        Edit
      </AvaText.ButtonLarge>
    </AvaButton.Icon>
  )
}

const SaveAddressBookContact = ({
  onSave
}: {
  onSave: () => void
}): JSX.Element => {
  const { theme } = useApplicationContext()
  const { params } = useRoute<ContactDetailsScreenProps['route']>()
  const isContactValid = params?.isContactValid

  return (
    <AvaButton.Icon disabled={!isContactValid} onPress={() => onSave()}>
      <AvaText.ButtonLarge
        testID="save_btn"
        textStyle={{
          color: isContactValid ? theme.colorPrimary1 : theme.colorDisabled
        }}>
        Save
      </AvaText.ButtonLarge>
    </AvaButton.Icon>
  )
}

type DeleteConfirmModalProps = AddressBookScreenProps<
  typeof AppNavigation.AddressBook.DeleteConfirm
>

const DeleteConfirmModal = (): JSX.Element => {
  const dispatch = useDispatch()
  const { goBack } = useNavigation<DeleteConfirmModalProps['navigation']>()
  const { params } = useRoute<DeleteConfirmModalProps['route']>()

  const onDelete = (): void => {
    dispatch(removeContact(params.contactId))
    goBack() // back to Contact screen
    goBack() // back to Contacts
  }

  const onCancel = (): void => {
    goBack() // back to Contact screen
  }

  return (
    <WarningModal
      title="Delete Contact"
      message="Are you sure you want to delete this contact?"
      actionText="Delete"
      dismissText="Cancel"
      onAction={onDelete}
      onDismiss={onCancel}
      testID="delete-contact-modal"
    />
  )
}

type ShareModalProps = AddressBookScreenProps<
  typeof AppNavigation.AddressBook.Share
>

const ShareContactModal = (): JSX.Element => {
  const { pop } = useNavigation<ShareModalProps['navigation']>()
  const { params } = useRoute<ShareModalProps['route']>()
  const contact = useSelector(selectContact(params.contactId))

  if (!contact) {
    showSnackBarCustom({
      component: (
        <GeneralToast
          message={`Ooops, seems this contact is not available. Please try adding it again.`}
        />
      ),
      duration: 'short'
    })
    pop()
  }

  const onShare = ({
    name,
    cChainAddress,
    xpChainAddress,
    btcAddress
  }: NameAndAddresses): void => {
    shareContact({ name, cChainAddress, xpChainAddress, btcAddress })
  }

  const onCancel = (): void => {
    pop() // back to Contact screen
  }

  return (
    <>
      {contact && (
        <ContactShareModal
          contact={contact}
          onCancel={onCancel}
          onContinue={onShare}
        />
      )}
    </>
  )
}

export default AddressBookStack
