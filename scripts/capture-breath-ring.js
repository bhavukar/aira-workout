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

  // Jump to recovery pacer
  console.log('Opening phone menu to jump to Rest Pacer...');
  await page.locator('button[aria-label="Menu"]').first().click();
  await page.waitForTimeout(300);
  await page.locator('button:has-text("Rest Pacer")').first().click();
  await page.waitForTimeout(1200);

  const phoneElement = await page.$('.iphone-orange-bezel');
  if (phoneElement) {
    await phoneElement.screenshot({ path: 'screenshot-crystal-breath-ring.png' });
    console.log('Captured screenshot-crystal-breath-ring.png');
  }

  await browser.close();
}

main().catch(console.error);
