import { Test } from '@nestjs/testing'
import { BoardController } from './board.controller'
import { BoardService, BoardServiceMock } from '../services/board.service'
import { TrelloApi } from '@trello-v2/shared'
import { Types } from 'mongoose'

describe('BoardController', () => {
  let controller: BoardController

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [BoardController],
      providers: [BoardService],
    })
      .overrideProvider(BoardService)
      .useValue(new BoardServiceMock())
      .compile()

    controller = moduleRef.get(BoardController)
  })

  describe('Board:Get all boards', () => {
    it('Return all boards', async () => {
      const data = await controller.getAll()
      expect(TrelloApi.BoardApi.GetallBoardResponseSchema.safeParse(data).success).toBeTruthy()
    })
  })

  describe('Board:Get boards by workspace_id', () => {
    it('Return boards by workspace_id', async () => {
      const data = await controller.getBoardsByWorkSpaceId('any_workspace_id')
      expect(TrelloApi.BoardApi.getBoardsByWorkspaceIdResponseSchema.safeParse(data).success).toBeTruthy()
    })
  })

  describe('Board:Create board', () => {
    it('Return board after create', async () => {
      const body = {
        workspace_id: 'any_workspace_id',
        name: 'any_name',
        visibility: 'private' as const,
        background: 'any_background',
      }
      const data = await controller.createBoard(body)
      expect(TrelloApi.BoardApi.CreateBoardResponseSchema.safeParse(data).success).toBeTruthy()
    })
  })

  describe('Board:Get board by board_id', () => {
    it('Return board by board_id', async () => {
      const data = await controller.getBoardInfoByBoardId(new Types.ObjectId().toString())
      expect(TrelloApi.BoardApi.GetBoardInfoByBoardIdResponseSchema.safeParse(data).success).toBeTruthy()
    })
  })

  describe('Board:Delete board', () => {
    it('Return board after delete', async () => {
      const data = await controller.deleteBoard(new Types.ObjectId().toString())
      expect(TrelloApi.BoardApi.DeleteBoardResponseSchema.safeParse(data).success).toBeTruthy()
    })
  })

  describe('Board:Update board', () => {
    it('Return board after update', async () => {
      const body = {
        _id: new Types.ObjectId().toString(),
        name: 'any_name',
        background: 'any_background',
        is_star: false,
        visibility: 'private' as const,
      }
      const data = await controller.updateBoard(body)
      expect(TrelloApi.BoardApi.GetBoardInfoByBoardIdResponseSchema.safeParse(data).success).toBeTruthy()
    })
  })

  describe('Board:Add member', () => {
    it('Return board after add member', async () => {
      const body = {
        _id: new Types.ObjectId().toString(),
        email: 'any_email',
      }
      const data = await controller.addMember(body)
      expect(TrelloApi.BoardApi.AddMemberResponseSchema.safeParse(data).success).toBeTruthy()
    })
  })

  describe('Board:Remove member', () => {
    it('Return board after remove member', async () => {
      const body = {
        _id: new Types.ObjectId().toString(),
        email: 'any_email',
      }
      const data = await controller.removeMember(body)
      expect(TrelloApi.BoardApi.RemoveMemberResponseSchema.safeParse(data).success).toBeTruthy()
    })
  })

  describe('Board:Add watcher', () => {
    it('Return board after add watcher', async () => {
      const body = {
        _id: new Types.ObjectId().toString(),
        email: 'any_email',
      }
      const data = await controller.addWatcher(body)
      expect(TrelloApi.BoardApi.AddWatcherResponseSchema.safeParse(data).success).toBeTruthy()
    })
  })

  describe('Board:Remove watcher', () => {
    it('Return board after remove watcher', async () => {
      const body = {
        _id: new Types.ObjectId().toString(),
        email: 'any_email',
      }
      const data = await controller.removeWatcher(body)
      expect(TrelloApi.BoardApi.RemoveWatcherResponseSchema.safeParse(data).success).toBeTruthy()
    })
  })

  describe('Board:Add background', () => {
    it('Return board after add background', async () => {
      const mockBg = {
        fieldname: 'background',
        originalname: 'background.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: '/path/to/destination',
        filename: 'background.png',
        path: '/path/to/destination/background.png',
        size: 12345,
      }
      const data = await controller.addBackground(new Types.ObjectId().toString(), mockBg as Express.Multer.File)
      expect(TrelloApi.BoardApi.UpdateBoardResponseSchema.safeParse(data).success).toBeTruthy()
    })
  })

  describe('Board:Remove background', () => {
    it('Return board after remove background', async () => {
      const body = {
        background: 'any_background',
      }
      const data = await controller.removeBackground(new Types.ObjectId().toString(), body)
      expect(TrelloApi.BoardApi.UpdateBoardResponseSchema.safeParse(data).success).toBeTruthy()
    })
  })

  describe('Board:Get all labels by board_id', () => {
    it('Return all labels by board_id', async () => {
      const data = await controller.getLabels(new Types.ObjectId().toString())
      expect(TrelloApi.BoardApi.GetLabelsResponseSchema.safeParse(data).success).toBeTruthy()
    })
  })

  describe('Board:Update label by board_id and label_id', () => {
    it('Return board after update', async () => {
      const body = {
        _id: new Types.ObjectId().toString(),
        color: 'any_color',
        name: 'any_name',
      }
      const data = await controller.updateLabel(new Types.ObjectId().toString(), body)
      expect(TrelloApi.BoardApi.GetBoardInfoByBoardIdResponseSchema.safeParse(data).success).toBeTruthy()
    })
  })

  describe('Board:Add label', () => {
    it('Return board after add label', async () => {
      const body = {
        color: 'any_color',
        name: 'any_name',
      }
      const data = await controller.addLabel(new Types.ObjectId().toString(), body)
      expect(TrelloApi.BoardApi.GetBoardInfoByBoardIdResponseSchema.safeParse(data).success).toBeTruthy()
    })
  })

  describe('Board:Remove label', () => {
    it('Return board after remove label', async () => {
      const body = {
        _id: new Types.ObjectId().toString(),
      }
      const data = await controller.removeLabel(new Types.ObjectId().toString(), body)
      expect(TrelloApi.BoardApi.GetBoardInfoByBoardIdResponseSchema.safeParse(data).success).toBeTruthy()
    })
  })
})
