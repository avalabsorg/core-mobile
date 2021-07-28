import React, {useEffect, useState} from 'react'
import {Appearance, Image, StyleSheet, View} from 'react-native'
import TextTitle from "../common/TextTitle"
import ButtonAva from "../common/ButtonAva"
import TextLabel from "../common/TextLabel"
import OnboardViewModel, {
  MnemonicLoaded,
  NothingToLoad,
  PrivateKeyLoaded,
  WalletLoadingResults
} from "./OnboardViewModel"
import {Subscription} from "rxjs"
import CommonViewModel from "../CommonViewModel"
import ButtonAvaTextual from "../common/ButtonAvaTextual"

type Props = {
  onCreateWallet: () => void,
  onAlreadyHaveWallet: () => void,
  onEnterWallet: (mnemonic: string) => void,
  onEnterSingletonWallet: (privateKey: string) => void,
}

const pkg = require('../../package.json')

export default function Onboard(props: Props | Readonly<Props>) {
  const [commonViewModel] = useState(new CommonViewModel(Appearance.getColorScheme()))
  const [viewModel] = useState(new OnboardViewModel())
  const [showButtons, setShowButtons] = useState(false)

  useEffect(() => {
    const disposables = new Subscription()
    disposables.add(viewModel.showButtons.subscribe(value => setShowButtons(value)))
    viewModel.promptForWalletLoadingIfExists().subscribe({
      next: (value: WalletLoadingResults) => {
        if (value instanceof MnemonicLoaded) {
          props.onEnterWallet(value.mnemonic)
        } else if (value instanceof PrivateKeyLoaded) {
          props.onEnterSingletonWallet(value.privateKey)
        } else if (value instanceof NothingToLoad) {
          //do nothing
        }
      },
      error: err => console.log(err.message)
    })
    return () => {
      disposables.unsubscribe()
    }
  }, [])

  const onCreateWallet = (): void => {
    props.onCreateWallet()
  }

  const onAlreadyHaveWallet = (): void => {
    props.onAlreadyHaveWallet()
  }

  const logo = commonViewModel.isDarkMode ? require("../assets/ava_logo_dark.png") : require("../assets/ava_logo_light.png")
  // const loginRecoveryIcon = commonViewModel.isDarkMode ? require("../assets/icons/login_recovery_dark.png") : require("../assets/icons/login_recovery_dark.png") //fixme:  replace with light when its designed
  // const loginPrivateKey = commonViewModel.isDarkMode ? require("../assets/icons/private_key_dark.png") : require("../assets/icons/private_key_dark.png") //fixme:  replace with light when its designed
  // const loginKeystoreFile = commonViewModel.isDarkMode ? require("../assets/icons/keystore_dark.png") : require("../assets/icons/keystore_dark.png") //fixme:  replace with light when its designed

  // const buttonWithText = (icon: any, text: string, onPress: () => void) => {
  //   return (
  //     <View style={styles.buttonWithText}>
  //       <View>
  //         <ImgButtonAva src={icon} onPress={onPress} width={68} height={68}/>
  //       </View>
  //       <View style={[{width: 68}]}>
  //         <TextLabel text={text} multiline/>
  //       </View>
  //     </View>
  //   )
  // }

  return (
    <View style={styles.verticalLayout}>
      <View style={styles.logoContainer}>
        <Image
          accessibilityRole="image"
          source={logo}
          style={styles.logo}/>
        <View style={[{height: 18}]}/>
        <TextTitle text={"Wallet"} textAlign={"center"} bold={true} size={36}/>
        <View style={[{height: 8}]}/>
        <TextTitle text={"Your simple and secure crypto wallet"} textAlign={"center"} size={16}/>
      </View>

      {/*{showButtons && <View style={styles.roundButtons}>*/}
      {/*  {buttonWithText(loginRecoveryIcon, "Recovery Phrase", onLoginWithMnemonic)}*/}
      {/*  {buttonWithText(loginPrivateKey, "Private Key", onLoginWithPrivateKey)}*/}
      {/*  {buttonWithText(loginKeystoreFile, "Keystore File", onLoginWithKeystoreFile)}*/}
      {/*</View>}*/}

      {showButtons && <ButtonAvaTextual text={"I already have a wallet"} onPress={() => onAlreadyHaveWallet()}/>}
      {showButtons && <ButtonAva text={"Create new wallet"} onPress={() => onCreateWallet()}/>}
      <TextLabel text={"v" + pkg.version + " Fuji network"}/>
    </View>
  )
}


const styles = StyleSheet.create({
    roundButtons: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
      marginBottom: 52 - 8,
    },
    verticalLayout: {
      height: "100%",
      justifyContent: "flex-end",
    },
    buttonWithText: {
      alignItems: "center",
    },
    logoContainer: {
      flexGrow: 1,
      justifyContent: "center"
    },
    logo: {
      marginTop: 0,
      height: 50,
      width: "100%",
      resizeMode: 'contain',
    },
  }
)
