import prisma from "../prisma"

export async function createUser() {
    const result = await prisma.user.create({
        data: {
            name: "natnael",
            email: "nati@gmail.com",
            password: "123123",
        }
    })
    return result;
}
export async function getAllTransactions() {
    const result = await prisma
        .user
        .findMany({
            where: {
                NOT: [
                    {
                        id: 1,
                    },
                ]
            }
        });
    return result;
}