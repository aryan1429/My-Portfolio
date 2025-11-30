import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from root
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('--- Email Config Test ---');
console.log('Checking environment variables...');

const user = process.env.SMTP_USER || process.env.EMAIL_USER;
const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

if (!user) {
    console.error('❌ ERROR: SMTP_USER or EMAIL_USER is missing in .env');
} else {
    console.log('✅ SMTP_USER/EMAIL_USER is set:', user);
}

if (!pass) {
    console.error('❌ ERROR: SMTP_PASS or EMAIL_PASS is missing in .env');
} else {
    console.log('✅ SMTP_PASS/EMAIL_PASS is set (hidden)');
}

if (user && pass) {
    console.log('\nAttempting to create transporter...');
    const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: { user, pass },
    });

    console.log('Verifying connection...');
    try {
        await transporter.verify();
        console.log('✅ Connection successful! Your email config is correct.');
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.log('\nPossible fixes:');
        console.log('1. Check if your password is correct.');
        console.log('2. If using Gmail, you MUST use an App Password, not your login password.');
        console.log('   Go to Google Account > Security > 2-Step Verification > App Passwords.');
    }
}
