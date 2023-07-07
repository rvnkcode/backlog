import { Prisma, PrismaClient } from '@prisma/client';

import { inboxTitles, trashTitles } from '../src/lib/const';

const prisma = new PrismaClient();

async function main() {
	const sample: Prisma.TaskCreateInput = {
		title: inboxTitles[0],
		isStarted: false,
		startedAt: null,
		isDone: false,
		completedAt: null
	};

	const long: Prisma.TaskCreateInput = {
		title: inboxTitles[1],
		isStarted: false,
		startedAt: null,
		isDone: false,
		completedAt: null,
		isTrashed: false
	};

	const completed: Prisma.TaskCreateInput = {
		title: inboxTitles[2],
		isDone: true,
		completedAt: new Date(),
		isTrashed: false
	};

	const trashed: Prisma.TaskCreateInput = {
		title: trashTitles[0],
		isTrashed: true
	};

	const tasks = [sample, long, completed, trashed];

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
