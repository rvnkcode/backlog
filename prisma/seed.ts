import { Prisma, PrismaClient } from '@prisma/client';

import { inboxTitles, trashTitles } from '../tests/const';

const prisma = new PrismaClient();

const resetStatuses = {
	isStarted: false,
	startedAt: null,
	isDone: false,
	completedAt: null,
	isTrashed: false
};

async function main() {
	const sample: Prisma.TaskCreateInput = {
		title: inboxTitles[0],
		note: 'Some note test',
		urls: 'https://github.com/rvnkcode/backlog,https://hub.docker.com/repository/docker/rvnk/backlog/general',
		...resetStatuses
	};

	const long: Prisma.TaskCreateInput = {
		title: inboxTitles[1],
		...resetStatuses
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

	const testContact: Prisma.PeopleCreateInput = {
		name: 'Test',
		isActive: true
	};

	const allocated: Prisma.TaskCreateInput = {
		title: 'Allocated task',
		...resetStatuses,
		Contact: {
			connect: {
				name: 'Test'
			}
		}
	};

	const tasks = [sample, long, completed, trashed, allocated];

	for await (const task of tasks) {
		await prisma.people.upsert({
			where: {
				id: 1
			},
			update: testContact,
			create: testContact
		});

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
