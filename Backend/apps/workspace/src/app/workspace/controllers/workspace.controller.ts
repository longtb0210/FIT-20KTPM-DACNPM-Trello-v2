import { AuthenticatedUser, Public } from 'nest-keycloak-connect'
import * as os from 'os'

import { UserInfoDto } from '@app/common/auth/user-info.dto'
import { InjectController, InjectRoute } from '@app/common/decorators'
import { IdParamValidationPipe, ZodValidationPipe } from '@app/common/pipes'
import { Body, Get, InternalServerErrorException, NotFoundException, Param } from '@nestjs/common'
import { TrelloApi } from '@trello-v2/shared'

import workspaceRoutes from '../workspace.routes'
import { WorkspaceService } from '../workspace.service'

@InjectController({
  name: workspaceRoutes.index,
})
export class WorkspaceController {
  constructor(private workspaceService: WorkspaceService) {}

  @Get('hostname')
  getHostname(): string {
    return os.hostname()
  }

  @InjectRoute(workspaceRoutes.getAll)
  @Public(false)
  async getAll(): Promise<TrelloApi.WorkspaceApi.WorkspaceListResponse> {
    const data = await this.workspaceService.getAllWorkspaces()

    if (!data) throw new NotFoundException("Can't find all of workspace")

    return { data }
  }

  @InjectRoute(workspaceRoutes.getAllWorkspacesByEmail)
  async getAllWorkspacesByEmail(@AuthenticatedUser() user: UserInfoDto): Promise<TrelloApi.WorkspaceApi.WorspaceListByEmailResponse> {
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
  async getWorkspaceById(
    @Param('id', IdParamValidationPipe)
    id: string,
  ): Promise<TrelloApi.WorkspaceApi.WorspaceResponse> {
    const workspace = await this.workspaceService.getWorkspaceById(id)

    return { data: workspace }
  }

  @InjectRoute(workspaceRoutes.getAdminWorkspacesByEmail)
  async getAdminWorkspacesByEmail(@AuthenticatedUser() user: UserInfoDto): Promise<TrelloApi.WorkspaceApi.WorkspaceListResponse> {
    const email = user.email

    const workspace = await this.workspaceService.getAdminWorkspacesByEmail(email)

    if (!workspace) return { data: [] }
    return { data: workspace }
  }

  @InjectRoute(workspaceRoutes.getGuestWorkspacesByEmail)
  async getGuestWorkspacesByEmail(@AuthenticatedUser() user: UserInfoDto): Promise<TrelloApi.WorkspaceApi.WorkspaceListResponse> {
    const email = user.email

    const workspace = await this.workspaceService.getGuestWorkspacesByEmail(email)

    if (!workspace) return { data: [] }
    return { data: workspace }
  }

  @InjectRoute(workspaceRoutes.getMemberWorkspacesByEmail)
  async getMemberWorkspacesByEmail(@AuthenticatedUser() user: UserInfoDto): Promise<TrelloApi.WorkspaceApi.WorkspaceListResponse> {
    const email = user.email

    const workspace = await this.workspaceService.getMemberWorkspacesByEmail(email)

    if (!workspace) return { data: [] }
    return { data: workspace }
  }

  @InjectRoute(workspaceRoutes.getOwnerWorkspacesByEmail)
  async getOwnerWorkspacesByEmail(@AuthenticatedUser() user: UserInfoDto): Promise<TrelloApi.WorkspaceApi.WorkspaceListResponse> {
    const email = user.email

    const workspace = await this.workspaceService.getOwnerWorkspacesByEmail(email)

    if (!workspace) return { data: [] }
    return { data: workspace }
  }

  @InjectRoute(workspaceRoutes.getPendingWorkspacesByEmail)
  async getPendingWorkspacesByEmail(@AuthenticatedUser() user: UserInfoDto): Promise<TrelloApi.WorkspaceApi.WorkspaceListResponse> {
    const email = user.email

    const workspace = await this.workspaceService.getPendingWorkspacesByEmail(email)

    if (!workspace) return { data: [] }
    return { data: workspace }
  }

  @InjectRoute(workspaceRoutes.createWorkspace)
  async createWorkspace(
    @AuthenticatedUser() user: UserInfoDto,
    @Body(new ZodValidationPipe(TrelloApi.WorkspaceApi.CreateWorkspaceRequestSchema))
    body: TrelloApi.WorkspaceApi.CreateWorspaceRequest,
  ): Promise<TrelloApi.WorkspaceApi.WorspaceResponse> {
    const workspaceData = await this.workspaceService.createWorkspace(body, user.email)

    if (!workspaceData._id) throw new InternalServerErrorException("Can't create workspace")

    return {
      data: workspaceData,
    }
  }

  @InjectRoute(workspaceRoutes.updateWorkspaceInfo)
  async updateWorkspaceInfo(
    @AuthenticatedUser() user: UserInfoDto,
    @Body(new ZodValidationPipe(TrelloApi.WorkspaceApi.UpdateWorkspaceInfoRequestSchema))
    body: TrelloApi.WorkspaceApi.UpdateWorkspaceInfoRequest,
  ): Promise<TrelloApi.WorkspaceApi.WorspaceResponse> {
    const workspaceUpdated = await this.workspaceService.updateWorkspaceInfo(body, user)

    if (!workspaceUpdated) throw new InternalServerErrorException("Can't update workspace infomation")

    return { data: workspaceUpdated }
  }

  @InjectRoute(workspaceRoutes.changeWorkspaceVisibility)
  async changeWorkspaceVisibility(
    @AuthenticatedUser() user: UserInfoDto,
    @Body(new ZodValidationPipe(TrelloApi.WorkspaceApi.ChangeWorkspaceVisibilityRequestSchema))
    body: TrelloApi.WorkspaceApi.ChangeWorkspaceVisibilityRequest,
  ): Promise<TrelloApi.WorkspaceApi.WorspaceResponse> {
    const workspaceUpdated = await this.workspaceService.changeWorkspaceVisibility(body, user)

    if (!workspaceUpdated) throw new InternalServerErrorException("Can't update workspace's visibility")

    return { data: workspaceUpdated }
  }

  @InjectRoute(workspaceRoutes.deleteWorkspaceById)
  async deleteWorkspaceById(
    @AuthenticatedUser() user: UserInfoDto,
    @Param('id', IdParamValidationPipe)
    id: string,
  ) {
    const res = await this.workspaceService.deleteWorkspaceById(id, user)

    return {
      data: { workspace_id: res },
    }
  }

  @InjectRoute(workspaceRoutes.inviteMembers2Workspace)
  async inviteMembers2Workspace(
    @AuthenticatedUser() user: UserInfoDto,
    @Body(new ZodValidationPipe(TrelloApi.WorkspaceApi.InviteMembers2WorkspaceRequestSchema))
    body: TrelloApi.WorkspaceApi.InviteMembers2WorkspaceRequest,
    @Param('id', IdParamValidationPipe)
    id: string,
  ): Promise<TrelloApi.WorkspaceApi.WorspaceResponse> {
    const res = await this.workspaceService.inviteMembers2Workspace(body, user, id)

    return {
      data: res,
    }
  }
}
