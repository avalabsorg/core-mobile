/* eslint-disable @typescript-eslint/no-explicit-any */
import { readdir } from 'fs/promises'
require('ts-node').register()
// import * as fs from 'fs'
// import path from 'path'

export const getDirectories = async (source: any) =>
  (await readdir(source, { withFileTypes: true }))
    .filter((dirent: { isDirectory: () => any }) => dirent.isDirectory())
    .map((dirent: { name: any }) => dirent.name)

export default async function getTestLogs() {
  const folders: any = await getDirectories('./e2e/artifacts/')
  const testResults: any = []

  for (let i = 0; i < folders.length; i++) {
    const nonSplitFolders = await getDirectories(
      `./e2e/artifacts/${folders[i]}`
    )
    const splitFolder: any = nonSplitFolders[0]?.split('.')
    const platform = splitFolder
      ? splitFolder[0]
      : console.log('Why is there not splitfolder? ' + nonSplitFolders)

    if (splitFolder) {
      const resultFolders: any = await getDirectories(
        `./e2e/artifacts/${folders[i]}`
      )

      const parsedResultFolder = resultFolders[resultFolders.length - 1]
      const attachmentFolders = await getDirectories(
        `./e2e/artifacts/${folders[i]}/${parsedResultFolder}`
      )
      for (const result of attachmentFolders) {
        const splitTestFolder = await splitTestResult(result)
        if (result?.includes('✓')) {
          const testResult = 'passed'
          if (splitTestFolder) {
            Object.assign(splitTestFolder, {
              testResult: testResult,
              platform: platform
            })
            testResults.push(splitTestFolder)
          }
        } else if (result?.includes('✗')) {
          const testResult = 'failed'
          if (splitTestFolder) {
            Object.assign(splitTestFolder, {
              testResult: testResult,
              platform: platform,
              failedScreenshot: `${parsedResultFolder}/${result}/testDone.png`
            })
            testResults.push(splitTestFolder)
          }
        }
      }
    } else {
      console.log(
        'There may not be a folder for android or ios yet. Dont worry about this!'
      )
    }
  }
  return testResults
}

export const getScreenshotOnFailure = async (imagePath: string) => {
  const failedTestFolders = await getDirectories(imagePath)
  const testFolder = failedTestFolders[0]
  const firstFailedTestFolder = await getDirectories(
    `${imagePath}/${testFolder}`
  )
  for (let i = 0; i < firstFailedTestFolder.length; i++) {
    if (firstFailedTestFolder[i]?.includes('✗')) {
      const filePath = `./e2e/artifacts/${testFolder}/${firstFailedTestFolder[i]}`
      return `${filePath}/testDone.png`
    }
  }
}

async function splitTestResult(testItem: string | undefined) {
  const shouldTxt = 'should'
  const regEscape = (v: string) => v.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
  const splitTestArrayItem = testItem?.split(
    new RegExp(regEscape(shouldTxt), 'ig')
  )
  //const splitTestArrayItem = testItem?.split('should')
  if (splitTestArrayItem) {
    const rawSectionName = splitTestArrayItem[0]
    const testCase = 'Should' + splitTestArrayItem[1]
    const sectionName = removeTestSectionExtraChars(rawSectionName)
    const trimmedSectionName = sectionName?.trim()
    return { sectionName: trimmedSectionName, testCase }
  }
}

function removeTestSectionExtraChars(testSection: string | undefined) {
  if (testSection) {
    const splitTestSection = testSection.split(' ')
    const rejoinedString = splitTestSection.slice(1).join(' ')
    return rejoinedString
  } else {
    console.log('Test section is undefined, something went wrong!!!')
  }
}

export async function isResultPresent(platform: any) {
  try {
    const resultsFolder = await getDirectories(`./e2e/artifacts/${platform}`)
    if (resultsFolder.length > 0) {
      return true
    } else {
      console.log(
        `No results were found for ${platform} so not sending anything to testrail...`
      )
      return false
    }
  } catch (error) {
    console.log(
      `No results folder found for ${platform} so nothing the send to testrail...`
    )
    return false
  }
}

export async function isSmokeTestRun(platform: any) {
  try {
    const parsedTestRunName = await parseTestRun(platform)
    if (parsedTestRunName.includes('smoke')) {
      console.log('Its a smoke test run!!!')
      return true
    } else {
      console.log('Its a regression run!!!')
      return false
    }
  } catch (error) {
    console.log(
      `No ${platform} folder found so not sending any results to testrail!!!`
    )
    return false
  }
}

export const testRunTimestamp = async (platform: any) => {
  const testRunFolder = await parseTestRun(platform)
  return testRunFolder[4]
}

export async function parseTestRun(platform: any) {
  const folders: any = await getDirectories(`./e2e/artifacts/${platform}`)
  const parsedTestRunName = folders[folders.length - 1].split('.')
  return parsedTestRunName
}
