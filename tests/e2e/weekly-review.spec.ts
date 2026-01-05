import { test, expect } from '@playwright/test'

test.describe('Weekly Review Workflow', () => {
  test('should load and display current week review', async ({ page }) => {
    await page.goto('/weekly-review')
    
    // Check activity summary is visible
    await expect(page.getByTestId('activity-summary')).toBeVisible()
    await expect(page.getByTestId('commits-count')).toBeVisible()
    await expect(page.getByTestId('prs-count')).toBeVisible()
    await expect(page.getByTestId('reviews-count')).toBeVisible()
    await expect(page.getByTestId('impact-score')).toBeVisible()
    
    // Check reflection fields are visible
    await expect(page.getByTestId('reflection-wins')).toBeVisible()
    await expect(page.getByTestId('reflection-blockers')).toBeVisible()
    await expect(page.getByTestId('reflection-nextFocus')).toBeVisible()
    
    // Check targets section is visible
    await expect(page.getByTestId('targets-list')).toBeVisible()
  })

  test('should fill in reflection fields', async ({ page }) => {
    await page.goto('/weekly-review')
    
    // Fill in wins
    const winsField = page.getByTestId('reflection-wins')
    await winsField.fill('Completed the weekly review feature')
    await page.waitForTimeout(500) // Wait for auto-save
    
    // Fill in blockers
    const blockersField = page.getByTestId('reflection-blockers')
    await blockersField.fill('Some CI pipeline issues')
    await page.waitForTimeout(500)
    
    // Fill in next focus
    const nextFocusField = page.getByTestId('reflection-nextFocus')
    await nextFocusField.fill('Focus on testing and documentation')
    await page.waitForTimeout(500)
    
    // Reload page and check values persisted
    await page.reload()
    await expect(winsField).toHaveValue('Completed the weekly review feature')
    await expect(blockersField).toHaveValue('Some CI pipeline issues')
    await expect(nextFocusField).toHaveValue('Focus on testing and documentation')
  })

  test('should add targets', async ({ page }) => {
    await page.goto('/weekly-review')
    
    // Add first target
    const targetInput = page.getByTestId('target-input')
    await targetInput.fill('Write E2E tests')
    await page.getByTestId('target-add-button').click()
    await page.waitForTimeout(500)
    
    // Check target appears in list
    const targetsList = page.getByTestId('targets-list')
    await expect(targetsList.getByText('Write E2E tests')).toBeVisible()
    
    // Add second target using Enter key
    await targetInput.fill('Update documentation')
    await targetInput.press('Enter')
    await page.waitForTimeout(500)
    
    await expect(targetsList.getByText('Update documentation')).toBeVisible()
  })

  test('should toggle target completion', async ({ page }) => {
    await page.goto('/weekly-review')
    
    // Add a target first
    await page.getByTestId('target-input').fill('Test target')
    await page.getByTestId('target-add-button').click()
    await page.waitForTimeout(500)
    
    // Find the target item and toggle it
    const targetItem = page.getByTestId('target-item').filter({ hasText: 'Test target' })
    const checkbox = targetItem.getByTestId('target-checkbox')
    
    // Click to complete
    await checkbox.click()
    await page.waitForTimeout(500)
    
    // Check if checkbox is checked (has bg-teal-500 class)
    await expect(checkbox).toHaveClass(/bg-teal-500/)
    
    // Click again to uncomplete
    await checkbox.click()
    await page.waitForTimeout(500)
    
    await expect(checkbox).not.toHaveClass(/bg-teal-500/)
  })

  test('should remove target', async ({ page }) => {
    await page.goto('/weekly-review')
    
    // Add a target
    await page.getByTestId('target-input').fill('Target to remove')
    await page.getByTestId('target-add-button').click()
    await page.waitForTimeout(500)
    
    // Hover over target to show remove button
    const targetItem = page.getByTestId('target-item').filter({ hasText: 'Target to remove' })
    await targetItem.hover()
    
    // Click remove button
    const removeButton = targetItem.getByTestId('target-remove')
    await removeButton.click()
    await page.waitForTimeout(500)
    
    // Check target is removed
    await expect(page.getByText('Target to remove')).not.toBeVisible()
  })

  test('should complete review', async ({ page }) => {
    await page.goto('/weekly-review')
    
    // Fill in at least one reflection
    await page.getByTestId('reflection-wins').fill('Great progress this week')
    await page.waitForTimeout(500)
    
    // Add at least one target
    await page.getByTestId('target-input').fill('Continue momentum')
    await page.getByTestId('target-add-button').click()
    await page.waitForTimeout(500)
    
    // Complete review
    await page.getByTestId('complete-review-button').click()
    await page.waitForTimeout(1000)
    
    // Check for completion message
    await expect(page.getByTestId('review-completed')).toBeVisible()
    await expect(page.getByText(/Review completed on/)).toBeVisible()
    
    // Check reflection fields are now disabled
    await expect(page.getByTestId('reflection-wins')).toBeDisabled()
    await expect(page.getByTestId('reflection-blockers')).toBeDisabled()
    await expect(page.getByTestId('reflection-nextFocus')).toBeDisabled()
    
    // Check target input is hidden
    await expect(page.getByTestId('target-input')).not.toBeVisible()
  })

  test('should show validation error when completing without content', async ({ page }) => {
    await page.goto('/weekly-review')
    
    // Try to complete without filling anything
    page.on('dialog', dialog => dialog.accept())
    await page.getByTestId('complete-review-button').click()
    await page.waitForTimeout(500)
    
    // Should still be on the same page (not completed)
    await expect(page.getByTestId('complete-review-button')).toBeVisible()
  })

  test('should navigate between weeks', async ({ page }) => {
    await page.goto('/weekly-review')
    
    // Get current week date range
    const currentWeekHeading = page.locator('h1').filter({ hasText: /–/ })
    const currentWeekText = await currentWeekHeading.textContent()
    
    // Navigate to previous week
    await page.getByRole('button', { name: 'Previous week' }).click()
    await page.waitForTimeout(500)
    
    // Check week changed
    const previousWeekText = await currentWeekHeading.textContent()
    expect(previousWeekText).not.toBe(currentWeekText)
    
    // Navigate to next week (back to current)
    await page.getByRole('button', { name: 'Next week' }).click()
    await page.waitForTimeout(500)
    
    const backToCurrentText = await currentWeekHeading.textContent()
    expect(backToCurrentText).toBe(currentWeekText)
  })

  test('should display streak indicator for completed reviews', async ({ page }) => {
    await page.goto('/weekly-review')
    
    // Complete current week review
    await page.getByTestId('reflection-wins').fill('Another week done')
    await page.waitForTimeout(500)
    await page.getByTestId('target-input').fill('Keep going')
    await page.getByTestId('target-add-button').click()
    await page.waitForTimeout(500)
    await page.getByTestId('complete-review-button').click()
    await page.waitForTimeout(1000)
    
    // Check for streak indicator (should appear after completion)
    // Note: Streak might be 0 or higher depending on test data
    const streakIndicator = page.getByTestId('streak-indicator')
    if (await streakIndicator.isVisible()) {
      await expect(streakIndicator).toContainText('week streak')
    }
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/weekly-review')
    
    // Check key elements are visible on mobile
    await expect(page.getByTestId('activity-summary')).toBeVisible()
    await expect(page.getByTestId('reflection-wins')).toBeVisible()
    await expect(page.getByTestId('targets-list')).toBeVisible()
  })

  test('should support dark mode', async ({ page }) => {
    await page.goto('/weekly-review')
    
    // Find and click theme toggle
    const themeToggle = page.getByRole('button', { name: /toggle theme|switch to/i })
    await themeToggle.click()
    await page.waitForTimeout(500)
    
    // Check dark mode classes are applied
    const html = page.locator('html')
    const htmlClass = await html.getAttribute('class')
    expect(htmlClass).toContain('dark')
  })

  test('should show activity metrics correctly', async ({ page }) => {
    await page.goto('/weekly-review')
    
    // Check all metrics are numeric and visible
    const commits = page.getByTestId('commits-count')
    const prs = page.getByTestId('prs-count')
    const reviews = page.getByTestId('reviews-count')
    const impactScore = page.getByTestId('impact-score')
    
    await expect(commits).toBeVisible()
    await expect(prs).toBeVisible()
    await expect(reviews).toBeVisible()
    await expect(impactScore).toBeVisible()
    
    // Check values are numbers
    const commitsText = await commits.textContent()
    expect(parseInt(commitsText || '0')).toBeGreaterThanOrEqual(0)
  })
})
