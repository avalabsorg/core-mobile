export type AnalyticsEvents = {
  AccountSelectorOpened: undefined
  AccountSelectorAddAccount: { accountNumber: number }
  AccountSelectorBtcAddressCopied: undefined
  AccountSelectorEthAddressCopied: undefined
  ActivityCardDetailShown: undefined
  ActivityCardLinkClicked: undefined
  AddContactClicked: undefined
  AddContactFailed: undefined
  AddContactSucceeded: undefined
  AlreadyHaveAWalletClicked: undefined
  AnalyticsEnabled: undefined
  AnalyticsDisabled: undefined
  ApplicationLaunched: { FontScale: number }
  ApplicationOpened: undefined
  Bridge_TokenSelected: undefined
  BridgeTokenSelectError: { errorMessage: string }
  BridgeTransferRequestError: {
    sourceBlockchain: string
    targetBlockchain: string
  }
  BridgeTransferRequestSucceeded: undefined
  BridgeTransferRequestUserRejectedError: {
    sourceBlockchain: string
    targetBlockchain: string
    fee: number
  }
  BridgeTransferStarted: { sourceBlockchain: string; targetBlockchain: string }
  BridgeTransactionHide: undefined
  BridgeTransactionHideCancel: undefined
  ChangePasswordClicked: undefined
  ChangePasswordSucceeded: undefined
  ChangePasswordFailed: undefined
  CoinbasePayBuyClicked: undefined
  CollectibleItemClicked: { chainId: string }
  CollectibleSendClicked: { chainId: string }
  ConnectedSitesClicked: undefined
  ConnectedSiteRemoved: {
    walletConnectVersion: string
    url: string
    name: string
  }
  'CreateWallet:WalletNameSet': undefined
  CreatedANewAccountSuccessfully: { walletType: string }
  CurrencySettingChanged: { currency: string }
  CurrencySettingClicked: undefined
  DeveloperModeEnabled: undefined
  DeveloperModeDisabled: undefined
  FABItemSelected_Bridge: undefined
  FABItemSelected_Buy: undefined
  FABItemSelected_Send: undefined
  FABItemSelected_Receive: undefined
  FABItemSelected_Swap: undefined
  FABItemSelected_WalletConnect: undefined
  FABClosed: undefined
  FABOpened: undefined
  HelpCenterClicked: undefined
  LegalClicked: undefined
  'LoginWithMnemonic:WalletNameSet': undefined
  ManageNetworksClicked: undefined
  ManageTokensAddCustomToken: { status: string; address: string }
  MoonpayBuyClicked: undefined
  NetworkDetailsClicked: { chainId: number }
  NetworkFavoriteAdded: { networkChainId: string; isCustom: boolean }
  NetworkFavoriteRemoved: { networkChainId: string; isCustom: boolean }
  NetworkSwitcherOpened: undefined
  NftSendApproved: { selectedGasFee: string }
  NftSendFailed: { errorMessage: string; chainId: number }
  NftSendSucceeded: { chainId: number }
  NftSendContactSelected: { contactSource: string }
  NftSendFeeOptionChanged: { modifier: string }
  'Onboard:WalletNameSet': undefined
  OnboardingAnalyticsAccepted: undefined
  OnboardingAnalyticsRejected: undefined
  OnboardingCancelled: undefined
  OnboardingMnemonicCreated: undefined
  OnboardingMnemonicImported: undefined
  OnboardingMnemonicVerified: undefined
  OnboardingPasswordSet: undefined
  OnboardingSubmitSucceeded: { walletType: string }
  OnboardingSubmitFailed: { walletType: string }
  PortfolioActivityClicked: undefined
  PortfolioAssetsClicked: undefined
  PortfolioCollectiblesClicked: undefined
  PortfolioDeFiClicked: undefined
  PortfolioPrimaryNetworkClicked: { chainId: number }
  PortfolioSecondaryNetworkClicked: { chainId: number }
  PortfolioTokenSelected: { selectedToken: string }
  PrivacyPolicyClicked: undefined
  ReceivePageVisited: undefined
  RecoveryPhraseClicked: undefined
  SendFailed: { errorMessage: string; chainId: number }
  SendApproved: { selectedGasFee: string; chainId: number }
  SendSucceeded: { chainId: number }
  SendCancel: undefined
  SendContactSelected: { contactSource: string }
  SendFeeOptionChanged: { modifier: string }
  Send_TokenSelected: undefined
  sendFeedbackClicked: undefined
  SeedlessAddMfa: { type: string }
  SeedlessMfaAdded: undefined
  SeedlessExportInitiated: undefined
  SeedlessExportInitiateFailed: undefined
  SeedlessExportCompleted: undefined
  SeedlessExportCompleteFailed: undefined
  SeedlessExportCancelled: undefined
  SeedlessExportCancelFailed: undefined
  SeedlessExportPhraseCopied: undefined
  SeedlessExportPhraseHidden: undefined
  SeedlessExportPhraseRevealed: undefined
  SeedlessMfaVerified: { type: string }
  SeedlessLoginFailed: undefined
  SeedlessRegisterTOTPStartFailed: undefined
  SeedlessSignIn: { oidcProvider: number }
  SeedlessSignUp: { oidcProvider: number }
  SignInWithRecoveryPhraseClicked: undefined
  StakeBegin: { from: string }
  StakeCancelClaim: undefined
  StakeCancelStaking: { from: string }
  StakeClaim: undefined
  StakeClaimFail: undefined
  StakeClaimSuccess: undefined
  StakeCountStakes: { active: number; history: number; total: number }
  StakeDelegationSuccess: undefined
  StakeDelegationFail: undefined
  StakeIssueClaim: undefined
  StakeIssueDelegation: undefined
  StakeOpened: undefined
  StakeOpenEnterAmount: undefined
  StakeOpenDurationSelect: undefined
  StakeOpenStakingDisclaimer: undefined
  StakeOpenStakingDocs: { from: string }
  StakeSelectAdvancedStaking: undefined
  StakeStartNodeSearch: { from: string; duration: string }
  StakeUseAmountPercentage: { percent: string }
  SwapCancelled: undefined
  SwapConfirmed: undefined
  SwapReviewOrder: {
    destinationInputField: string
    slippageTolerance: number
    customGasPrice: string
  }
  SwapReviewTimerRestarted: undefined
  Swap_TokenSelected: undefined
  TermsAndConditionsAccepted: undefined
  TermsOfUseClicked: undefined
  TokenListTokenSelected: { selectedToken: string }
  TokenReceiveClicked: { chainId: number }
  TokenSendClicked: { chainId: number }
  TotpValidationFailed: { error: string }
  TotpValidationSuccess: undefined
  WalletConnectSessionApprovedV2: {
    namespaces?: string
    requiredNamespaces: string
    optionalNamespaces?: string
    dappUrl: string
  }
  WalletNameAdded: undefined
}