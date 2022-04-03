import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcrypt';

export default async function handle(req, res) {
    const {
        amount,
        receiverId,
        currency,
        rate } = req.body;

    if (req.method === 'POST') {
        const session = await getSession({ req });

        const result = await prisma.transaction.create({
            data: {
                amount: amount,
                senderId: session.user.id as number,
                receiverId: receiverId,
                currency: currency,
                rate: rate,
            },
        });
        res.json(result);

    } else {
        const result = await prisma.user.findMany();
        res.json(result);
    }
}