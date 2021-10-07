enum Stacks {
  App = 'App',
  Auth = 'Auth',
  CreateWallet = 'CreateWallet',
  Wallet = 'Wallet',
}

enum WalletScreens {
  PortfolioScreen = 'PortfolioScreen',
  SearchScreen = 'SearchScreen',
  CurrencySelector = 'CurrencySelector',
}

enum Tabs {
  Portfolio = 'Portfolio',
  Activity = 'Activity',
  Swap = 'Swap',
  More = 'More',
  Watchlist = 'Watchlist',
  Tabs = 'Tabs',
}

enum ModalScreens {
  SendReceiveBottomSheet = 'SendReceiveBottomSheet',
  AccountBottomSheet = 'AccountBottomSheet',
  TransactionDetailBottomSheet = 'TransactionDetailBottomSheet',
}

export enum OnboardScreens {
  Onboard = 'Onboard',
  CreateWalletFlow = 'Create Wallet flow',
  LoginWithMnemonic = 'Login with mnemonic',
  Login = 'Login',
}

enum CreateWalletNavigationScreens {
  CreateWallet = 'Create Wallet',
  CheckMnemonic = 'Check mnemonic',
  CreatePin = 'Create pin',
  BiometricLogin = 'Biometric login',
}

enum SendTokenScreens {
  SendTokenScreen = 'SendTokenScreen',
  ConfirmTransactionScreen = 'ConfirmTransactionScreen',
  DoneScreen = 'DoneScreen',
}

const AppNavigation = {
  Stack: Stacks,
  Wallet: WalletScreens,
  Tabs: Tabs,
  Onboard: OnboardScreens,
  CreateWallet: CreateWalletNavigationScreens,
  Modal: ModalScreens,
  SendToken: SendTokenScreens,
};

export default AppNavigation;