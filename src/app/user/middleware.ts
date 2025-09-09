import { paymentFieldsSchema } from '@src/api/schema/common';
import { err } from '@src/utils';

export async function validateOfflinePayment(request: any, reply: any) {
    const file = await request.file();
    if (!file) return reply.status(400).send({ message: "File is required" });

    const fields = file.fields || {};
    const payload = {
        permit_id: fields.permit_id?.value,
        amount: fields.amount?.value,
        type: fields.type?.value,
        pay_date: fields.pay_date?.value,
        document_number: fields.document_number?.value,

        // java permit
        issued_for: fields.issued_for?.value,
        permit_type: fields.permit_type?.value,
        permit_year: fields.permit_year?.value,
        plate_number: fields.plate_number?.value,
        company_name: fields.company_name?.value,
        company_id: fields.company_id?.value,
        departure_country: fields.departure_country?.value,
        arrival_country: fields.arrival_country?.value,

        // java permit
        permitId: fields.permitId?.value,
        status: fields.status?.value,
    };

    const result = paymentFieldsSchema.safeParse(payload);
    if (!result.success) {
        const message = result.error.errors.map(e => `${e.path.join('.') || 'field'}: ${e.message}`).join('; ');
        throw err.BadRequest(message);
    }
    request.validatedPayment = result.data;
    request.uploadedFile = file;
};