import * as dotenv from 'dotenv'
import * as fs from 'fs'
dotenv.config();

const path = require('path')
const configPath = path.resolve(__dirname, '../../tests/septup/registerUserFly.json')
const option = JSON.parse(fs.readFileSync(configPath, 'utf8'))

class registerUserFly{

    constructor(page){
        this.page = page;
        this.emailProvitional = null;
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

    async flowRegisteUser(view1){
        await view1.getByRole('button', { name: 'Iniciar sesión' }).click();
        await view1.getByRole('button', { name: 'Continúa con tu email' }).waitFor({state: 'visible'})
        await view1.getByRole('button', { name: 'Continúa con tu email' }).click()
    };

    async getEmailProvitional(view2){
        await view2.locator('//*[@id="Dont_use_WEB_use_API_OK"]').waitFor({state: 'visible'});
        let texto = await view2.locator('//*[@id="Dont_use_WEB_use_API_OK"]').getAttribute('value');
        this.emailProvitional = texto;
    };

    async sendEmailRegister(view1){
       await view1.getByPlaceholder('Email').fill(this.emailProvitional)
       await view1.getByRole('button', { name: 'Continuar' }).click()
       await view1.getByRole('button', { name: 'Crea tu cuenta' }).click()
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

    async addEmailJson() {
        if (!this.emailProvitional) {
            console.log("No se proporcionó un email válido.");
            return;
        }
        const emailData = this.emailProvitional.trim();
        const emailFilePath = path.join(__dirname, '../septup/emails.json');
        let storedEmails = [];

        if (fs.existsSync(emailFilePath)) {
            const previousData = fs.readFileSync(emailFilePath, 'utf-8');
            storedEmails = JSON.parse(previousData);
        }
        storedEmails.push(emailData);
        fs.writeFileSync(emailFilePath, JSON.stringify(storedEmails, null, 5));
    };
};

export default registerUserFly;