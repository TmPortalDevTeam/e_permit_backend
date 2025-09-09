import nodemailer from 'nodemailer';
import { logger, loggerHttp } from './logger';
import { getEnv } from '@src/infra/env/service';
import { fileManagerService } from '@src/infra/file-manager';

const email = getEnv('EMAIL_USER');
const emailPass = getEnv('EMAIL_PASSWORD');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: email,
        pass: emailPass,
    },
    logger: true,
});

export const sendEmailWithNodemailer = async (toEmail: string, fileName: string) => {
    try {
        const filePath = fileManagerService.getPath({ fileName, folder: 'public' });

        await transporter.sendMail({
            from: `"Elektron Rugsatnama" <${email}>`,
            to: toEmail,
            subject: "Elektron Rugsatnama",
            text: 'Pdf file görnüşinde açyp bilersiñiz',
            html: `<h2>Siziñ Elektron Rugsatnamañyz</h2><p>Pdf file görnüşinde açyp bilersiñiz</p>`,
            attachments: [
                {
                    filename: fileName,
                    path: filePath,
                    contentType: "application/pdf",
                },
            ],
        });

        return true;
    } catch (e: any) {
        loggerHttp(e, email);
        const fileRemove = await fileManagerService.remove({ fileName, folder: 'public' });
        if (!fileRemove) logger.error({ message: 'Remove file error', date: '/public/' + fileName })

        return false;
    }
};