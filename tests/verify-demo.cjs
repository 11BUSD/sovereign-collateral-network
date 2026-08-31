const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:8080/', { waitUntil: 'networkidle' });
  await page.waitForSelector('#metrics .metric');
  const title = await page.title();
  const assets = await page.locator('#assetPreview .assetRow').count();
  await page.click('[data-view="risk"]');
  await page.click('[data-scenario="btc"]');
  const scenario = await page.locator('#riskMetrics').innerText();
  await page.click('[data-view="settlement"]');
  await page.click('#settlementForm button[type="submit"]');
  const decision = await page.locator('#settlementResult').innerText();
  await page.click('[data-view="overview"]');
  await page.screenshot({ path: 'scn-demo-verified.png', fullPage: true });
  await browser.close();
  if (!title.includes('Operations Console') || assets !== 4 || !scenario.includes('BTC −60%') || !decision.includes('ROUTE') || errors.length) {
    throw new Error(JSON.stringify({ title, assets, scenario, decision, errors }, null, 2));
  }
  console.log(JSON.stringify({ title, assetsPreviewed: assets, stressScenario: 'passed', settlementDecision: 'passed', consoleErrors: errors.length }));
})().catch(error => { console.error(error); process.exit(1); });
