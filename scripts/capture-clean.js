import { chromium } from '/Users/bhavukarora/IdeaProjects/workout-starter/node_modules/playwright/index.mjs';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 960 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  // Transition to interval
  await page.locator('button:has-text("All good")').first().click();
  await page.waitForTimeout(800);

  const phoneElement = await page.$('.iphone-orange-bezel');
  if (phoneElement) {
    await phoneElement.screenshot({ path: 'screenshot-clean-interval-phone.png' });
    console.log('Captured screenshot-clean-interval-phone.png');
  }

  // Jump to recovery pacer
  await page.locator('button[aria-label="Menu"]').first().click();
  await page.waitForTimeout(300);
  await page.locator('button:has-text("Rest & Breathe")').first().click();
  await page.waitForTimeout(800);

  if (phoneElement) {
    await phoneElement.screenshot({ path: 'screenshot-clean-recovery-phone.png' });
    console.log('Captured screenshot-clean-recovery-phone.png');
  }

  await browser.close();
}

main().catch(console.error);
