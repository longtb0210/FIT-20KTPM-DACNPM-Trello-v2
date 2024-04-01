import { Model } from 'mongoose';

import { UserInfoDto } from '@app/common/auth/user-info.dto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DbSchemas, TrelloApi } from '@trello-v2/shared';

export abstract class IWorkspaceService {
  abstract getWorkspaceById(workspace_id: string): Promise<DbSchemas.WorkspaceSchema.Workspace | null>
  abstract getAllWorkspaces(): Promise<DbSchemas.WorkspaceSchema.Workspace[] | null>
  abstract getOwnerWorkspacesByEmail(email: string): Promise<DbSchemas.WorkspaceSchema.Workspace[] | null>
  abstract getAdminWorkspacesByEmail(email: string): Promise<DbSchemas.WorkspaceSchema.Workspace[] | null>
  abstract getMemberWorkspacesByEmail(email: string): Promise<DbSchemas.WorkspaceSchema.Workspace[] | null>
  abstract getGuestWorkspacesByEmail(email: string): Promise<DbSchemas.WorkspaceSchema.Workspace[] | null>
  abstract getPendingWorkspacesByEmail(email: string): Promise<DbSchemas.WorkspaceSchema.Workspace[] | null>
  abstract createWorkspace(
    body: TrelloApi.WorkspaceApi.CreateWorspaceRequest,
    email_owner: string,
  ): Promise<DbSchemas.WorkspaceSchema.Workspace>
  abstract updateWorkspaceInfo(
    body: TrelloApi.WorkspaceApi.UpdateWorkspaceInfoRequest,
    user: UserInfoDto,
  ): Promise<DbSchemas.WorkspaceSchema.Workspace | null>
  abstract changeWorkspaceVisibility(
    body: TrelloApi.WorkspaceApi.ChangeWorkspaceVisibilityRequest,
    user: UserInfoDto,
  ): Promise<DbSchemas.WorkspaceSchema.Workspace | null>
  abstract deleteWorkspaceById(workspace_id: string, user: UserInfoDto): Promise<string>
  abstract inviteMember(member: DbSchemas.WorkspaceSchema.Member, workspace_id: string): Promise<DbSchemas.WorkspaceSchema.Member>
  abstract inviteMembers2Workspace(
    body: TrelloApi.WorkspaceApi.InviteMembers2WorkspaceRequest,
    user: UserInfoDto,
    workspace_id: string,
  ): Promise<DbSchemas.WorkspaceSchema.Workspace | null>
  abstract isAdminRoleWorkspace(workspace_id: string, email: string): Promise<boolean>
  abstract checkWorkspaceExisted(workspace_id: string): Promise<void>
}

export class WorkspaceService implements IWorkspaceService {
  constructor(
    @InjectModel(DbSchemas.COLLECTION_NAMES[2])
    private readonly workspaceModel: Model<DbSchemas.WorkspaceSchema.Workspace>,
    @InjectModel(DbSchemas.COLLECTION_NAMES[4])
    private readonly memberModel: Model<DbSchemas.WorkspaceSchema.Member>,
  ) {}

  async getWorkspaceById(workspace_id: string): Promise<DbSchemas.WorkspaceSchema.Workspace | null> {
    await this.checkWorkspaceExisted(workspace_id)

    const workspace = await this.workspaceModel.findOne({ _id: workspace_id })

    if (!workspace) return null

    return workspace
  }

  async getAllWorkspaces(): Promise<DbSchemas.WorkspaceSchema.Workspace[] | null> {
    const workspaces = await this.workspaceModel.find().exec()

    if (!workspaces) return null

    return workspaces
  }

  async getOwnerWorkspacesByEmail(_email: string): Promise<DbSchemas.WorkspaceSchema.Workspace[] | null> {
    const workspaces = await this.workspaceModel.aggregate([
      {
        $match: {
          members: {
            $elemMatch: {
              email: _email,
              status: DbSchemas.WorkspaceSchema.STATUS_WORKSPACE.owner,
            },
          },
        },
      },
    ])

    if (!workspaces) return null
    return workspaces
  }

  async getAdminWorkspacesByEmail(email: string): Promise<DbSchemas.WorkspaceSchema.Workspace[] | null> {
    const workspaces = await this.workspaceModel.aggregate([
      {
        $match: {
          members: {
            $elemMatch: {
              email: email,
              status: DbSchemas.WorkspaceSchema.STATUS_WORKSPACE.member,
              role: DbSchemas.WorkspaceSchema.ROLE_WORKSPACE.admin,
            },
          },
        },
      },
    ])

    if (!workspaces) return null

    return workspaces
  }

  async getMemberWorkspacesByEmail(email: string): Promise<DbSchemas.WorkspaceSchema.Workspace[] | null> {
    const workspaces = await this.workspaceModel.aggregate([
      {
        $match: {
          members: {
            $elemMatch: {
              email: email,
              status: DbSchemas.WorkspaceSchema.STATUS_WORKSPACE.member,
              role: DbSchemas.WorkspaceSchema.ROLE_WORKSPACE.member,
            },
          },
        },
      },
    ])

    if (!workspaces) return null

    return workspaces
  }

  async getGuestWorkspacesByEmail(email: string): Promise<DbSchemas.WorkspaceSchema.Workspace[] | null> {
    const workspaces = await this.workspaceModel.aggregate([
      {
        $match: {
          members: {
            $elemMatch: {
              email: email,
              status: DbSchemas.WorkspaceSchema.STATUS_WORKSPACE.guest,
            },
          },
        },
      },
    ])

    if (!workspaces) return null

    return workspaces
  }

  async getPendingWorkspacesByEmail(email: string): Promise<DbSchemas.WorkspaceSchema.Workspace[] | null> {
    return await this.workspaceModel.aggregate([
      {
        $match: {
          members: {
            $elemMatch: {
              email: email,
              status: DbSchemas.WorkspaceSchema.STATUS_WORKSPACE.pending,
            },
          },
        },
      },
    ])
  }

  async createWorkspace(
    body: TrelloApi.WorkspaceApi.CreateWorspaceRequest,
    email_owner: string,
  ): Promise<DbSchemas.WorkspaceSchema.Workspace> {
    const owner = new this.memberModel({
      email: email_owner,
      role: DbSchemas.WorkspaceSchema.ROLE_WORKSPACE.admin,
      status: DbSchemas.WorkspaceSchema.STATUS_WORKSPACE.owner,
    })

    const newWorkspace = new this.workspaceModel({
      ...body,
      visibility: DbSchemas.WorkspaceSchema.VISIBILITY_WORKSPACE.private,
      members: [owner],
    })

    return await newWorkspace.save()
  }

  async changeWorkspaceVisibility(
    body: TrelloApi.WorkspaceApi.ChangeWorkspaceVisibilityRequest,
    user: UserInfoDto,
  ): Promise<DbSchemas.WorkspaceSchema.Workspace | null> {
    await this.checkWorkspaceExisted(body._id)

    const role = await this.isAdminRoleWorkspace(body._id, user.email)

    if (!role) {
      throw new UnauthorizedException('Only the admin role is allowed to change visibility of this workspace')
    }
    const res = await this.workspaceModel
      .findOneAndUpdate({ _id: body._id }, { $set: { visibility: body.visibility } }, { new: true })
      .exec()

    if (!res) return null

    return res.toJSON()
  }

  async updateWorkspaceInfo(
    body: TrelloApi.WorkspaceApi.UpdateWorkspaceInfoRequest,
    user: UserInfoDto,
  ): Promise<DbSchemas.WorkspaceSchema.Workspace | null> {
    await this.checkWorkspaceExisted(body._id)

    const role = await this.isAdminRoleWorkspace(body._id, user.email)

    if (!role) {
      throw new UnauthorizedException('Only the admin role is allowed to update this workspace')
    }

    const res = await this.workspaceModel.findByIdAndUpdate(body._id, body, { new: true }).exec()

    if (!res) return null

    return res.toJSON()
  }

  async deleteWorkspaceById(workspace_id: string, user: UserInfoDto): Promise<string> {
    await this.checkWorkspaceExisted(workspace_id)

    const role = await this.isAdminRoleWorkspace(workspace_id, user.email)

    if (!role) {
      throw new UnauthorizedException('Only the admin role is allowed to delete this workspace')
    }
    await this.workspaceModel.deleteOne({ _id: workspace_id }).exec()

    return workspace_id
  }

  async inviteMembers2Workspace(
    body: TrelloApi.WorkspaceApi.InviteMembers2WorkspaceRequest,
    user: UserInfoDto,
    workspace_id: string,
  ): Promise<DbSchemas.WorkspaceSchema.Workspace | null> {
    await this.getWorkspaceById(workspace_id)

    const role = await this.isAdminRoleWorkspace(workspace_id, user.email)

    if (!role) {
      throw new UnauthorizedException('Only the admin role is allowed to invite members to this workspace')
    }

    for (const member of body.members) {
      if (member.status !== DbSchemas.WorkspaceSchema.STATUS_WORKSPACE.owner) {
        this.inviteMember(member, workspace_id)
      }
    }

    return await this.getWorkspaceById(workspace_id)
  }

  async inviteMember(member: DbSchemas.WorkspaceSchema.Member, workspace_id: string): Promise<DbSchemas.WorkspaceSchema.Member> {
    const memberModel = new this.memberModel({
      ...member,
      status: member.status ?? DbSchemas.WorkspaceSchema.STATUS_WORKSPACE.member,
      role: member.role ?? DbSchemas.WorkspaceSchema.ROLE_WORKSPACE.member,
    })

    const workspace = await this.workspaceModel.findOne({ _id: workspace_id, 'members.email': member.email })

    if (workspace)
      await this.workspaceModel.findOneAndUpdate(
        { _id: workspace_id, 'members.email': member.email },
        { $set: { 'members.$.status': memberModel.status, 'members.$.role': memberModel.role } },
        { new: true },
      )
    else await this.workspaceModel.findByIdAndUpdate(workspace_id, { $push: { members: memberModel } }, { new: true }).exec()

    return memberModel
  }

  async isAdminRoleWorkspace(workspace_id: string, email: string): Promise<boolean> {
    return await this.workspaceModel.findOne({
      _id: workspace_id,
      'members.email': email,
      'members.role': DbSchemas.WorkspaceSchema.ROLE_WORKSPACE.admin,
    })
  }

  async checkWorkspaceExisted(workspace_id: string): Promise<void> {
    const workspace = await this.workspaceModel.findById(workspace_id)
    if (!workspace) throw new NotFoundException('Workspace not found')
  }
}
