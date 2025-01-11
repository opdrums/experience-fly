import * as dotenv from 'dotenv'
import * as fs from 'fs'
dotenv.config();

const path = require('path')
const configPath = path.resolve(__dirname, '../../tests/septup/loginUserFly.json')
const option = JSON.parse(fs.readFileSync(configPath, 'utf8'))

class loginUserFly{
    constructor(page){
        this.page = page;
        this.code = null;
    };

    async openViews(view1, view2) {
        await Promise.all([
          await view1.goto(`${process.env.baseUrlLatam}`),
          await view2.goto(`${process.env.baseUrlMail}`),
        ])

        await view1.setDefaultTimeout(120000),
        await view2.setDefaultTimeout(120000)
    };

    async loginUser(view1){
        await view1.getByRole('button', { name: 'Iniciar sesión' }).click();
        await view1.getByRole('button', { name: 'Continúa con tu email' }).waitFor({state: 'visible'});
        await view1.getByRole('button', { name: 'Continúa con tu email' }).click();
        await view1.getByPlaceholder('Email').fill(option.email);
        await view1.getByRole('button', { name: 'Continuar' }).click();
    };

    async loginUserTemporal(view2){
        await view2.getByLabel('Account').click();
        await view2.getByRole('menuitem', { name: 'Login' }).click();
        await view2.locator('//*[@id="v-1-15"]').fill(option.email);
        await view2.locator('//*[@id="v-1-16"]').fill(option.password);
        await view2.getByRole('button', { name: 'Login' }).click();
    };

    async getCodeEmail(view2){
        await view2.locator('//ul/li/a/div/div/div[2]/div[2]/div/div[1]').first().waitFor({state: 'visible'});
        const codeElement = await view2.locator('//ul/li/a/div/div/div[2]/div[2]/div/div[1]').first();
        const fullText = await codeElement.textContent();
        const match = fullText.match(/\b\d{6}\b/);
        this.code = match[0];
    };  

    async sendCodeRegister(view1){
        await view1.locator('.Lrvm-input').first().fill(this.code)
    };
};

export default loginUserFly;