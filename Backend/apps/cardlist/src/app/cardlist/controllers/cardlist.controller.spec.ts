import { Test, TestingModule } from '@nestjs/testing'
import { CardlistController } from './cardlist.controller'
import { CardlistService, CardlistServiceMock } from '../services/cardlist.service'
import { TrelloApi } from '@trello-v2/shared'
import { AuthGuard, KeycloakConnectModule } from 'nest-keycloak-connect'
import { KeycloakConfigService } from '@app/common/auth/auth.service'
import { AuthModule } from '@app/common/auth/auth.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { MongooseModule } from '@nestjs/mongoose'
import { CardlistModule } from '../cardlist.module'
import { CardModule } from '../../card/card.module'
import { APP_GUARD } from '@nestjs/core'
import { UserInfoDto } from '@app/common/auth/user-info.dto'

describe('CardlistController', () => {
  let controller: CardlistController
  let service: CardlistService
  let mockService: CardlistServiceMock

  const mockCardlists = {
    _id: '660a78f3f0ab0c0a48462940',
    board_id: '660a78e61caeb6c40db4f9a1',
    index: 0,
    name: 'card list 1',
    watcher_email: ['long@gmail.com'],
    archive_at: null,
    created_at: '2024-04-01T09:05:55.806Z',
    cards: [
      {
        name: 'Card AXC',
        index: 0,
        watcher_email: ['long@gmail.com'],
        archive_at: null,
        activities: [],
        features: [],
        created_at: '2024-04-01T10:03:58.377Z',
        _id: '660a868e929ee1d1cada1289',
        __v: 0,
      },
      {
        name: 'card A',
        index: 1,
        watcher_email: ['long@gmail.com'],
        archive_at: null,
        activities: [],
        features: [],
        created_at: '2024-04-01T09:06:41.497Z',
        _id: '660a7921f0ab0c0a48462950',
        __v: 0,
      },
      {
        name: 'card B',
        index: 2,
        watcher_email: ['long@gmail.com'],
        archive_at: null,
        activities: [],
        features: [],
        created_at: '2024-04-01T09:06:30.402Z',
        _id: '660a7916f0ab0c0a48462949',
        __v: 0,
      },
      {
        name: 'card C',
        index: 3,
        watcher_email: ['long@gmail.com'],
        archive_at: null,
        activities: [],
        features: [],
        created_at: '2024-04-01T09:06:21.043Z',
        _id: '660a790df0ab0c0a48462943',
        __v: 0,
      },
    ],
    __v: 20,
  }

  const mockUser: UserInfoDto = {
    email: 'test@example.com',
    exp: 0,
    iat: 0,
    jti: '',
    iss: '',
    aud: '',
    sub: '',
    typ: '',
    azp: '',
    session_state: '',
    acr: '',
    scope: '',
    sid: '',
    email_verified: false,
    name: '',
    preferred_username: '',
    given_name: '',
    family_name: '',
  }

  const mockCardlistService = {
    getAll: jest.fn().mockResolvedValueOnce([mockCardlists]),
    create: jest.fn().mockResolvedValueOnce(mockCardlists),
    copy: jest.fn().mockResolvedValueOnce(mockCardlists),
    getAllByBoardId: jest.fn().mockResolvedValueOnce([mockCardlists]),
    getAllArchivedByBoardId: jest.fn().mockResolvedValueOnce([mockCardlists]),
    getAllNonArchivedByBoardId: jest.fn().mockResolvedValueOnce([mockCardlists]),
    sortByOldestDate: jest.fn().mockResolvedValueOnce(mockCardlists),
    sortByNewestDate: jest.fn().mockResolvedValueOnce(mockCardlists),
    sortByName: jest.fn().mockResolvedValueOnce(mockCardlists),
    sortCardsByOldestDate: jest.fn().mockResolvedValueOnce(mockCardlists),
    sortCardsByNewestDate: jest.fn().mockResolvedValueOnce(mockCardlists),
    sortCardsByName: jest.fn().mockResolvedValueOnce(mockCardlists),
    update: jest.fn().mockResolvedValueOnce(mockCardlists),
    move: jest.fn().mockResolvedValueOnce(mockCardlists),
    archiveCardsInList: jest.fn().mockResolvedValueOnce(mockCardlists),
    archiveCardList: jest.fn().mockResolvedValueOnce(mockCardlists),
    addWatcher: jest.fn().mockResolvedValueOnce(mockCardlists),
    addCardToList: jest.fn().mockResolvedValueOnce(mockCardlists),
    cloneCardlistsByBoard: jest.fn().mockResolvedValueOnce([mockCardlists]),
    deleteCardlistsByBoardId: jest.fn().mockResolvedValueOnce({ result: '' }),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        KeycloakConnectModule.registerAsync({
          useExisting: KeycloakConfigService,
          imports: [AuthModule],
        }),
        ServeStaticModule.forRoot({
          rootPath: './public',
          serveRoot: '/api/workspace/swagger',
          exclude: ['/api/workspace/swagger/index.html'],
        }),
        MongooseModule.forRoot('mongodb://MONGO_USER:MONGO_123@localhost:7000/trello?authSource=admin'),
        CardlistModule,
        CardModule,
      ],

      controllers: [CardlistController],
      providers: [
        { provide: CardlistService, useValue: mockCardlistService },
        {
          provide: APP_GUARD,
          useClass: AuthGuard,
        },
      ],
    }).compile()

    service = module.get<CardlistService>(CardlistService)
    controller = module.get<CardlistController>(CardlistController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('Cardlist:Get all cardlists', () => {
    it('Return all cardlists', async () => {
      const data = await controller.getAll()
      // expect(TrelloApi.CardlistApi.GetallCardlistResponseSchema.safeParse(data).success).toBeTruthy()
      expect(service.getAllCardlist).toHaveBeenCalled()
      expect(data).toEqual({ data: service.getAllCardlist() })
    })
  })

  describe('create', () => {
    it('should create a new cardlist', async () => {
      const mockRequest: TrelloApi.CardlistApi.CreateCardlistRequest = {
        board_id: 'string',
        index: 0,
        name: 'string',
        watcher_email: [mockUser.email],
      }
      // jest.spyOn(service, 'createCardlist').mockResolvedValueOnce(mockRequest)
      const data = await controller.create(mockRequest, mockUser)

      expect(service.createCardlist).toHaveBeenCalledWith(mockRequest)
      expect(data).toEqual({ data: mockService.createCardlist(mockRequest) })
    })
  })

  describe('copy', () => {
    it('should copy a cardlist', async () => {
      const mockRequest: TrelloApi.CardlistApi.CopyCardlistRequest = {
        _id: 'string',
        created_at: new Date(),
        created_by: mockUser.email,
      }
      // jest.spyOn(service, 'copyCardlist').mockResolvedValueOnce(mockRequest)

      const data = await controller.copy(mockRequest, mockUser)

      expect(service.copyCardlist).toHaveBeenCalledWith(mockRequest)
      expect(data).toEqual({ data: mockService.copyCardlist(mockRequest) })
    })
  })

  describe('getAllByBoardId', () => {
    it('should get all cardlists by board ID', async () => {
      const mockBoardId = 'mockBoardId'
      // const mockResponse: TrelloApi.CardlistApi.GetallCardlistByBoardIdResponse = {
      //   // Provide mock response data here
      // }
      // jest.spyOn(service, 'getAllCardlistByBoardId').mockResolvedValueOnce(mockResponse)

      const data = await controller.getAllByBoardId(mockBoardId)

      expect(service.getAllCardlistByBoardId).toHaveBeenCalledWith(mockBoardId)
      expect(data).toEqual({ data: mockService.getAllCardlistByBoardId(mockBoardId) })
    })
  })

  describe('getAllArchivedByBoardId', () => {
    it('should get all archived cardlists by board ID', async () => {
      const mockBoardId = 'mockBoardId'
      // const mockResponse: TrelloApi.CardlistApi.GetallCardlistArchivedByBoardIdResponse = {
      //   // Provide mock response data here
      // }
      // jest.spyOn(service, 'getAllCardlistArchivedByBoardId').mockResolvedValueOnce(mockResponse)
      const data = await controller.getAllArchivedByBoardId(mockBoardId)

      expect(service.getAllCardlistArchivedByBoardId).toHaveBeenCalledWith(mockBoardId)
      expect(data).toEqual({ data: mockService.getAllCardlistArchivedByBoardId(mockBoardId) })
      // expect(data).toEqual({ data: [mockCardlists] })
    })
  })

  describe('getAllNonArchivedByBoardId', () => {
    it('should get all non-archived cardlists by board ID', async () => {
      const mockBoardId = 'mockBoardId'
      // const mockResponse: TrelloApi.CardlistApi.GetallCardlistNonArchivedByBoardIdResponse = {
      //   // Provide mock response data here
      // }
      // jest.spyOn(service, 'getAllCardlistNonArchivedByBoardId').mockResolvedValueOnce(mockResponse)
      const data = await controller.getAllNonArchivedByBoardId(mockBoardId)

      expect(service.getAllCardlistNonArchivedByBoardId).toHaveBeenCalledWith(mockBoardId)
      expect(data).toEqual({ data: mockService.getAllCardlistNonArchivedByBoardId(mockBoardId) })
      // expect(data).toEqual({ data: [mockCardlists] })
    })
  })

  describe('sortByOldestDate', () => {
    it('should sort cardlists by oldest date', async () => {
      const mockBoardId = 'mockBoardId'
      // const mockResponse: TrelloApi.CardlistApi.SortCardlistByOldestDateResponse = {
      //   // Provide mock response data here
      // }
      // jest.spyOn(service, 'sortCardlistByOldestDate').mockResolvedValueOnce(mockResponse)

      const data = await controller.sortByOldestDate(mockBoardId)

      expect(service.sortCardlistByOldestDate).toHaveBeenCalledWith(mockBoardId)
      // expect(data).toEqual({ data: mockCardlists })
      expect(data).toEqual({ data: mockService.sortCardlistByOldestDate(mockBoardId) })
    })
  })

  describe('sortByNewestDate', () => {
    it('should sort cardlists by newest date', async () => {
      const mockBoardId = 'mockBoardId'
      // const mockResponse: TrelloApi.CardlistApi.SortCardlistByNewestDateResponse = {
      //   // Provide mock response data here
      // }
      // jest.spyOn(service, 'sortCardlistByNewestDate').mockResolvedValueOnce(mockResponse)

      const data = await controller.sortByNewestDate(mockBoardId)

      expect(service.sortCardlistByNewestDate).toHaveBeenCalledWith(mockBoardId)
      // expect(data).toEqual({ data: mockCardlists })
      expect(data).toEqual({ data: mockService.sortCardlistByNewestDate(mockBoardId) })
    })
  })

  describe('sortByName', () => {
    it('should sort cardlists by name', async () => {
      const mockBoardId = 'mockBoardId'
      // const mockResponse: TrelloApi.CardlistApi.SortCardlistByNameResponse = {
      //   // Provide mock response data here
      // }
      // jest.spyOn(service, 'sortCardlistByName').mockResolvedValueOnce(mockResponse)
      const data = await controller.sortByName(mockBoardId)

      expect(service.sortCardlistByName).toHaveBeenCalledWith(mockBoardId)
      // expect(data).toEqual({ data: mockCardlists })
      expect(data).toEqual({ data: mockService.sortCardlistByName(mockBoardId) })
    })
  })

  describe('sortCardsByOldestDate', () => {
    it('should sort cards by oldest date', async () => {
      const mockCardlistId = 'mockCardlistId'
      // const mockResponse: TrelloApi.CardlistApi.SortCardByOldestDateResponse = {
      //   // Provide mock response data here
      // }
      // jest.spyOn(service, 'sortCardByOldestDate').mockResolvedValueOnce(mockResponse)

      const data = await controller.sortCardsByOldestDate(mockCardlistId)

      expect(service.sortCardByOldestDate).toHaveBeenCalledWith(mockCardlistId)
      // expect(data).toEqual({ data: mockCardlists })
      expect(data).toEqual({ data: mockService.sortCardByOldestDate(mockCardlistId) })
    })
  })

  describe('sortCardsByNewestDate', () => {
    it('should sort cards by newest date', async () => {
      const mockCardlistId = 'mockCardlistId'
      // const mockResponse: TrelloApi.CardlistApi.SortCardByNewestDateResponse = {
      //   // Provide mock response data here
      // }
      // jest.spyOn(service, 'sortCardByNewestDate').mockResolvedValueOnce(mockResponse)
      const data = await controller.sortCardsByNewestDate(mockCardlistId)

      expect(service.sortCardByNewestDate).toHaveBeenCalledWith(mockCardlistId)
      // expect(data).toEqual({ data: mockCardlists })
      expect(data).toEqual({ data: mockService.sortCardByNewestDate(mockCardlistId) })
    })
  })

  describe('sortCardsByName', () => {
    it('should sort cards by name', async () => {
      const mockCardlistId = 'mockCardlistId'
      // const mockResponse: TrelloApi.CardlistApi.SortCardByNameResponse = {
      //   // Provide mock response data here
      // }
      // jest.spyOn(service, 'sortCardByName').mockResolvedValueOnce(mockResponse)
      const data = await controller.sortCardsByName(mockCardlistId)

      expect(service.sortCardByName).toHaveBeenCalledWith(mockCardlistId)
      // expect(data).toEqual({ data: mockCardlists })
      expect(data).toEqual({ data: mockService.sortCardByName(mockCardlistId) })
    })
  })

  describe('update', () => {
    it('should update cardlist', async () => {
      const mockRequest: TrelloApi.CardlistApi.UpdateCardlistRequest = {
        _id: 'string',
        index: 0,
        name: 'string',
        archive_at: new Date(),
      }
      // const mockResponse: TrelloApi.CardlistApi.UpdateCardlistResponse = {
      //   // Provide mock response data here
      // }
      // jest.spyOn(service, 'updateCardlist').mockResolvedValueOnce(mockResponse)

      const data = await controller.update(mockRequest)

      expect(service.updateCardlist).toHaveBeenCalledWith(mockRequest)
      // expect(data).toEqual({ data: mockCardlists })
      expect(data).toEqual({ data: mockService.updateCardlist(mockRequest) })
    })
  })

  describe('move', () => {
    it('should move cardlist', async () => {
      const mockRequest: TrelloApi.CardlistApi.MoveCardlistRequest = {
        _id: 'string',
        index: 0,
        board_id: 'string',
      }
      // const mockResponse: TrelloApi.CardlistApi.MoveCardlistResponse = {
      //   // Provide mock response data here
      // }
      // jest.spyOn(service, 'moveCardlist').mockResolvedValueOnce(mockResponse)
      const data = await controller.move(mockRequest)

      expect(service.moveCardlist).toHaveBeenCalledWith(mockRequest)
      // expect(data).toEqual({ data: mockCardlists })
      expect(data).toEqual({ data: mockService.moveCardlist(mockRequest) })
    })
  })

  describe('archiveCardsInList', () => {
    it('should archive all cards in list', async () => {
      const mockCardlistId = 'mockCardlistId'
      // const mockResponse: TrelloApi.CardlistApi.ArchiveAllCardsInListResponse = {
      //   // Provide mock response data here
      // }
      // jest.spyOn(service, 'archiveCardsInlist').mockResolvedValueOnce(mockResponse)

      const data = await controller.archiveCardsInList(mockCardlistId)

      expect(service.archiveCardsInlist).toHaveBeenCalledWith(mockCardlistId)
      // expect(data).toEqual({ data: mockCardlists })
      expect(data).toEqual({ data: mockService.archiveCardsInlist(mockCardlistId) })
    })
  })

  describe('archiveCardList', () => {
    it('should archive card list', async () => {
      const mockCardlistId = 'mockCardlistId'
      // const mockResponse: TrelloApi.CardlistApi.ArchiveCardlistResponse = {
      //   // Provide mock response data here
      // }
      // jest.spyOn(service, 'archiveCardlist').mockResolvedValueOnce(mockResponse)

      const data = await controller.archiveCardList(mockCardlistId)

      expect(service.archiveCardlist).toHaveBeenCalledWith(mockCardlistId)
      // expect(data).toEqual({ data: mockCardlists })
      expect(data).toEqual({ data: mockService.archiveCardlist(mockCardlistId) })
    })
  })

  describe('addWatcher', () => {
    it('should add watcher to card list', async () => {
      const mockRequest: TrelloApi.CardlistApi.AddWatcherRequest = {
        _id: 'string',
        email: 'string',
      }
      // const mockResponse: TrelloApi.CardlistApi.AddWatcherResponse = {
      //   // Provide mock response data here
      // }
      // jest.spyOn(service, 'addWatcher').mockResolvedValueOnce(mockResponse)

      const data = await controller.addWatcher(mockRequest)

      expect(service.addWatcher).toHaveBeenCalledWith(mockRequest)
      // expect(data).toEqual({ data: mockCardlists })
      expect(data).toEqual({ data: mockService.addWatcher(mockRequest) })
    })
  })

  describe('addCardToList', () => {
    it('should add card to card list', async () => {
      const mockRequest: TrelloApi.CardlistApi.AddCardToListRequest = {
        name: 'Card AXC',
        index: 0,
        member_email: [],
        cover: 'string',
        description: 'string',
        cardlist_id: '660a78f3f0ab0c0a48462940',
        watcher_email: [],
      }

      // const mockResponse: TrelloApi.CardlistApi.AddCardToListResponse = {
      //   // Provide mock response data here
      // }
      // jest.spyOn(service, 'addCardToList').mockResolvedValueOnce(mockResponse)

      const data = await controller.addCardToList(mockRequest, mockUser)

      expect(service.addCardToList).toHaveBeenCalledWith(mockRequest)
      // expect(data).toEqual({ data: mockCardlists })
      expect(data).toEqual({ data: mockService.addCardToList(mockRequest) })
    })
  })

  describe('cloneCardlistsByBoard', () => {
    it('should clone cardlists to new board', async () => {
      const mockRequest: TrelloApi.CardlistApi.CloneCardlistsToNewBoardRequest = {
        board_input_id: 'string',
        board_output_id: 'string',
      }
      // const mockResponse: TrelloApi.CardlistApi.CloneCardlistsToNewBoardResponse = {
      //   // Provide mock response data here
      // }
      // jest.spyOn(service, 'cloneCardlistsToNewBoard').mockResolvedValueOnce(mockResponse)

      const data = await controller.cloneCardlistsByBoard(mockRequest)

      expect(service.cloneCardlistsToNewBoard).toHaveBeenCalledWith(mockRequest.board_input_id, mockRequest.board_output_id)
      // expect(data).toEqual({ data: mockCardlists })
      expect(data).toEqual({ data: mockService.cloneCardlistsToNewBoard(mockRequest.board_input_id, mockRequest.board_output_id) })
    })
  })

  describe('deleteCardlistsByBoardId', () => {
    it('should delete cardlists by board id', async () => {
      const mockRequest: TrelloApi.CardlistApi.DeleteCardlistsByBoardIdRequest = {
        board_id: 'string',
      }
      // const mockResult = { result: '' }
      // jest.spyOn(service, 'deleteCardlistsByBoardId').mockResolvedValueOnce(mockResult)

      const data = await controller.deleteCardlistsByBoardId(mockRequest)

      expect(service.deleteCardlistsByBoardId).toHaveBeenCalledWith(mockRequest)
      // expect(data).toEqual({ result: mockResult })
      expect(data).toEqual({ result: mockService.deleteCardlistsByBoardId(mockRequest) })
    })
  })
})
