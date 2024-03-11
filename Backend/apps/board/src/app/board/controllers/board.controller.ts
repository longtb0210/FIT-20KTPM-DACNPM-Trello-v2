import { InjectController, InjectRoute } from '@app/common/decorators'
import { SwaggerApi } from '@app/common/decorators/'
import { IdParamValidationPipe, ZodValidationPipe } from '@app/common/pipes'
import { Body, Param } from '@nestjs/common'
import { getSchemaPath } from '@nestjs/swagger'
import { TrelloApi } from '@trello-v2/shared'

import { BoardRoutes } from '../board.routes'
import { BoardService } from '../services/board.service'

@InjectController({
  name: 'board',
  isCore: true,
})
export class BoardController {
  constructor(private BoardService: BoardService) {}

  @InjectRoute(BoardRoutes.getAllBoard)
  @SwaggerApi({
    responses: [
      {
        status: 200,
        schema: { $ref: getSchemaPath('GetallBoardResponseSchema') },
      },
    ],
  })
  async getAll(): Promise<TrelloApi.BoardApi.GetallBoardResponse> {
    const data = await this.BoardService.getAllBoard()
    return {
      data: data,
    }
  }

  @InjectRoute(BoardRoutes.getBoardsByWorkspaceId)
  @SwaggerApi({
    params: {
      name: 'workspace_id',
      type: 'string',
      example: 'string',
    },
    responses: [
      {
        status: 200,
        schema: { $ref: getSchemaPath('GetallBoardResponseSchema') },
      },
    ],
  })
  async getBoardsByWorkSpaceId(
    @Param('workspace_id', IdParamValidationPipe)
    workspace_id: TrelloApi.BoardApi.getBoardsByWorkspaceIdRequest,
  ): Promise<TrelloApi.BoardApi.GetallBoardResponse> {
    const data = await this.BoardService.getBoardsByWorkspaceId(workspace_id)
    return {
      data: data,
    }
  }

  @InjectRoute(BoardRoutes.createBoard)
  @SwaggerApi({
    body: { schema: { $ref: getSchemaPath('CreateBoardRequestSchema') } },
    responses: [
      {
        status: 200,
        schema: { $ref: getSchemaPath('CreateBoardResponseSchema') },
      },
    ],
  })
  async create(
    @Body(new ZodValidationPipe(TrelloApi.BoardApi.CreateBoardRequestSchema))
    body: TrelloApi.BoardApi.CreateBoard,
  ): Promise<TrelloApi.BoardApi.CreateBoardResponse> {
    const data = await this.BoardService.createBoard(body)
    return {
      data: data,
    }
  }

  @InjectRoute(BoardRoutes.getBoardInfoByBoardId)
  @SwaggerApi({
    params: {
      name: 'board_id',
      type: 'string',
      example: 'string',
    },
    responses: [
      {
        status: 200,
        schema: { $ref: getSchemaPath('GetBoardInfoByBoardIdResponseSchema') },
      },
    ],
  })
  async getBoardInfoByBoardId(
    @Param('board_id', IdParamValidationPipe)
    board_id: TrelloApi.BoardApi.GetBoardInfoByBoardIdRequest,
  ): Promise<TrelloApi.BoardApi.GetBoardInfoByBoardIdResponse | unknown> {
    const data = await this.BoardService.getBoardInfoByBoardId(board_id)
    return {
      data: data,
    }
  }

  @InjectRoute(BoardRoutes.changeBoardVisibility)
  @SwaggerApi({
    body: {
      schema: { $ref: getSchemaPath('ChangeBoardVisibilityRequestSchema') },
    },
    responses: [
      {
        status: 200,
        schema: { $ref: getSchemaPath('GetBoardInfoByBoardIdResponseSchema') },
      },
    ],
  })
  async changeBoardVisibility(
    @Body(new ZodValidationPipe(TrelloApi.BoardApi.ChangeBoardVisibilityRequestSchema))
    body: TrelloApi.BoardApi.ChangeBoardVisibilityRequest,
  ): Promise<TrelloApi.BoardApi.ChangeBoardVisibilityResponse | unknown> {
    const data = await this.BoardService.updateBoard(body)
    return {
      data: data,
    }
  }

  @InjectRoute(BoardRoutes.deleteBoard)
  @SwaggerApi({
    params: {
      name: 'board_id',
      type: 'string',
      example: 'string',
    },
    responses: [
      {
        status: 200,
        schema: { $ref: getSchemaPath('DeleteBoardResponseSchema') },
      },
    ],
  })
  async deleteBoard(
    @Param('board_id', IdParamValidationPipe)
    board_id: TrelloApi.BoardApi.DeleteBoardRequest,
  ): Promise<TrelloApi.BoardApi.DeleteBoardResponse | unknown> {
    const data = await this.BoardService.deleteBoard(board_id)
    return {
      data: data,
    }
  }
}
