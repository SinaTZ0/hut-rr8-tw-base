```
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { authSessionTable } from '@/db/auth.schema';
import {
  cleanupDatabase,
  createAuthenticatedUserFixture,
  createUserFixture,
  requestJson,
  requestJsonWithCookie,
  type ListTaskDto,
  type TaskDto,
} from '../../utils/integration-test-helper';

/*===== Lifecycle =====*/
beforeEach(async () => {
  await cleanupDatabase();
});

afterAll(async () => {
  await cleanupDatabase();
});

/*===== Task Integration =====*/
describe('task feature integration', () => {
  it('creates, reads, updates, filters, and soft-deletes tasks through /rpc', async () => {
    /*------ Create Task ------*/
    const owner = await createAuthenticatedUserFixture('Task Owner');
    const dueAt = '2026-08-15T10:30:00.000Z';
    const createResult = await requestJson(
      'POST',
      '/rpc/tasks',
      {
        title: '  Ship integration tests  ',
        description: 'Covers the task lifecycle.',
        dueAt,
      },
      { cookie: owner.cookie },
    );

    expect(createResult.response.status).toBe(201);

    const createdTask = createResult.body as TaskDto;

    expect(createdTask).toMatchObject({
      title: 'Ship integration tests',
      description: 'Covers the task lifecycle.',
      status: 'todo',
      dueAt,
      owner: { id: owner.id, name: owner.name, image: null },
      assignees: [{ id: owner.id, name: owner.name, image: null }],
      deletedAt: null,
      version: 1,
    });
    expect(createdTask.id).toEqual(expect.any(String));
    expect(createdTask.createdAt).toEqual(expect.any(String));
    expect(createdTask.updatedAt).toEqual(expect.any(String));

    /*------ Read Task ------*/
    const getResult = await requestJsonWithCookie(owner.cookie, 'GET', `/rpc/tasks/${createdTask.id}`);

    expect(getResult.response.status).toBe(200);
    expect(getResult.body).toMatchObject({
      id: createdTask.id,
      title: 'Ship integration tests',
      version: 1,
    });

    /*------ Update Task ------*/
    const updateResult = await requestJsonWithCookie(owner.cookie, 'PATCH', `/rpc/tasks/${createdTask.id}`, {
      title: '  Completed integration tests  ',
      description: null,
      status: 'done',
      version: createdTask.version,
    });

    expect(updateResult.response.status).toBe(200);

    const updatedTask = updateResult.body as TaskDto;

    expect(updatedTask).toMatchObject({
      id: createdTask.id,
      title: 'Completed integration tests',
      description: null,
      status: 'done',
      version: 2,
    });

    /*------ Reject Stale Version ------*/
    const staleUpdateResult = await requestJsonWithCookie(owner.cookie, 'PATCH', `/rpc/tasks/${createdTask.id}`, {
      title: 'Stale update',
      version: createdTask.version,
    });

    expect(staleUpdateResult.response.status).toBe(409);
    expect(staleUpdateResult.body).toEqual({
      code: 'VERSION_CONFLICT',
      defined: true,
      status: 409,
      message: 'Task version is stale.',
    });

    /*------ List Filtered Tasks ------*/
    const listResult = await requestJsonWithCookie(owner.cookie, 'GET', '/rpc/tasks?status=done');

    expect(listResult.response.status).toBe(200);

    const taskList = listResult.body as ListTaskDto;

    expect(taskList).toMatchObject({
      limit: 20,
      offset: 0,
      total: 1,
    });
    expect(taskList.items).toHaveLength(1);
    expect(taskList.items[0]).toMatchObject({
      id: createdTask.id,
      status: 'done',
    });

    /*------ Soft Delete Task ------*/
    const deleteResult = await requestJsonWithCookie(
      owner.cookie,
      'DELETE',
      `/rpc/tasks/${createdTask.id}?version=${updatedTask.version}`,
    );

    expect(deleteResult.response.status).toBe(204);
    expect(deleteResult.body).toBeUndefined();

    const getDeletedResult = await requestJsonWithCookie(owner.cookie, 'GET', `/rpc/tasks/${createdTask.id}`);

    expect(getDeletedResult.response.status).toBe(404);
    expect(getDeletedResult.body).toEqual({
      code: 'NOT_FOUND',
      defined: true,
      status: 404,
      message: 'Task not found.',
    });

    const listDeletedResult = await requestJsonWithCookie(owner.cookie, 'GET', '/rpc/tasks');
    const deletedTaskList = listDeletedResult.body as ListTaskDto;

    expect(listDeletedResult.response.status).toBe(200);
    expect(deletedTaskList.total).toBe(0);
  });

  it('maps task business validation failures to 422 responses', async () => {
    /*------ Reject Empty Title ------*/
    const owner = await createAuthenticatedUserFixture();
    const blankTitleResult = await requestJson(
      'POST',
      '/rpc/tasks',
      {
        title: '   ',
      },
      { cookie: owner.cookie },
    );

    expect(blankTitleResult.response.status).toBe(422);
    expect(blankTitleResult.body).toEqual({
      code: 'INVALID_INPUT',
      defined: true,
      status: 422,
      message: 'Title must not be empty.',
      data: { field: 'title' },
    });

    /*------ Reject Unsupported Status ------*/
    const unsupportedStatusResult = await requestJson(
      'POST',
      '/rpc/tasks',
      {
        title: 'Invalid status task',
        status: 'blocked',
      },
      { cookie: owner.cookie },
    );

    expect(unsupportedStatusResult.response.status).toBe(422);
    expect(unsupportedStatusResult.body).toEqual({
      code: 'INVALID_INPUT',
      defined: true,
      status: 422,
      message: 'Status is not supported.',
      data: { field: 'status' },
    });
  });

  it('assigns users on creation, replaces assignments atomically, and filters by relationships', async () => {
    const owner = await createAuthenticatedUserFixture('Owner');
    const firstAssignee = await createUserFixture('First Assignee');
    const secondAssignee = await createUserFixture('Second Assignee');

    const createResult = await requestJson(
      'POST',
      '/rpc/tasks',
      {
        title: 'Assigned task',
        assigneeIds: [firstAssignee.id, firstAssignee.id, secondAssignee.id],
      },
      { cookie: owner.cookie },
    );

    expect(createResult.response.status).toBe(201);

    const createdTask = createResult.body as TaskDto;

    expect(createdTask.owner).toEqual({ id: owner.id, name: owner.name, image: owner.image });
    expect(createdTask.assignees).toEqual([
      firstAssignee,
      { id: owner.id, name: owner.name, image: owner.image },
      secondAssignee,
    ]);

    const ownerFilter = await requestJsonWithCookie(owner.cookie, 'GET', `/rpc/tasks?ownerId=${owner.id}`);
    const assigneeFilter = await requestJsonWithCookie(
      owner.cookie,
      'GET',
      `/rpc/tasks?assigneeId=${firstAssignee.id}`,
    );

    expect(ownerFilter.response.status).toBe(200);
    expect((ownerFilter.body as ListTaskDto).total).toBe(1);
    expect(assigneeFilter.response.status).toBe(200);
    expect((assigneeFilter.body as ListTaskDto).total).toBe(1);

    const updateResult = await requestJsonWithCookie(owner.cookie, 'PATCH', `/rpc/tasks/${createdTask.id}`, {
      assigneeIds: [],
      version: createdTask.version,
    });

    expect(updateResult.response.status).toBe(200);
    expect(updateResult.body).toMatchObject({ version: 2, assignees: [] });

    const filteredAfterClear = await requestJsonWithCookie(
      owner.cookie,
      'GET',
      `/rpc/tasks?assigneeId=${firstAssignee.id}`,
    );

    expect((filteredAfterClear.body as ListTaskDto).total).toBe(0);
  });

  it('rejects unknown relationship users without creating a task', async () => {
    const owner = await createAuthenticatedUserFixture('Known Owner');
    const result = await requestJson(
      'POST',
      '/rpc/tasks',
      {
        title: 'Invalid assignment task',
        assigneeIds: ['missing-user'],
      },
      { cookie: owner.cookie },
    );

    expect(result.response.status).toBe(422);
    expect(result.body).toMatchObject({
      code: 'INVALID_INPUT',
      data: { field: 'assigneeIds' },
    });

    const listResult = await requestJsonWithCookie(owner.cookie, 'GET', '/rpc/tasks');

    expect(listResult.response.status).toBe(401);
  });

  it('normalizes structural input failures to the documented validation error', async () => {
    const owner = await createAuthenticatedUserFixture();
    const missingTitleResult = await requestJson('POST', '/rpc/tasks', {}, { cookie: owner.cookie });

    expect(missingTitleResult.response.status).toBe(422);
    expect(missingTitleResult.body).toMatchObject({
      code: 'INVALID_INPUT',
      defined: true,
      status: 422,
      message: 'The request contains invalid values.',
      data: {
        properties: {
          body: {
            properties: {
              title: { errors: [expect.any(String)] },
            },
          },
        },
      },
    });

    const malformedIdResult = await requestJsonWithCookie(owner.cookie, 'GET', '/rpc/tasks/not-a-uuid');

    expect(malformedIdResult.response.status).toBe(422);
    expect(malformedIdResult.body).toMatchObject({
      code: 'INVALID_INPUT',
      defined: true,
      status: 422,
      data: {
        properties: {
          params: {
            properties: {
              taskId: { errors: [expect.any(String)] },
            },
          },
        },
      },
    });
  });

  it('requires a current session and rejects client-supplied ownership', async () => {
    const unauthenticatedResult = await requestJson('POST', '/rpc/tasks', { title: 'Unauthenticated task' });

    expect(unauthenticatedResult.response.status).toBe(401);
    expect(unauthenticatedResult.body).toEqual({
      code: 'UNAUTHORIZED',
      defined: true,
      status: 401,
      message: 'Sign in is required to access task and comment APIs.',
    });

    const owner = await createAuthenticatedUserFixture('Session Owner');
    const spoofedOwner = await createUserFixture('Spoofed Owner');
    const spoofedResult = await requestJson(
      'POST',
      '/rpc/tasks',
      { title: 'Spoofed ownership task', ownerId: spoofedOwner.id },
      { cookie: owner.cookie },
    );

    expect(spoofedResult.response.status).toBe(422);
    expect(spoofedResult.body).toMatchObject({ code: 'INVALID_INPUT' });

    await db.delete(authSessionTable).where(eq(authSessionTable.userId, owner.id));

    const revokedResult = await requestJson(
      'POST',
      '/rpc/tasks',
      { title: 'Revoked session task' },
      { cookie: owner.cookie },
    );

    expect(revokedResult.response.status).toBe(401);

    const listResult = await requestJsonWithCookie(owner.cookie, 'GET', '/rpc/tasks');

    expect((listResult.body as ListTaskDto).total).toBe(0);
  });

  it('requires a current session for every task and comment operation', async () => {
    const protectedRequests = [
      ['GET', '/rpc/tasks'],
      ['POST', '/rpc/tasks'],
      ['GET', '/rpc/tasks/00000000-0000-4000-8000-000000000000'],
      ['PATCH', '/rpc/tasks/00000000-0000-4000-8000-000000000000'],
      ['DELETE', '/rpc/tasks/00000000-0000-4000-8000-000000000000?version=1'],
      ['GET', '/rpc/tasks/00000000-0000-4000-8000-000000000000/comments'],
      ['POST', '/rpc/tasks/00000000-0000-4000-8000-000000000000/comments'],
      ['GET', '/rpc/tasks/00000000-0000-4000-8000-000000000000/comments/00000000-0000-4000-8000-000000000001'],
      ['PATCH', '/rpc/tasks/00000000-0000-4000-8000-000000000000/comments/00000000-0000-4000-8000-000000000001'],
      [
        'DELETE',
        '/rpc/tasks/00000000-0000-4000-8000-000000000000/comments/00000000-0000-4000-8000-000000000001?version=1',
      ],
    ] as const;

    for (const [method, path] of protectedRequests) {
      const result = await requestJson(method, path);

      expect(result.response.status, `${method} ${path}`).toBe(401);
      expect(result.body).toMatchObject({ code: 'UNAUTHORIZED', status: 401 });
    }
  });
});
```
