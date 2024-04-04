import { AuthenticatedUser, Public } from 'nest-keycloak-connect'

import { UserInfoDto } from '@app/common/auth/user-info.dto'
import { InjectController, InjectRoute, SwaggerApi } from '@app/common/decorators'
import { IdParamValidationPipe, ZodValidationPipe } from '@app/common/pipes'
import { Body, HttpStatus, InternalServerErrorException, NotFoundException, Param } from '@nestjs/common'
import { getSchemaPath } from '@nestjs/swagger'
import { TrelloApi } from '@trello-v2/shared'

import workspaceRoutes from '../workspace.routes'
import { WorkspaceService } from '../workspace.service'

@InjectController({
  name: workspaceRoutes.index,
})
export class WorkspaceController {
  constructor(private workspaceService: WorkspaceService) {}

  @InjectRoute(workspaceRoutes.getAll)
  @SwaggerApi({
    responses: [{ status: HttpStatus.OK, schema: { $ref: getSchemaPath('WorkspaceListResponseSchema') } }],
  })
  @Public(false)
  async getAll(): Promise<TrelloApi.WorkspaceApi.WorkspaceListResponse> {
    const data = await this.workspaceService.getAllWorkspaces()

    if (!data) throw new NotFoundException("Can't find all of workspace")

    return { data }
  }

  @InjectRoute(workspaceRoutes.getAllWorkspacesByEmail)
  @SwaggerApi({
    responses: [{ status: HttpStatus.OK, schema: { $ref: getSchemaPath('WorkspaceListByEmailResponseSchema') } }],
  })
  async getAllWorkspacesByEmail(@AuthenticatedUser() user: UserInfoDto): Promise<TrelloApi.WorkspaceApi.WorkspaceListByEmailResponse> {
    const email = user.email

    const owner = (await this.workspaceService.getOwnerWorkspacesByEmail(email)) ?? []
    const admin = (await this.workspaceService.getAdminWorkspacesByEmail(email)) ?? []
    const member = (await this.workspaceService.getMemberWorkspacesByEmail(email)) ?? []
    const guest = (await this.workspaceService.getGuestWorkspacesByEmail(email)) ?? []

    return {
      data: {
        owner,
        admin,
        member,
        guest,
      },
    }
  }

  @InjectRoute(workspaceRoutes.getWorkspaceById)
  @SwaggerApi({
    responses: [{ status: HttpStatus.OK, schema: { $ref: getSchemaPath('WorkspaceListResponseSchema') } }],
  })
  async getWorkspaceById(
    @Param('id', IdParamValidationPipe)
    id: string,
  ): Promise<TrelloApi.WorkspaceApi.WorkspaceResponse> {
    const workspace = await this.workspaceService.getWorkspaceById(id)

    return { data: workspace }
  }

  @InjectRoute(workspaceRoutes.getAdminWorkspacesByEmail)
  @SwaggerApi({
    responses: [{ status: HttpStatus.OK, schema: { $ref: getSchemaPath('WorkspaceListResponseSchema') } }],
  })
  async getAdminWorkspacesByEmail(@AuthenticatedUser() user: UserInfoDto): Promise<TrelloApi.WorkspaceApi.WorkspaceListResponse> {
    const email = user.email

    const workspace = await this.workspaceService.getAdminWorkspacesByEmail(email)

    if (!workspace) return { data: [] }
    return { data: workspace }
  }

  @InjectRoute(workspaceRoutes.getGuestWorkspacesByEmail)
  @SwaggerApi({
    responses: [{ status: HttpStatus.OK, schema: { $ref: getSchemaPath('WorkspaceListResponseSchema') } }],
  })
  async getGuestWorkspacesByEmail(@AuthenticatedUser() user: UserInfoDto): Promise<TrelloApi.WorkspaceApi.WorkspaceListResponse> {
    const email = user.email

    const workspace = await this.workspaceService.getGuestWorkspacesByEmail(email)

    if (!workspace) return { data: [] }
    return { data: workspace }
  }

  @InjectRoute(workspaceRoutes.getMemberWorkspacesByEmail)
  @SwaggerApi({
    responses: [{ status: HttpStatus.OK, schema: { $ref: getSchemaPath('WorkspaceListResponseSchema') } }],
  })
  async getMemberWorkspacesByEmail(@AuthenticatedUser() user: UserInfoDto): Promise<TrelloApi.WorkspaceApi.WorkspaceListResponse> {
    const email = user.email

    const workspace = await this.workspaceService.getMemberWorkspacesByEmail(email)

    if (!workspace) return { data: [] }
    return { data: workspace }
  }

  @InjectRoute(workspaceRoutes.getOwnerWorkspacesByEmail)
  @SwaggerApi({
    responses: [{ status: HttpStatus.OK, schema: { $ref: getSchemaPath('WorkspaceListResponseSchema') } }],
  })
  async getOwnerWorkspacesByEmail(@AuthenticatedUser() user: UserInfoDto): Promise<TrelloApi.WorkspaceApi.WorkspaceListResponse> {
    const email = user.email

    const workspace = await this.workspaceService.getOwnerWorkspacesByEmail(email)

    if (!workspace) return { data: [] }
    return { data: workspace }
  }

  @InjectRoute(workspaceRoutes.getPendingWorkspacesByEmail)
  @SwaggerApi({
    responses: [{ status: HttpStatus.OK, schema: { $ref: getSchemaPath('WorkspaceListResponseSchema') } }],
  })
  async getPendingWorkspacesByEmail(@AuthenticatedUser() user: UserInfoDto): Promise<TrelloApi.WorkspaceApi.WorkspaceListResponse> {
    const email = user.email

    const workspace = await this.workspaceService.getPendingWorkspacesByEmail(email)

    if (!workspace) return { data: [] }
    return { data: workspace }
  }

  @InjectRoute(workspaceRoutes.createWorkspace)
  @SwaggerApi({
    body: {
      schema: { $ref: getSchemaPath('CreateWorkspaceRequestSchema') },
    },
    responses: [{ status: HttpStatus.OK, schema: { $ref: getSchemaPath('WorkspaceResponseSchema') } }],
  })
  async createWorkspace(
    @AuthenticatedUser() user: UserInfoDto,
    @Body(new ZodValidationPipe(TrelloApi.WorkspaceApi.CreateWorkspaceRequestSchema))
    body: TrelloApi.WorkspaceApi.CreateWorkspaceRequest,
  ): Promise<TrelloApi.WorkspaceApi.WorkspaceResponse> {
    const workspaceData = await this.workspaceService.createWorkspace(body, user.email)

    if (!workspaceData._id) throw new InternalServerErrorException("Can't create workspace")

    return {
      data: workspaceData,
    }
  }

  @InjectRoute(workspaceRoutes.updateWorkspaceInfo)
  @SwaggerApi({
    body: {
      schema: { $ref: getSchemaPath('UpdateWorkspaceInfoRequestSchema') },
    },
    responses: [{ status: HttpStatus.OK, schema: { $ref: getSchemaPath('WorkspaceResponseSchema') } }],
  })
  async updateWorkspaceInfo(
    @AuthenticatedUser() user: UserInfoDto,
    @Body(new ZodValidationPipe(TrelloApi.WorkspaceApi.UpdateWorkspaceInfoRequestSchema))
    body: TrelloApi.WorkspaceApi.UpdateWorkspaceInfoRequest,
  ): Promise<TrelloApi.WorkspaceApi.WorkspaceResponse> {
    const workspaceUpdated = await this.workspaceService.updateWorkspaceInfo(body, user)

    if (!workspaceUpdated) throw new InternalServerErrorException("Can't update workspace infomation")

    return { data: workspaceUpdated }
  }

  @InjectRoute(workspaceRoutes.changeWorkspaceVisibility)
  @SwaggerApi({
    body: {
      schema: { $ref: getSchemaPath('ChangeWorkspaceVisibilityRequestSchema') },
    },
    responses: [{ status: HttpStatus.OK, schema: { $ref: getSchemaPath('WorkspaceResponseSchema') } }],
  })
  async changeWorkspaceVisibility(
    @AuthenticatedUser() user: UserInfoDto,
    @Body(new ZodValidationPipe(TrelloApi.WorkspaceApi.ChangeWorkspaceVisibilityRequestSchema))
    body: TrelloApi.WorkspaceApi.ChangeWorkspaceVisibilityRequest,
  ): Promise<TrelloApi.WorkspaceApi.WorkspaceResponse> {
    const workspaceUpdated = await this.workspaceService.changeWorkspaceVisibility(body, user)

    if (!workspaceUpdated) throw new InternalServerErrorException("Can't update workspace's visibility")

    return { data: workspaceUpdated }
  }

  @InjectRoute(workspaceRoutes.deleteWorkspaceById)
  @SwaggerApi({
    responses: [{ status: HttpStatus.OK, schema: { $ref: getSchemaPath('WorkspaceDeleteResponseSchema') } }],
  })
  async deleteWorkspaceById(
    @AuthenticatedUser() user: UserInfoDto,
    @Param('id', IdParamValidationPipe)
    id: string,
  ): Promise<TrelloApi.WorkspaceApi.WorkspaceDeleteResponse> {
    const res = await this.workspaceService.deleteWorkspaceById(id, user)

    return {
      data: { workspace_id: res },
    }
  }

  @InjectRoute(workspaceRoutes.inviteMembers2Workspace)
  @SwaggerApi({
    responses: [{ status: HttpStatus.OK, schema: { $ref: getSchemaPath('WorkspaceResponseSchema') } }],
  })
  async inviteMembers2Workspace(
    @AuthenticatedUser() user: UserInfoDto,
    @Body(new ZodValidationPipe(TrelloApi.WorkspaceApi.InviteMembers2WorkspaceRequestSchema))
    body: TrelloApi.WorkspaceApi.InviteMembers2WorkspaceRequest,
    @Param('id', IdParamValidationPipe)
    id: string,
  ): Promise<TrelloApi.WorkspaceApi.WorkspaceResponse> {
    const res = await this.workspaceService.inviteMembers2Workspace(body, user, id)

    return {
      data: res,
    }
  }
}
