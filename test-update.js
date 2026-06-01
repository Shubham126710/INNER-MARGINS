const { PrismaClient } = require('./src/generated/client/index.js');
const prisma = new PrismaClient();
async function main() {
  try {
    const post = await prisma.post.findFirst();
    const updated = await prisma.post.update({
      where: { id: post.id },
      data: {
        isLocked: true
      }
    });
    console.log('Update success!', updated.isLocked);
    await prisma.post.update({ where: { id: post.id }, data: { isLocked: false }});
  } catch (err) {
    console.error('Update error:', err);
  } finally {
    await prisma.$disconnect();
  }
}
main();
