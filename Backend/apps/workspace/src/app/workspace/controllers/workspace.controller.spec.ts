import { AuthGuard, KeycloakConnectModule } from 'nest-keycloak-connect'

import { AuthModule } from '@app/common/auth/auth.module'
import { KeycloakConfigService } from '@app/common/auth/auth.service'
import { UserInfoDto } from '@app/common/auth/user-info.dto'
import { MemberMModule, WorkspaceMModule } from '@app/common/database/modules'
import { APP_GUARD } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
import { ServeStaticModule } from '@nestjs/serve-static'
import { Test, TestingModule } from '@nestjs/testing'
import { DbSchemas } from '@trello-v2/shared'

import { WorkspaceService } from '../workspace.service'
import { WorkspaceController } from './workspace.controller'

describe('WorkspaceController', () => {
  let controller: WorkspaceController
  let service: WorkspaceService

  const mockWorkspace = {
    _id: '6609a696d80c45298f8c129f',
    name: 'test',
    short_name: 'test',
    description: 'test',
    website: 'test',
    logo: 'test',
    visibility: DbSchemas.WorkspaceSchema.VISIBILITY_WORKSPACE.public,
    members: [
      {
        status: 'owner',
        role: 'admin',
        email: 'long@gmail.com',
        _id: '6609a696d80c45298f8c129e',
      },
    ],
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
    'allowed-origins': [],
    realm_access: {
      roles: [],
    },
    resource_access: {
      account: {
        roles: [],
      },
    },
    scope: '',
    sid: '',
    email_verified: false,
    name: '',
    preferred_username: '',
    given_name: '',
    family_name: '',
  }

  const mockWorkspaceService = {
    getWorkspaceById: jest.fn().mockResolvedValueOnce(mockWorkspace),
    getAllWorkspaces: jest.fn().mockResolvedValueOnce([mockWorkspace]),
    getOwnerWorkspacesByEmail: jest.fn().mockResolvedValueOnce([mockWorkspace]),
    getAdminWorkspacesByEmail: jest.fn().mockResolvedValueOnce([]),
    getMemberWorkspacesByEmail: jest.fn().mockResolvedValueOnce([]),
    getGuestWorkspacesByEmail: jest.fn().mockResolvedValueOnce([]),
    getPendingWorkspacesByEmail: jest.fn().mockResolvedValueOnce([]),
    createWorkspace: jest.fn().mockResolvedValueOnce(mockWorkspace),
    changeWorkspaceVisibility: jest.fn().mockResolvedValueOnce(mockWorkspace),
    updateWorkspaceInfo: jest.fn().mockResolvedValueOnce(mockWorkspace),
    deleteWorkspaceById: jest.fn().mockResolvedValueOnce(mockWorkspace._id),
    inviteMembers2Workspace: jest.fn().mockResolvedValueOnce(mockWorkspace),
    inviteMember: jest.fn().mockResolvedValueOnce(mockWorkspace.members[0]),
    isAdminRoleWorkspace: jest.fn().mockResolvedValueOnce(true),
    checkWorkspaceExisted: jest.fn(),
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
        MemberMModule,
        WorkspaceMModule,
      ],

      controllers: [WorkspaceController],
      providers: [
        { provide: WorkspaceService, useValue: mockWorkspaceService },
        {
          provide: APP_GUARD,
          useClass: AuthGuard,
        },
      ],
    }).compile()

    service = module.get<WorkspaceService>(WorkspaceService)
    controller = module.get<WorkspaceController>(WorkspaceController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('Workspace: Get workspace by id', () => {
    it('should return workspace by id', async () => {
      const result = await controller.getWorkspaceById(mockWorkspace._id)

      expect(service.getWorkspaceById).toHaveBeenCalled()
      expect(result).toEqual({ data: mockWorkspace })
    })
  })

  describe('Workspace: Get all workspaces', () => {
    it('should return all workspaces', async () => {
      const result = await controller.getAll()

      expect(service.getAllWorkspaces).toHaveBeenCalled()
      expect(result).toEqual({ data: [mockWorkspace] })
    })
  })

  describe('Workspace: get all workspaces by email', () => {
    it('should return all workspaces by email', async () => {
      const result = await controller.getAllWorkspacesByEmail(mockUser)

      const data = {
        data: {
          owner: [mockWorkspace],
          admin: [],
          member: [],
          guest: [],
        },
      }

      expect(service.getOwnerWorkspacesByEmail).toHaveBeenCalled()
      expect(service.getAdminWorkspacesByEmail).toHaveBeenCalled()
      expect(service.getMemberWorkspacesByEmail).toHaveBeenCalled()
      expect(service.getGuestWorkspacesByEmail).toHaveBeenCalled()
      expect(result).toEqual(data)
    })
  })

  describe('Workspace: get admin workspaces by email', () => {
    it('should return admin workspaces by email', async () => {
      const result = await controller.getAdminWorkspacesByEmail(mockUser)

      expect(service.getAdminWorkspacesByEmail).toHaveBeenCalled()

      expect(result).toEqual({ data: [] })
    })
  })

  describe('Workspace: get guest workspaces by email', () => {
    it('should return guest workspaces by email', async () => {
      const result = await controller.getGuestWorkspacesByEmail(mockUser)

      expect(service.getGuestWorkspacesByEmail).toHaveBeenCalled()

      expect(result).toEqual({ data: [] })
    })
  })

  describe('Workspace: get member workspaces by email', () => {
    it('should return member workspaces by email', async () => {
      const result = await controller.getMemberWorkspacesByEmail(mockUser)

      expect(service.getMemberWorkspacesByEmail).toHaveBeenCalled()

      expect(result).toEqual({ data: [] })
    })
  })

  describe('Workspace: get owner workspaces by email', () => {
    it('should return owner workspaces by email', async () => {
      const result = await controller.getOwnerWorkspacesByEmail(mockUser)

      expect(service.getOwnerWorkspacesByEmail).toHaveBeenCalled()

      expect(result).toEqual({ data: [] })
    })
  })

  describe('Workspace: get pending workspaces by email', () => {
    it('should return pending workspaces by email', async () => {
      const result = await controller.getPendingWorkspacesByEmail(mockUser)

      expect(service.getPendingWorkspacesByEmail).toHaveBeenCalled()

      expect(result).toEqual({ data: [] })
    })
  })

  describe('Workspace: create workspace', () => {
    it('should create workspace', async () => {
      const result = await controller.createWorkspace(mockUser, mockWorkspace)

      expect(service.createWorkspace).toHaveBeenCalled()

      expect(result).toEqual({ data: mockWorkspace })
    })
  })

  describe('Workspace: change workspace visibility', () => {
    it('should change workspace visibility', async () => {
      const result = await controller.changeWorkspaceVisibility(mockUser, mockWorkspace)

      expect(service.changeWorkspaceVisibility).toHaveBeenCalled()

      expect(result).toEqual({ data: mockWorkspace })
    })
  })

  describe('Workspace: update workspace info', () => {
    it('should update workspace info', async () => {
      const result = await controller.updateWorkspaceInfo(mockUser, mockWorkspace)

      expect(service.updateWorkspaceInfo).toHaveBeenCalled()

      expect(result).toEqual({ data: mockWorkspace })
    })
  })

  describe('Workspace: delete workspace by id', () => {
    it('should delete workspace by id', async () => {
      const result = await controller.deleteWorkspaceById(mockUser, mockWorkspace._id)

      expect(service.deleteWorkspaceById).toHaveBeenCalled()

      expect(result).toEqual({ data: { workspace_id: mockWorkspace._id } })
    })
  })

  describe('Workspace: invite members to workspace', () => {
    it('should invite members to workspace', async () => {
      const result = await controller.inviteMembers2Workspace(mockUser, mockWorkspace, mockWorkspace._id)

      expect(service.inviteMembers2Workspace).toHaveBeenCalled()

      expect(result).toEqual({ data: mockWorkspace })
    })
  })
})
