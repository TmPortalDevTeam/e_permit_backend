import nodemailer from 'nodemailer';
import { loggerHttp } from './logger';
import { getEnv } from '@src/infra/env/service';
import { fileManagerService } from '@src/infra/file-manager';

const emailName = getEnv('EMAIL_USER');

// sent email count limited 

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: emailName,
        pass: getEnv('EMAIL_PASSWORD'),
    },
});


export const sendEmailWithNodemailer = async (toEmail: string, fileName: string) => {
    try {
        const filePath = fileManagerService.getPath({ fileName, folder: 'public' });
        const subjectText: string = 'Elektron Rugsatnamañyz';
        const textBody: string = 'Pdf file görnüşinde açyp bilersiñiz';

        await transporter.sendMail({
            from: `"${subjectText}" <${emailName}>`,
            to: toEmail,
            subject: subjectText,
            text: textBody,
            html: `<h2>Siziñ ${subjectText}<br/><br/>${textBody}</h2>`,
            attachments: [
                {
                    filename: fileName,
                    path: filePath,
                    contentType: "application/pdf",
                },
            ],
        });

        return true;
    } catch (e) {
        loggerHttp(e, emailName);
        return false;
    }
};