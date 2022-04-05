// import prisma from "../prisma"

// // export async function createTransaction() {
// //     const result = await prisma.transaction.create({
// //         data: {
// //             amount: 100,
// //             senderId: 1,
// //             receiverId: 2,
// //             currency: "USD",
// //             rate: 1,
// //         }
// //     })
// //     return result;
// // }
// // export async function getAllTransactions() {

// //     const result = await prisma
// //         .transaction
// //         .findMany({
// //             where: {
// //                 OR: [
// //                     {
// //                         senderId: 1,
// //                     },
// //                     {
// //                         receiverId: 1,
// //                     }
// //                 ]
// //             }
// //         })
// //     return result;
// // }