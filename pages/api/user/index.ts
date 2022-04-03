import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcrypt';

export default async function handle(req, res) {
    const { name, email, password } = req.body;

    if (req.method === 'POST') {
        let updated = await bcrypt.hash(password, 10);
        const result = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: updated,
            },
        });
        res.json(result);
    } else {
        const result = await prisma.user.findMany();
        res.json(result);
    }
}