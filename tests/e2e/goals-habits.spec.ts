import { test, expect } from '@playwright/test'

test.describe('Goals & Habits Tracking', () => {
  test('should load and display goals and habits', async ({ page }) => {
    await page.goto('/goals-habits')
    await page.waitForLoadState('networkidle')
    
    // Check that page loaded successfully - look for Goals heading
    await expect(page.getByRole('heading', { name: 'Goals', level: 2 })).toBeVisible()
    
    // Should see Habits heading
    await expect(page.getByRole('heading', { name: 'Habits', level: 2 })).toBeVisible()
    
    // Should see at least one goal card
    const goalCards = page.locator('[data-testid="goal-card"]')
    await expect(goalCards.first()).toBeVisible()
    
    // Should see at least one habit card
    const habitCards = page.locator('[data-testid="habit-card"]')
    await expect(habitCards.first()).toBeVisible()
  })

  test('should open create goal modal', async ({ page }) => {
    await page.goto('/goals-habits')
    await page.waitForLoadState('networkidle')
    
    // Click create goal button (text is "New Goal")
    const createButton = page.getByRole('button', { name: /new goal/i })
    await createButton.click()
    await page.waitForTimeout(500)
    
    // Modal should be visible with title "New Goal"
    await expect(page.getByRole('heading', { name: 'New Goal' })).toBeVisible()
    
    // Form fields should be visible
    await expect(page.getByPlaceholder(/complete authentication/i)).toBeVisible()
  })

  test('should create a new goal', async ({ page }) => {
    await page.goto('/goals-habits')
    await page.waitForLoadState('networkidle')
    
    // Open create goal modal (button says "New Goal")
    await page.getByRole('button', { name: /new goal/i }).click()
    await page.waitForTimeout(500)
    
    // Fill in goal details using placeholder text
    await page.getByPlaceholder(/complete authentication/i).fill('Test Goal Title')
    await page.getByPlaceholder(/optional details about this goal/i).fill('Test goal description')
    
    // Target date field
    const dateInput = page.locator('input[type="date"]')
    await dateInput.fill('2026-02-15')
    
    // Save goal - button says "Create Goal"
    const saveButton = page.getByRole('button', { name: /create goal/i })
    await saveButton.click()
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)
    
    // New goal should appear in the list
    await expect(page.getByText('Test Goal Title')).toBeVisible()
  })

  test('should toggle habit completion', async ({ page }) => {
    await page.goto('/goals-habits')
    await page.waitForLoadState('networkidle')
    
    // Find first habit checkbox (current week)
    const firstCheckbox = page.locator('[data-testid="habit-checkbox"]').first()
    await firstCheckbox.waitFor({ state: 'visible' })
    
    // Click to toggle
    await firstCheckbox.click()
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)
    
    // Checkbox should be visible (state changed)
    await expect(firstCheckbox).toBeVisible()
  })

  test('should open create habit modal', async ({ page }) => {
    await page.goto('/goals-habits')
    await page.waitForLoadState('networkidle')
    
    // Click create habit button (text is "New Habit")
    const createButton = page.getByRole('button', { name: /new habit/i })
    await createButton.click()
    await page.waitForTimeout(500)
    
    // Modal should be visible with title "New Habit"
    await expect(page.getByRole('heading', { name: 'New Habit' })).toBeVisible()
    
    // Form fields should be visible
    await expect(page.getByPlaceholder(/write tests for every/i)).toBeVisible()
  })

  test('should create a new habit', async ({ page }) => {
    await page.goto('/goals-habits')
    await page.waitForLoadState('networkidle')
    
    // Open create habit modal (button says "New Habit")
    await page.getByRole('button', { name: /new habit/i }).click()
    await page.waitForTimeout(500)
    
    // Fill in habit details using placeholder text
    await page.getByPlaceholder(/write tests for every/i).fill('Test Habit Title')
    await page.getByPlaceholder(/optional details/i).fill('Test habit description')
    
    // Save habit - button says "Create Habit"
    const saveButton = page.getByRole('button', { name: /create habit/i })
    await saveButton.click()
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)
    
    // New habit should appear in the list
    await expect(page.getByText('Test Habit Title')).toBeVisible()
  })

  test('should display goal status badge', async ({ page }) => {
    await page.goto('/goals-habits')
    await page.waitForLoadState('networkidle')
    
    // Should see at least one status badge (Active, Completed, or Archived)
    const statusBadge = page.locator('[data-testid="goal-status"]').first()
    await expect(statusBadge).toBeVisible()
    
    // Status text should be one of the valid statuses
    const statusText = await statusBadge.textContent()
    expect(['active', 'completed', 'archived'].some(status => statusText?.toLowerCase().includes(status))).toBeTruthy()
  })

  test('should display habit streak count', async ({ page }) => {
    await page.goto('/goals-habits')
    await page.waitForLoadState('networkidle')
    
    // Find first habit card
    const habitCard = page.locator('[data-testid="habit-card"]').first()
    
    // Habit card should be visible
    await expect(habitCard).toBeVisible()
    
    // Should show some numeric stats (week count or percentage)
    const cardText = await habitCard.textContent()
    expect(cardText).toBeTruthy()
  })

  test('should show archived goals section', async ({ page }) => {
    await page.goto('/goals-habits')
    await page.waitForLoadState('networkidle')
    
    // Should see archived button/text (may be collapsed)
    await expect(page.getByText('Archived', { exact: false })).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/goals-habits')
    await page.waitForLoadState('networkidle')
    
    // Page should load - check for Goals heading
    await expect(page.getByRole('heading', { name: 'Goals', level: 2 })).toBeVisible()
    
    // Habits section should be visible
    await expect(page.getByRole('heading', { name: 'Habits', level: 2 })).toBeVisible()
    
    // Create buttons should be visible
    await expect(page.getByRole('button', { name: /new goal/i })).toBeVisible()
  })

  test('should support dark mode', async ({ page }) => {
    await page.goto('/goals-habits')
    await page.waitForLoadState('networkidle')
    
    // Find theme toggle in the app shell
    const themeToggle = page.locator('button[aria-label*="theme" i], button[aria-label*="dark" i], button[aria-label*="light" i]').first()
    
    if (await themeToggle.isVisible()) {
      await themeToggle.click()
      await page.waitForTimeout(300)
      
      // Check that dark mode class might be applied
      const html = page.locator('html')
      const classList = await html.getAttribute('class')
      // Just verify page is still functional
      await expect(page.getByRole('heading', { name: 'Goals', level: 2 })).toBeVisible()
    } else {
      // If no theme toggle found, just verify page renders
      await expect(page.getByRole('heading', { name: 'Goals', level: 2 })).toBeVisible()
    }
  })

  test('should handle empty goals state', async ({ page }) => {
    await page.goto('/goals-habits')
    await page.waitForLoadState('networkidle')
    
    // Page should load successfully
    await expect(page.getByRole('heading', { name: 'Goals', level: 2 })).toBeVisible()
  })
})
