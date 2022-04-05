import { getSession } from 'next-auth/react';
import prisma from '../../../../lib/prisma';
import bcrypt from 'bcrypt';

export default async function handle(req, res) {
    const id = req.query.id;
    
    const account = await prisma.account.findUnique({
        where: {
            userId: parseInt(id as string),
        }
    });
    res.json(account);
}