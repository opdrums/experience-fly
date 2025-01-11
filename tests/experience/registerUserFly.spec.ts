import { test, chromium } from '@playwright/test';
import registerUserFly from '../Poom/registerUserFly';


test.describe('as qa automation wants to do flow register', () => {
  let browser;
  let context;
  let view1;
  let view2;
  let registerFly = new registerUserFly();
  const isHeadless = !! process.env.CI;
  
  test.beforeEach(async () => {
    browser = await chromium.launch({ 
      headless: isHeadless,
      args: [
        '--disable-blink-features=AutomationControlled'
      ]
    });
    context = await browser.newContext({
      bypassCSP: true,
      ignoreHTTPSErrors: true,
      javaScriptEnabled: true
    });
    view1 = await context.newPage();
    view2 = await context.newPage();
  });

  test('user registration flow', async ({ page }) => {
    await test.step('open views navegator', async () => {
      await page.close();
      await registerFly.openViews(view1, view2);
    });

    await test.step('user register and get email provisitional', async () => {
      await registerFly.flowRegisteUser(view1);
      await registerFly.getEmailProvitional(view2);
      await registerFly.addEmailJson()
    });

    await test.step('user gets code register', async () => {
      await registerFly.sendEmailRegister(view1)
      await registerFly.getCodeEmail(view2)
      await registerFly.sendCodeRegister(view1)
    });
  });
});

