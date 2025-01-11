import {test, chromium} from "@playwright/test";
import loginUserFly from "../Poom/loginUserFly";

test.describe('as qa automation wants to do flow login', () => {
    let browser;
    let context;
    let view1;
    let view2;
    let login = new loginUserFly();
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

    test('user login success', async ({ page }) => {
        await test.step('open views navegator', async () => {
            await page.close();
            await login.openViews(view1, view2);
        });

        await test.step('user login success flow', async () => {
            await login.loginUser(view1);
        });

        await test.step('user login temporal success flow', async () => {
            await login.loginUserTemporal(view2);
        });

        await test.step('get code flow', async () => {
            await login.getCodeEmail(view2);
            await login.sendCodeRegister(view1);
        });
    });  
})
