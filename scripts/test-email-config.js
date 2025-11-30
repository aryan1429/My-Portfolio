import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '../.env');

console.log('Reading .env from:', envPath);

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};

    envContent.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            let value = match[2].trim();
            // Remove quotes if present
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }
            envVars[key] = value;
        }
    });

    const user = envVars.SMTP_USER || envVars.EMAIL_USER;
    let pass = envVars.SMTP_PASS || envVars.EMAIL_PASS;

    if (!user) {
        console.log('❌ SMTP_USER not found in .env');
        process.exit(1);
    }
    if (!pass) {
        console.log('❌ SMTP_PASS not found in .env');
        process.exit(1);
    }

    console.log('✅ Found credentials for:', user);

    // Handle spaces in App Password
    if (pass.includes(' ')) {
        console.log('ℹ️  Password contains spaces. Removing them for connection...');
        pass = pass.replace(/\s/g, '');
    }

    const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: { user, pass },
    });

    console.log('Testing connection...');
    transporter.verify()
        .then(() => {
            console.log('✅ SUCCESS: Credentials are valid!');
            console.log('👉 Suggestion: If your server is running, RESTART it now.');
        })
        .catch((err) => {
            console.error('❌ CONNECTION FAILED:', err.message);
            if (err.message.includes('Username and Password not accepted')) {
                console.log('👉 Tip: Ensure you are using an App Password, not your login password.');
            }
        });

} catch (err) {
    console.error('❌ Error reading .env:', err.message);
}
