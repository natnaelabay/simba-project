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
        const body = req.body;

        const user = await prisma.account.findUnique({
            where: {
                userId: session.id as number,
            },
        });

        if (body.currency === 'USD' && user.dollar < body.amount) {
            res.status(400).json({
                error: 'Insufficient funds',
            });
        } else if (body.currency === 'GBP' && user.pound < body.amount) {
            res.status(400).json({
                error: 'Insufficient funds',
            });
        } else if (body.currency === 'JPY' && user.yen < body.amount) {
            res.status(400).json({
                error: 'Insufficient funds',
            });
        }

        if(body.currency === 'USD') {
            prisma.account.update({
                where: {
                    userId: session.id as number,
                },
                data: {
                    dollar: user.dollar - body.amount,
                },
            });
        } else if (body.currency === 'GBP') {
            prisma.account.update({
                where: {
                    userId: session.id as number,
                },
                data: {
                    pound: user.pound - body.amount,
                },
            });
        } else if (body.currency === 'JPY') {
            prisma.account.update({
                where: {
                    userId: session.id as number,
                },
                data: {
                    yen: user.yen - body.amount,
                },
            });
        }
         

        if (user.dollar < amount) {
            res.status(400).json({
                error: 'Insufficient funds',
            });
        } else {

            const result = await prisma.transaction.create({
                data: {
                    amount: req.body.converted,
                    senderId: session.id as number,
                    receiverId: receiverId,
                    currency: currency,
                    rate: rate,
                },
            });
            res.json(result);
        }
    } else {
        const result = await prisma.user.findMany();
        res.json(result);
    }
}

