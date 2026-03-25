import { expect, test } from '@playwright/test'

test.describe('reference section navigation', () => {
  test('navigates from the topics index into the populated starter group', async ({ page }) => {
    await page.goto('/topics')

    await page.getByRole('link', { name: /Thinking & Decisions/i }).click()

    await expect(page).toHaveURL(/\/topics\/thinking$/)
    await expect(page.getByRole('heading', { name: 'Thinking & Decisions' })).toBeVisible()
    await expect(page.getByRole('link', { name: /Customize the template after the first clone/ })).toBeVisible()
  })

  test('navigates from the concepts index to the starter concept page', async ({ page }) => {
    await page.goto('/concepts')

    await page.getByRole('link', { name: /Content contract/ }).click()

    await expect(page).toHaveURL(/\/concepts\/content-contract$/)
    await expect(page.getByRole('heading', { name: 'Content contract' })).toBeVisible()
  })

  test('navigates from the glossary index to the starter glossary term', async ({ page }) => {
    await page.goto('/glossary')

    await page.getByRole('link', { name: /Section manifest/ }).click()

    await expect(page).toHaveURL(/\/glossary\/section-manifest$/)
    await expect(page.getByRole('heading', { name: 'Section manifest' })).toBeVisible()
  })
})
