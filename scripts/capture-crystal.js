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

  // 1. Transition to Interval timer
  console.log('Transitioning to interval with CrystalizedBall timer...');
  await page.locator('button:has-text("All good")').first().click();
  await page.waitForTimeout(1500);

  const phoneElement = await page.$('.iphone-orange-bezel');
  if (phoneElement) {
    await phoneElement.screenshot({ path: 'screenshot-crystal-timer-interval.png' });
    console.log('Captured screenshot-crystal-timer-interval.png');
  }

  // 2. Open Phone Menu and jump to Rest & Breathe (Aurora CrystalizedBall)
  console.log('Opening phone menu to jump to recovery breath pacer...');
  await page.locator('button[aria-label="Menu"]').first().click();
  await page.waitForTimeout(400);
  await page.locator('button:has-text("Rest & Breathe")').first().click();
  await page.waitForTimeout(1200);

  if (phoneElement) {
    await phoneElement.screenshot({ path: 'screenshot-crystal-recovery-pacer.png' });
    console.log('Captured screenshot-crystal-recovery-pacer.png');
  }

  await page.screenshot({ path: 'screenshot-crystal-desktop.png' });
  console.log('Captured screenshot-crystal-desktop.png');

  await browser.close();
}

main().catch(console.error);
