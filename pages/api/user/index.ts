import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcrypt';

export default async function handle(req, res) {
    const { name, email, password } = req.body;

    if (req.method === 'POST') {
        const salt = await bcrypt.genSalt();
        let updated = await bcrypt.hash(password, salt);
        const result = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: updated,
            },
        });

        const account = await prisma.account.create({
            data: {
                userId: result.id,
                dollar: 100,
                pound: 0,
                yen: 0,
            }
        });
        
        res.json(result);
    } else {
        const result = await prisma.user.findMany();
        res.json(result);
    }
}