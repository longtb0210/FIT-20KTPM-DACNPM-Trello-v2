import { AuthenticatedUser, Public } from 'nest-keycloak-connect'

import { UserInfoDto } from '@app/common/auth/user-info.dto'
import { ValidateGrpcInput } from '@app/common/decorators'
import { Controller, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { TrelloApi } from '@trello-v2/shared'

import { WorkspaceService } from '../workspace.service'

@Controller()
export class WorkspaceGrpcController {
  constructor(private workspaceService: WorkspaceService) {}

  @GrpcMethod('WorkspaceController', 'getAll')
  @Public(false)
  async getAll(): Promise<TrelloApi.WorkspaceApi.WorkspaceListResponse> {
    const data = await this.workspaceService.getAllWorkspaces()

    if (!data) throw new NotFoundException("Can't find all of workspace")

    return { data }
  }

  @GrpcMethod('WorkspaceController', 'getAllWorkspacesByEmail')
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

  @GrpcMethod('WorkspaceController', 'getWorkspaceById')
  async getWorkspaceById(
    @ValidateGrpcInput(TrelloApi.WorkspaceApi.WorkspaceIdRequestSchema.safeParse) id: string,
  ): Promise<TrelloApi.WorkspaceApi.WorspaceResponse> {
    const workspace = await this.workspaceService.getWorkspaceById(id)

    return { data: workspace }
  }

  @GrpcMethod('WorkspaceController', 'getAdminWorkspacesByEmail')
  async getAdminWorkspacesByEmail(@AuthenticatedUser() user: UserInfoDto): Promise<TrelloApi.WorkspaceApi.WorkspaceListResponse> {
    const email = user.email

    const workspace = await this.workspaceService.getAdminWorkspacesByEmail(email)

    if (!workspace) return { data: [] }
    return { data: workspace }
  }

  @GrpcMethod('WorkspaceController', 'getGuestWorkspacesByEmail')
  async getGuestWorkspacesByEmail(@AuthenticatedUser() user: UserInfoDto): Promise<TrelloApi.WorkspaceApi.WorkspaceListResponse> {
    const email = user.email

    const workspace = await this.workspaceService.getGuestWorkspacesByEmail(email)

    if (!workspace) return { data: [] }
    return { data: workspace }
  }

  @GrpcMethod('WorkspaceController', 'getMemberWorkspacesByEmail')
  async getMemberWorkspacesByEmail(@AuthenticatedUser() user: UserInfoDto): Promise<TrelloApi.WorkspaceApi.WorkspaceListResponse> {
    const email = user.email

    const workspace = await this.workspaceService.getMemberWorkspacesByEmail(email)

    if (!workspace) return { data: [] }
    return { data: workspace }
  }

  @GrpcMethod('WorkspaceController', 'getOwnerWorkspacesByEmail')
  async getOwnerWorkspacesByEmail(@AuthenticatedUser() user: UserInfoDto): Promise<TrelloApi.WorkspaceApi.WorkspaceListResponse> {
    const email = user.email

    const workspace = await this.workspaceService.getOwnerWorkspacesByEmail(email)

    if (!workspace) return { data: [] }
    return { data: workspace }
  }

  @GrpcMethod('WorkspaceController', 'getPendingWorkspacesByEmail')
  async getPendingWorkspacesByEmail(@AuthenticatedUser() user: UserInfoDto): Promise<TrelloApi.WorkspaceApi.WorkspaceListResponse> {
    const email = user.email

    const workspace = await this.workspaceService.getPendingWorkspacesByEmail(email)

    if (!workspace) return { data: [] }
    return { data: workspace }
  }

  @GrpcMethod('WorkspaceController', 'createWorkspace')
  async createWorkspace(
    @AuthenticatedUser() user: UserInfoDto,
    @ValidateGrpcInput(TrelloApi.WorkspaceApi.CreateWorkspaceRequestSchema.safeParse)
    body: TrelloApi.WorkspaceApi.CreateWorspaceRequest,
  ): Promise<TrelloApi.WorkspaceApi.WorspaceResponse> {
    const workspaceData = await this.workspaceService.createWorkspace(body, user.email)

    if (!workspaceData._id) throw new InternalServerErrorException("Can't create workspace")

    return {
      data: workspaceData,
    }
  }

  @GrpcMethod('WorkspaceController', 'updateWorkspaceInfo')
  async updateWorkspaceInfo(
    @AuthenticatedUser() user: UserInfoDto,
    @ValidateGrpcInput(TrelloApi.WorkspaceApi.UpdateWorkspaceInfoRequestSchema.safeParse)
    body: TrelloApi.WorkspaceApi.UpdateWorkspaceInfoRequest,
  ): Promise<TrelloApi.WorkspaceApi.WorspaceResponse> {
    const workspaceUpdated = await this.workspaceService.updateWorkspaceInfo(body, user)

    if (!workspaceUpdated) throw new InternalServerErrorException("Can't update workspace infomation")

    return { data: workspaceUpdated }
  }

  @GrpcMethod('WorkspaceController', 'changeWorkspaceVisibility')
  async changeWorkspaceVisibility(
    @AuthenticatedUser() user: UserInfoDto,
    @ValidateGrpcInput(TrelloApi.WorkspaceApi.ChangeWorkspaceVisibilityRequestSchema.safeParse)
    body: TrelloApi.WorkspaceApi.ChangeWorkspaceVisibilityRequest,
  ): Promise<TrelloApi.WorkspaceApi.WorspaceResponse> {
    const workspaceUpdated = await this.workspaceService.changeWorkspaceVisibility(body, user)

    if (!workspaceUpdated) throw new InternalServerErrorException("Can't update workspace's visibility")

    return { data: workspaceUpdated }
  }

  @GrpcMethod('WorkspaceController', 'deleteWorkspaceById')
  async deleteWorkspaceById(
    @AuthenticatedUser() user: UserInfoDto,
    @ValidateGrpcInput(TrelloApi.WorkspaceApi.WorkspaceIdRequestSchema.safeParse) id: string,
  ) {
    const res = await this.workspaceService.deleteWorkspaceById(id, user)

    return {
      data: { workspace_id: res },
    }
  }

  @GrpcMethod('WorkspaceController', 'inviteMembers2Workspace')
  async inviteMembers2Workspace(
    @AuthenticatedUser() user: UserInfoDto,
    @ValidateGrpcInput(TrelloApi.WorkspaceApi.InviteMembers2WorkspaceRequestSchema.safeParse)
    body: TrelloApi.WorkspaceApi.InviteMembers2WorkspaceRequest,
    @ValidateGrpcInput(TrelloApi.WorkspaceApi.WorkspaceIdRequestSchema.safeParse) id: string,
  ): Promise<TrelloApi.WorkspaceApi.WorspaceResponse> {
    const res = await this.workspaceService.inviteMembers2Workspace(body, user, id)

    return {
      data: res,
    }
  }
}
