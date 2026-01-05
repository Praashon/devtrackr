import { test, expect } from '@playwright/test'

test.describe('GitHub Activity Dashboard', () => {
  test('should load and display current week activity', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Check that page loads
    await expect(page).toHaveURL('/dashboard')
    
    // Check week header displays date range (in the main content area, not sidebar)
    const weekHeader = page.locator('.max-w-6xl h1').first()
    await expect(weekHeader).toBeVisible()
    await expect(weekHeader).toContainText(/\w+ \d+–\w+ \d+, \d{4}/)
    
    // Check status badge shows "open" or "closed"
    const statusBadge = page.locator('text=/open|closed/i').first()
    await expect(statusBadge).toBeVisible()
    
    // Check summary metrics are displayed
    await expect(page.getByText('PRs Merged').first()).toBeVisible()
    await expect(page.getByText('Reviews').first()).toBeVisible()
    await expect(page.getByText('Commits').first()).toBeVisible()
    
    // Check that metric values are numbers
    const metricsCards = page.locator('.font-mono.font-semibold').filter({ hasText: /^\d+$/ })
    await expect(metricsCards.first()).toBeVisible()
  })

  test('should navigate to previous and next week', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    // Get current week header text (from main content, not sidebar)
    await page.waitForSelector('.max-w-6xl h1')
    const initialWeekHeader = await page.locator('.max-w-6xl h1').first().textContent()
    
    // Click previous week
    const prevButton = page.getByRole('button', { name: /previous week/i })
    await prevButton.click()
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)
    
    // Check that week header changed
    const prevWeekHeader = await page.locator('.max-w-6xl h1').first().textContent()
    expect(prevWeekHeader).not.toBe(initialWeekHeader)
    
    // Click next week - should advance one week
    const nextButton = page.getByRole('button', { name: /next week/i })
    await nextButton.click()
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)
    
    // Check that week header changed again (different from previous week)
    const finalWeekHeader = await page.locator('.max-w-6xl h1').first().textContent()
    expect(finalWeekHeader).not.toBe(prevWeekHeader)
    
    // Verify navigation buttons still work
    await expect(prevButton).toBeEnabled()
    await expect(nextButton).toBeEnabled()
  })

  test('should display insights section', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Check for insights section
    const insightsHeading = page.locator('text=Week Insights')
    await expect(insightsHeading).toBeVisible()
    
    // Insights section should exist
    await expect(insightsHeading).toBeVisible()
  })

  test('should display daily distribution chart', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Check for chart header
    await expect(page.locator('text=Daily Distribution')).toBeVisible()
    
    // Check for day labels (Mon-Sun)
    await expect(page.locator('text=Mon')).toBeVisible()
    await expect(page.locator('text=Tue')).toBeVisible()
    await expect(page.locator('text=Wed')).toBeVisible()
    await expect(page.locator('text=Thu')).toBeVisible()
    await expect(page.locator('text=Fri')).toBeVisible()
    await expect(page.locator('text=Sat')).toBeVisible()
    await expect(page.locator('text=Sun')).toBeVisible()
  })

  test('should display repository breakdown table', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Check for table header
    await expect(page.locator('text=Repository Breakdown')).toBeVisible()
    
    // Check for table column headers by role
    await expect(page.getByRole('columnheader', { name: 'Repository' })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: 'PRs Merged' })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: 'Reviews' })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: 'Commits' })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: 'Impact' })).toBeVisible()
    
    // Check that at least one repository row exists
    const repoName = page.locator('table .font-mono.text-sm').first()
    await expect(repoName).toBeVisible()
  })

  test('should open drill-down panel when clicking repository', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    // Find and click first repository name in table
    const firstRepoButton = page.locator('table button .font-mono.text-sm').first()
    await firstRepoButton.click()
    await page.waitForTimeout(500)
    
    // Check that drill-down panel opened
    const panel = page.locator('.fixed.inset-y-0.right-0').last()
    await expect(panel).toBeVisible()
    
    // Check for close button
    const closeButton = page.getByRole('button', { name: /close/i }).last()
    await expect(closeButton).toBeVisible()
    
    // Close the panel
    await closeButton.click()
    await page.waitForTimeout(300)
  })

  test('should open repository management modal', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    // Click Manage Repos button
    const manageReposButton = page.getByRole('button', { name: /manage repos/i })
    await manageReposButton.click()
    await page.waitForTimeout(500)
    
    // Check that modal opened
    await expect(page.locator('text=Manage Repositories')).toBeVisible()
    
    // Check for repository list
    const repoItems = page.locator('.font-mono.text-sm.font-medium')
    await expect(repoItems.first()).toBeVisible()
    
    // Check for Done button
    const doneButton = page.getByRole('button', { name: /done/i })
    await expect(doneButton).toBeVisible()
    
    // Close modal
    await doneButton.click()
    await page.waitForTimeout(300)
  })

  test('should toggle repository inclusion', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    // Open repository management modal
    await page.getByRole('button', { name: /manage repos/i }).click()
    await page.waitForTimeout(500)
    
    // Find an included repository button and click to exclude
    const includedButton = page.getByRole('button', { name: /included/i }).first()
    await includedButton.click()
    await page.waitForTimeout(500)
    
    // Button text should change to "Excluded"
    await expect(page.getByRole('button', { name: /excluded/i }).first()).toBeVisible()
    
    // Close modal
    await page.getByRole('button', { name: /done/i }).click()
    await page.waitForTimeout(500)
  })

  test('should toggle show/hide excluded repos', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    // Find the show/hide excluded toggle
    const toggleButton = page.locator('button', { hasText: /show excluded repos|hide excluded repos/i })
    await expect(toggleButton).toBeVisible()
    
    const initialText = await toggleButton.textContent()
    
    // Click to toggle
    await toggleButton.click()
    await page.waitForTimeout(300)
    
    // Text should have changed
    const newText = await toggleButton.textContent()
    expect(newText).not.toBe(initialText)
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/dashboard')
    
    // Page should still load and display key elements
    const weekHeader = page.locator('.max-w-6xl h1').first()
    await expect(weekHeader).toBeVisible()
    
    // Check for metric cards
    await expect(page.getByText('PRs Merged').first()).toBeVisible()
    await expect(page.getByText('Reviews').first()).toBeVisible()
    
    // Repository table should be scrollable
    const table = page.locator('table').first()
    await expect(table).toBeVisible()
  })

  test('should support dark mode', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    // Check if dark mode toggle exists (from shell)
    const themeToggle = page.getByRole('button', { name: /toggle theme/i })
    await expect(themeToggle).toBeVisible()
    
    // Get HTML element
    const html = page.locator('html')
    const initialClass = await html.getAttribute('class')
    
    // Toggle theme
    await themeToggle.click()
    await page.waitForTimeout(500)
    
    // Class should have changed
    const newClass = await html.getAttribute('class')
    expect(newClass).not.toBe(initialClass)
  })

  test('should handle drill-down by metric type', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    // Find first PR metric number and click (in table, not summary cards)
    const prMetric = page.locator('table td button.font-mono.font-semibold').first()
    await prMetric.click()
    await page.waitForTimeout(500)
    
    // Drill-down panel should open
    const panel = page.locator('.fixed.inset-y-0.right-0').last()
    await expect(panel).toBeVisible()
    
    // Panel should show filtered events
    const eventCards = panel.locator('.bg-slate-50')
    await expect(eventCards.first()).toBeVisible()
    
    // Close panel
    await page.getByRole('button', { name: /close/i }).last().click()
  })
})
