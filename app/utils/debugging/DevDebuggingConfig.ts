// Do not commit changes to this file.
// Run the following command git command to ignore changes made to this file.
// git update-index --assume-unchanged app/utils/debugging/DevDebuggingConfig.ts

const DevDebuggingConfig = {
  SPLASH_ENABLED: !__DEV__,
  STORYBOOK_ENABLED: false,
  LOGBOX_DISABLED: false,
  REDSCREEN_DISABLED: false,
  LOGBOX_IGNORED_WARNINGS: []
}

export default DevDebuggingConfig
