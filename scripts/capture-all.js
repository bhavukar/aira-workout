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

  // 1. Capture Desktop Beige View with Centered Phone
  console.log('Capturing centered beige desktop view...');
  await page.screenshot({ path: 'screenshot-beige-centered-desktop.png' });

  const phoneElement = await page.$('.iphone-orange-bezel');
  if (phoneElement) {
    await phoneElement.screenshot({ path: 'screenshot-beige-standby-phone.png' });
  }

  // 2. Click Start Circuit button inside the phone
  console.log('Transitioning to interval...');
  await page.locator('button:has-text("All good")').first().click();
  await page.waitForTimeout(1000);

  if (phoneElement) {
    await phoneElement.screenshot({ path: 'screenshot-beige-interval-phone.png' });
  }

  // 3. Open Drawer to trigger Knee Adaptation
  console.log('Opening talk-over drawer for knee adapt...');
  await page.locator('button[title="Type a voice command"]').first().click();
  await page.waitForTimeout(400);
  await page.locator('button:has-text("My knee hurts")').first().click();
  await page.waitForTimeout(800);

  if (phoneElement) {
    await phoneElement.screenshot({ path: 'screenshot-beige-knee-adapted-phone.png' });
  }

  // 4. Open Phone Menu and jump to Rest & Breathe
  console.log('Opening phone menu to jump to recovery...');
  await page.locator('button[aria-label="Menu"]').first().click();
  await page.waitForTimeout(300);
  await page.locator('button:has-text("Rest & Breathe")').first().click();
  await page.waitForTimeout(600);

  if (phoneElement) {
    await phoneElement.screenshot({ path: 'screenshot-beige-recovery-phone.png' });
  }

  // 5. Open Builder Thesis Modal
  console.log('Opening Builder Thesis modal...');
  await page.locator('button:has-text("Builder Thesis")').first().click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'screenshot-beige-thesis-modal.png' });

  await browser.close();
  console.log('All beige theme screenshots captured successfully!');
}

main().catch(console.error);
