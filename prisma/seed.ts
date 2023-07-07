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

	const long: Prisma.TaskCreateInput = {
		title:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
		isStarted: false,
		startedAt: null,
		isDone: false,
		completedAt: null
	};

	const tasks = [sample, long];

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
