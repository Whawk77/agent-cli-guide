import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const storageKey = 'agent-cli-guide:theme';

test('system theme resolves before the app renders and follows system changes', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');

  await expect(page.locator('html')).toHaveAttribute('data-theme-preference', 'system');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('explicit theme persists across reloads', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: '浅色主题' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect
    .poll(() => page.evaluate((key) => localStorage.getItem(key), storageKey))
    .toBe('light');

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme-preference', 'light');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

  await page.getByRole('button', { name: '深色主题' }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('theme changes synchronize across tabs', async ({ context }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop');
  const first = await context.newPage();
  const second = await context.newPage();
  await first.goto('/');
  await second.goto('/');

  await first.getByRole('button', { name: '浅色主题' }).click();
  await expect(second.locator('html')).toHaveAttribute('data-theme-preference', 'light');
  await expect(second.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('command search works with the keyboard', async ({ page }) => {
  await page.goto('/');
  const search = page.getByRole('combobox', { name: '搜索所有 Agent 命令' });
  await search.fill('--model');
  await expect(page.getByRole('listbox', { name: '命令搜索结果' })).toBeVisible();

  await search.press('ArrowDown');
  await expect(page.getByRole('option', { selected: true })).toBeVisible();
  await search.press('Enter');

  await expect(search).toHaveValue('');
  await expect(page.getByRole('listbox', { name: '命令搜索结果' })).toBeHidden();
});

test('theme and Agent controls work with the keyboard', async ({ page }) => {
  await page.goto('/');

  const darkTheme = page.getByRole('button', { name: '深色主题' });
  await darkTheme.focus();
  await darkTheme.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  const codexTab = page.getByRole('button', { name: 'Codex CLI', exact: true });
  await codexTab.focus();
  await codexTab.press('Enter');
  await expect(codexTab).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('heading', { name: /Codex CLI/ })).toBeVisible();
});

test('mobile command drawer supports keyboard and backdrop dismissal', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile');
  await page.goto('/');

  const menu = page.getByRole('button', { name: '打开命令菜单' });
  await menu.focus();
  await menu.press('Enter');
  await expect(page.locator('#command-sidebar')).toHaveClass(/open/);
  await page.keyboard.press('Escape');
  await expect(page.locator('#command-sidebar')).not.toHaveClass(/open/);
  await expect(menu).toBeFocused();

  await menu.press('Enter');
  const firstCommand = page.locator('.cat-entry').first();
  await firstCommand.focus();
  await firstCommand.press('Enter');
  await expect(page.locator('#command-sidebar')).not.toHaveClass(/open/);

  await menu.focus();
  await menu.press('Enter');
  await page.locator('.sidebar-backdrop.open').click({ position: { x: 380, y: 400 } });
  await expect(page.locator('#command-sidebar')).not.toHaveClass(/open/);
});

test('light and dark layouts have no page overflow and pass Axe', async ({ page }, testInfo) => {
  await page.goto('/');
  const input = page.getByRole('combobox', { name: '模拟终端命令输入' });
  await input.fill(
    'claude --model anthropic-long-model-identifier-for-responsive-layout --permission-mode acceptEdits',
  );

  for (const theme of ['light', 'dark'] as const) {
    const label = theme === 'light' ? '浅色主题' : '深色主题';
    await page.getByRole('button', { name: label }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    await page.waitForTimeout(220);

    const dimensions = await page.evaluate(() => ({
      documentClient: document.documentElement.clientWidth,
      documentScroll: document.documentElement.scrollWidth,
      bodyClient: document.body.clientWidth,
      bodyScroll: document.body.scrollWidth,
    }));
    expect(dimensions.documentScroll).toBeLessThanOrEqual(dimensions.documentClient);
    expect(dimensions.bodyScroll).toBeLessThanOrEqual(dimensions.bodyClient);

    const accessibility = await new AxeBuilder({ page }).analyze();
    expect(accessibility.violations).toEqual([]);
    await page.screenshot({
      path: testInfo.outputPath(`${theme}.png`),
      fullPage: true,
    });

    if (testInfo.project.name === 'mobile') {
      await page.getByRole('button', { name: '打开命令菜单' }).click();
      await page.waitForTimeout(220);
      await page.screenshot({
        path: testInfo.outputPath(`${theme}-drawer.png`),
        fullPage: true,
      });
      await page.keyboard.press('Escape');
    }
  }
});
