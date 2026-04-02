import { CanActivate, ExecutionContext, Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class WorkspaceMemberGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    // Extract workspaceId from header or body/query
    const workspaceId = request.headers['x-workspace-id'] || request.query.workspaceId || request.body.workspaceId;

    if (!workspaceId) {
      throw new BadRequestException('Missing Workspace ID');
    }

    if (!user) {
      throw new ForbiddenException('Not Authenticated');
    }

    const membership = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: user.id,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException('You do not belong to this workspace');
    }

    // Attach workspaceId to request for easy access in decorators
    request.workspaceId = workspaceId;

    return true;
  }
}
