import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.emun';
import { Task } from './task.entity';
import { NotFoundException } from '@nestjs/common';

const mockUser = {
  id: 1,
  username: 'a username',
};

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
});

describe('TasksService', () => {
  let tasksService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('gets all tasks from the repository', async () => {
      taskRepository.getTasks.mockResolvedValue('some resolved value');

      expect(taskRepository.getTasks).not.toHaveBeenCalled();
      const filters: GetTasksFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'some query',
      };
      const result = await tasksService.getTasks(filters, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalled();

      expect(result).toEqual('some resolved value');
    });
  });

  describe('getTaskById', () => {
    it('it calls taskRepository.findOne() and gets the task correctly', async () => {
      const mockTask = new Task();
      mockTask.id = 25;
      mockTask.title = 'test task title';
      taskRepository.findOne.mockResolvedValue(mockTask);

      const result = await tasksService.getTaskById(25, mockUser);

      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 25,
          userId: mockUser.id,
        },
      });

      expect(result).toEqual(mockTask);
    });

    it('throw error when task not found', async () => {
      taskRepository.findOne.mockResolvedValue(null);
      await expect(tasksService.getTaskById(256, mockUser)).rejects.toThrow(
        new NotFoundException('Task with ID "256" not found'),
      );
    });
  });

  describe('createTask', () => {
    it('calls taskRepository.createTask() and returns the result', async () => {
      taskRepository.createTask.mockResolvedValue('mockTask');
      const createTaksDto = {
        title: 'this is the title',
        description: 'this is the description',
      };
      const result = await tasksService.createTask(createTaksDto, mockUser);

      expect(taskRepository.createTask).toHaveBeenCalledWith(
        createTaksDto,
        mockUser,
      );

      expect(result).toEqual('mockTask');
    });
  });

  describe('deleteTask', () => {
    it('calls taskRepository.delete() and deletes a task', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 1 });

      expect(taskRepository.delete).not.toHaveBeenCalled();
      await tasksService.deleteTask(5, mockUser);

      expect(taskRepository.delete).toHaveBeenCalledWith({
        id: 5,
        userId: mockUser.id,
      });
    });

    it('throws error when task is not there', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 0 });

      expect(taskRepository.delete).not.toHaveBeenCalled();

      await expect(tasksService.deleteTask(5, mockUser)).rejects.toThrow(
        new NotFoundException('Task with ID "5" not found'),
      );

      expect(taskRepository.delete).toHaveBeenCalledWith({
        id: 5,
        userId: mockUser.id,
      });
    });
  });

  describe('update task status', () => {
    it('calls TaskService.getTaskByid() and saves the task with updated status', async () => {
      const save = jest.fn().mockResolvedValue(true);

      const mockTask = new Task();
      mockTask.id = 25;
      mockTask.title = 'test task title';
      mockTask.status = TaskStatus.DONE;
      mockTask.save = save;

      // mock announceFriendship function
      tasksService.getTaskById = jest.fn().mockResolvedValue(mockTask);
      await expect(tasksService.getTaskById).not.toHaveBeenCalledWith(
        25,
        mockUser,
      );
      await expect(save).not.toHaveBeenCalled();

      const result = await tasksService.updateTaskStatus(
        25,
        TaskStatus.IN_PROGRESS,
        mockUser,
      );

      await expect(tasksService.getTaskById).toHaveBeenCalledWith(25, mockUser);

      await expect(save).toHaveBeenCalled();
      expect(result.status).toEqual(TaskStatus.IN_PROGRESS);

      // alternative syntax
      // const spy = jest.spyOn(taskService, 'getTaskById');
      // // later in test
      // expect(spy).toHaveBeenCalled()
    });
  });
});
