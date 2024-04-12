import { MemberMModule, WorkspaceMModule } from '@app/common/database/modules'
import { Module } from '@nestjs/common'

import { WorkspaceController } from './controllers/workspace.controller'
import { WorkspaceGrpcController } from './controllers/workspace.grpc.controller'
import { WorkspaceService } from './workspace.service'

@Module({
  imports: [WorkspaceMModule, MemberMModule],
  controllers: [WorkspaceController, WorkspaceGrpcController],
  providers: [WorkspaceService],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
