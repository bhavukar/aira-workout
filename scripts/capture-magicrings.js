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
  await page.waitForTimeout(1000);

  // Transition to interval
  console.log('Starting interval workout...');
  await page.locator('button:has-text("All good")').first().click();
  await page.waitForTimeout(1200);

  const phoneElement = await page.$('.iphone-orange-bezel');
  if (phoneElement) {
    await phoneElement.screenshot({ path: 'screenshot-magicrings-interval-phone.png' });
    console.log('Captured screenshot-magicrings-interval-phone.png');
  }

  // Toggle Cardiac mode on the heart rate badge
  console.log('Toggling cardiac ring view...');
  await page.locator('button[title="Toggle Cardiac Heart Beat Rings"]').first().click();
  await page.waitForTimeout(1200);

  if (phoneElement) {
    await phoneElement.screenshot({ path: 'screenshot-magicrings-cardiac-mode.png' });
    console.log('Captured screenshot-magicrings-cardiac-mode.png');
  }

  // Desktop view
  await page.screenshot({ path: 'screenshot-magicrings-desktop.png' });
  console.log('Captured screenshot-magicrings-desktop.png');

  await browser.close();
}

main().catch(console.error);
