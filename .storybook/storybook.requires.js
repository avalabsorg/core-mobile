/* do not change this file, it is auto generated by storybook. */

import {
  configure,
  addDecorator,
  addParameters,
  addArgsEnhancer,
  clearDecorators
} from '@storybook/react-native'

global.STORIES = [
  {
    titlePrefix: '',
    directory: './storybook/stories',
    files: '**/*.stories.?(ts|tsx|js|jsx)',
    importPathMatcher:
      '^\\.[\\\\/](?:storybook\\/stories(?:\\/(?!\\.)(?:(?:(?!(?:^|\\/)\\.).)*?)\\/|\\/|$)(?!\\.)(?=.)[^/]*?\\.stories\\.(?:ts|tsx|js|jsx)?)$'
  }
]

import '@storybook/addon-ondevice-controls/register'
import '@storybook/addon-ondevice-actions/register'
import '@storybook/addon-ondevice-backgrounds/register'

import { argsEnhancers } from '@storybook/addon-actions/dist/modern/preset/addArgs'

import { decorators, parameters } from './preview'

if (decorators) {
  if (__DEV__) {
    // stops the warning from showing on every HMR
    require('react-native').LogBox.ignoreLogs([
      '`clearDecorators` is deprecated and will be removed in Storybook 7.0'
    ])
  }
  // workaround for global decorators getting infinitely applied on HMR, see https://github.com/storybookjs/react-native/issues/185
  clearDecorators()
  decorators.forEach(decorator => addDecorator(decorator))
}

if (parameters) {
  addParameters(parameters)
}

try {
  argsEnhancers.forEach(enhancer => addArgsEnhancer(enhancer))
} catch {}

const getStories = () => {
  return {
    './storybook/stories/AvaListItem.stories.tsx': require('../storybook/stories/AvaListItem.stories.tsx'),
    './storybook/stories/AvaText.stories.tsx': require('../storybook/stories/AvaText.stories.tsx'),
    './storybook/stories/CalendarInput.stories.tsx': require('../storybook/stories/CalendarInput.stories.tsx'),
    './storybook/stories/ConfirmationTracker.stories.tsx': require('../storybook/stories/ConfirmationTracker.stories.tsx'),
    './storybook/stories/Earn.stories.tsx': require('../storybook/stories/Earn.stories.tsx'),
    './storybook/stories/FeeSelector.stories.tsx': require('../storybook/stories/FeeSelector.stories.tsx'),
    './storybook/stories/RadioButton.stories.tsx': require('../storybook/stories/RadioButton.stories.tsx'),
    './storybook/stories/Lotties.stories.tsx': require('../storybook/stories/Lotties.stories.tsx')
  }
}

configure(getStories, module, false)