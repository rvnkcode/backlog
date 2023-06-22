import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	const sample: Prisma.TaskCreateInput = {
		title: 'This is the sample task',
		isStarted: false,
		startedAt: null,
		isDone: false,
		completedAt: null
	};

	const tasks = [sample];

	for await (const task of tasks) {
		await prisma.task.upsert({
			where: {
				id: tasks.indexOf(task) + 1
			},
			update: task,
			create: task
		});
	}
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (error) => {
		console.error(error);
		await prisma.$disconnect();
		process.exit(1);
	});
