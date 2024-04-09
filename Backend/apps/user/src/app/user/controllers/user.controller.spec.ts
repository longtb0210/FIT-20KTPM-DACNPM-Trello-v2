import { Test } from '@nestjs/testing'
import { UserController } from './user.controller'
import { UserService, UserServiceMock } from '../services/user.service'
import { TrelloApi } from '@trello-v2/shared'

describe('UserController', () => {
  let controller: UserController

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(new UserServiceMock())
      .compile()

    controller = moduleRef.get(UserController)
  })

  describe('User:Create user', () => {
    it('Return user created', async () => {
      const body = {
        email: 'any_email',
        username: 'any_username',
        bio: 'any_bio',
        avatar: 'any_avatar',
      }
      const data = await controller.createUser(body)
      expect(TrelloApi.UserApi.CreateUserResponseSchema.safeParse(data).success).toBeTruthy()
    })
  })

  describe('User:Get all users', () => {
    it('Return all users', async () => {
      const data = await controller.getAll()
      expect(TrelloApi.UserApi.GetallUserResponseSchema.safeParse(data).success).toBeTruthy()
    })
  })

  describe('User:Get user by email', () => {
    it('Return user by email', async () => {
      const email = 'any_email';
      const data = await controller.getUser(email)
      expect(TrelloApi.UserApi.GetUserResponseSchema.safeParse(data).success).toBeTruthy()
    })
  })

  describe('User:Update user', () => {
    it('Return user updated', async () => {
      const email = 'any_email';
      const body = {
        email: 'any_email',
        username: 'any_username',
        bio: 'any_bio',
        avatar: 'any_avatar',
        activities: [],
        workspace_ids: [],
      }
      const data = await controller.updateUser(email, body)
      expect(TrelloApi.UserApi.UpdateUserResponseSchema.safeParse(data).success).toBeTruthy()
    })
  })

  describe('User:Delete user', () => {
    it('Return user deleted', async () => {
      const email = 'any_email';
      const data = await controller.deleteUser(email)
      expect(TrelloApi.UserApi.DeleteUserResponseSchema.safeParse(data).success).toBeTruthy()
    })
  })

  describe('User:Create activity', () => {
    it('Return activity deleted', async () => {
      const email = 'any_email';
      const body = {
        workspace_id: 'any_workspace_id',
        board_id: 'any_board_id',
        cardlist_id: 'any_cardlist_id',
        card_id: 'any_card_id',
        content: 'any_content'
      }
      const data = await controller.createActivity(email, body)
      expect(TrelloApi.UserApi.CreateActivityResponseSchema.safeParse(data).success).toBeTruthy()
    })
  })

  describe('User:Delete activity', () => {
    it('Return activity deleted', async () => {
      const email = 'any_email';
      const id = 'any_id';
      const data = await controller.deleteActivity(email, id)
      expect(TrelloApi.UserApi.DeleteActivityResponseSchema.safeParse(data).success).toBeTruthy()
    })
  })

  describe('User:Delete all activities', () => {
    it('Return all activities deleted', async () => {
      const email = 'any_email';
      const data = await controller.deleteActivities(email)
      expect(TrelloApi.UserApi.DeleteActivitiesResponseSchema.safeParse(data).success).toBeTruthy()
    })
  })
})
