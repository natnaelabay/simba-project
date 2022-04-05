import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcrypt';

export default async function handle(req, res) {
    const {
        amount,
        receiverId,
        // currency,
        pure,
        rate } = req.body;

    if (req.method === 'POST') {
        const session = await getSession({ req });
        const body = req.body;
        const u = await prisma.user.findFirst({
            where: {
                email: session.user.email
            }
        })
        const to = await prisma.account.findFirst({
            where: {
                userId: body.receiver
            }
        });

        const account = await prisma.account.findUnique({
            where: {
                userId: u.id,
            },
        });
        const rAccount = await prisma.account.findUnique({
            where: {
                userId: body.receiver,
            },
        });

        if (body.currency === 'USD' && account.dollar < body.amount) {
            res.status(400).json({
                error: 'Insufficient funds',
            });
        } else if (body.currency === 'GBP' && account.pound < body.amount) {
            res.status(400).json({
                error: 'Insufficient funds',
            });
        } else if (body.currency === 'JPY' && account.yen < body.amount) {
            res.status(400).json({
                error: 'Insufficient funds',
            });
        }

        // if (body.currency === 'USD') {
        //     prisma.account.update({
        //         where: {
        //             userId: session.id as number,
        //         },
        //         data: {
        //             dollar: Math.abs(account.dollar - body.amount),
        //         },
        //     });

        //     prisma.account.update({
        //         where: {
        //             userId: body.receiver
        //         },
        //         data: {
        //             dollar: body.converted + to.dollar
        //         }
        //     });

        // } else if (body.currency === 'GBP') {
        //     prisma.account.update({
        //         where: {
        //             userId: u.id,
        //         },
        //         data: {
        //             pound: Math.abs(account.pound - body.amount),
        //         },
        //     });
        //     prisma.account.update({
        //         where: {
        //             userId: body.receiver
        //         },
        //         data: {
        //             pound: body.converted + to.pound
        //         }
        //     });

        // } else if (body.currency === 'JPY') {
            
        //     prisma.account.update({
        //         where: {
        //             userId: session.id as number,
        //         },
        //         data: {
        //             yen: Math.abs(account.yen - body.amount),
        //         },
        //     });

        //     prisma.account.update({
        //         where: {
        //             userId: body.receiver as number
        //         },
        //         data: {
        //             yen: body.converted + to.yen
        //         }
        //     });

        // }

        await prisma.account.update({
            where: {
                id: to.id
            },
            data: {
                [body.targetCurrency == "USD" ? "dollar" :
                    body.targetCurrency == "GBP" ? "pound" : "yen"]: body.converted + rAccount[
                    body.targetCurrency == "USD" ? "dollar" :
                        body.targetCurrency == "GBP" ? "pound" : "yen"
                    ]

            }
        })

        await prisma.account.update({
            where: {
                id: account.id
            },
            data: {
                [body.currency == "USD" ? "dollar" :
                    body.currency == "GBP" ? "pound" : "yen"]: Math.abs(parseInt(body.pure) - account[
                    body.currency == "USD" ? "dollar" :
                        body.currency == "GBP" ? "pound" : "yen"
                    ])

            }
        })

        const result = await prisma.transaction.create({
            data: {
                amount: req.body.converted,
                senderId: u.id,
                receiverId: body.receiver as number,
                currency: body.targetCurrency,
                rate: rate,
                sourceCurrency: body.currency,
            },
        });

        res.json(result);
    } else {

        const result = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
            }
        });
        
        res.json(result);
    }
}

