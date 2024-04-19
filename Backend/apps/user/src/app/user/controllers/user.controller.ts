import { InjectController, InjectRoute } from '@app/common/decorators'
import { UserService } from '../services/user.service'
import { UserRoutes } from '../user.routes'
import { Body, InternalServerErrorException, NotFoundException, Param } from '@nestjs/common'
import { ZodValidationPipe } from '@app/common/pipes'
import { DbSchemas, TrelloApi } from '@trello-v2/shared'
import { SwaggerApi } from '@app/common/decorators'
import { getSchemaPath } from '@nestjs/swagger'
import { UserGrpcService } from '../services/user.grpc.service'
import { CacheService } from '@app/common/cache'
import { KcAdminService } from '../services/kc.service'

@InjectController({
  name: 'user',
  isCore: true,
})
export class UserController {
  constructor(
    private userService: UserService,
    private userGrpcService: UserGrpcService,
    private cacheService: CacheService.TrelloCacheDbService,
    private kcAdminService: KcAdminService,
  ) {}

  @InjectRoute(UserRoutes.createUser)
  @SwaggerApi({
    secure: false,
    body: {
      schema: { $ref: getSchemaPath('CreateUserRequestSchema') },
    },
    responses: [
      {
        status: 200,
        schema: { $ref: getSchemaPath('CreateUserResponseSchema') },
      },
    ],
  })
  async createUser(
    @Body(new ZodValidationPipe(TrelloApi.UserApi.CreateUserRequestSchema))
    body: TrelloApi.UserApi.CreateUserRequest,
  ): Promise<TrelloApi.UserApi.CreateUserResponse> {
    const user = await this.userService.createUser(body)
    if (!user) throw new InternalServerErrorException("Can't create user")
    return {
      data: user,
    }
  }

  @InjectRoute(UserRoutes.getAllUser)
  @SwaggerApi({
    responses: [
      {
        status: 200,
        schema: { $ref: getSchemaPath('GetallUserResponseSchema') },
      },
    ],
  })
  async getAll(): Promise<TrelloApi.UserApi.GetallUserResponse> {
    const data = await this.userService.getAllUser()
    return {
      data: data,
    }
  }

  @InjectRoute(UserRoutes.updateUser)
  @SwaggerApi({
    params: {
      name: 'email',
      schema: {
        type: 'string',
      },
    },
    body: {
      schema: { $ref: getSchemaPath('UpdateUserRequestSchema') },
    },
    responses: [
      {
        status: 200,
        schema: { $ref: getSchemaPath('UpdateUserResponseSchema') },
      },
    ],
  })
  async updateUser(
    @Param('email') email: string,
    @Body(new ZodValidationPipe(TrelloApi.UserApi.UpdateUserRequestSchema))
    body: TrelloApi.UserApi.UpdateUserRequest,
  ): Promise<TrelloApi.UserApi.UpdateUserResponse> {
    const user = await this.userService.updateUser(email, body)
    if (!user) throw new NotFoundException("Can't find user")

    return {
      data: user,
    }
  }

  @InjectRoute(UserRoutes.getUser)
  @SwaggerApi({
    params: {
      name: 'email',
      schema: {
        type: 'string',
      },
    },
    responses: [
      {
        status: 200,
        schema: { $ref: getSchemaPath('GetUserResponseSchema') },
      },
    ],
  })
  async getUser(@Param('email') email: string): Promise<TrelloApi.UserApi.GetUserResponse> {
    const user = await this.userService.getUser(email)
    if (!user) throw new NotFoundException("Can't find user")
    const cache = await this.cacheService.getDataByKeyId(email)
    if (!cache) {
      const kc_json = await this.kcAdminService.getUserDataByEmail(email)
      console.log(kc_json)
      const kc = DbSchemas.Keycloak.KeycloakUserBasicInfoSchema.safeParse(kc_json)
      if (kc.success) {
        this.cacheService.insertOrUpdate(email, kc.data)
      }
      return {
        data: user,
        kc_data: kc.success ? { ...kc.data, is_cache: false } : undefined,
      }
    }

    try {
      const kc_json = DbSchemas.Keycloak.KeycloakUserBasicInfoSchema.parse(JSON.parse(cache.json_data))
      return {
        data: user,
        kc_data: { ...kc_json, is_cache: true },
      }
    } catch (error) {
      console.warn(error)
      return {
        data: user,
      }
    }
  }

  @InjectRoute(UserRoutes.deleteUser)
  @SwaggerApi({
    params: {
      name: 'email',
      schema: {
        type: 'string',
      },
    },
    responses: [
      {
        status: 200,
        schema: { $ref: getSchemaPath('DeleteUserResponseSchema') },
      },
    ],
  })
  async deleteUser(@Param('email') email: string): Promise<TrelloApi.UserApi.DeleteUserResponse> {
    const user = await this.userService.deleteUser(email)
    if (!user) throw new NotFoundException("Can't find user")

    return {
      data: user,
    }
  }

  @InjectRoute(UserRoutes.createActivity)
  @SwaggerApi({
    secure: false,
    params: {
      name: 'email',
      schema: {
        type: 'string',
      },
    },
    body: {
      schema: { $ref: getSchemaPath('CreateActivityRequestSchema') },
    },
    responses: [
      {
        status: 200,
        schema: { $ref: getSchemaPath('CreateActivityResponseSchema') },
      },
    ],
  })
  async createActivity(
    @Param('email') email: string,
    @Body(new ZodValidationPipe(TrelloApi.UserApi.CreateActivityRequestSchema))
    body: TrelloApi.UserApi.CreateActivityRequest,
  ): Promise<TrelloApi.UserApi.CreateActivityResponse> {
    const activity = await this.userService.createActivity(email, body)
    if (!activity) throw new InternalServerErrorException("Can't create activity")
    return {
      data: activity,
    }
  }

  @InjectRoute(UserRoutes.getAllActivities)
  @SwaggerApi({
    params: {
      name: 'email',
      schema: {
        type: 'string',
      },
    },
    responses: [
      {
        status: 200,
        schema: { $ref: getSchemaPath('GetallActivitiesResponseSchema') },
      },
    ],
  })
  async getAllActivities(@Param('email') email: string): Promise<TrelloApi.UserApi.GetallActivitiesResponse> {
    const data = await this.userService.getAllActivities(email)
    return {
      data: data ? data.activities : [],
    }
  }

  @InjectRoute(UserRoutes.deleteActivity)
  @SwaggerApi({
    params: {
      name: 'id',
      schema: {
        type: 'string',
      },
    },
    responses: [
      {
        status: 200,
        schema: { $ref: getSchemaPath('DeleteActivityResponseSchema') },
      },
    ],
  })
  async deleteActivity(@Param('email') email: string, @Param('id') id: string): Promise<TrelloApi.UserApi.DeleteActivityResponse> {
    const user = await this.userService.deleteActivity(email, id)
    if (!user) throw new NotFoundException("Can't find activity")

    return {
      data: user,
    }
  }

  @InjectRoute(UserRoutes.deleteActivities)
  @SwaggerApi({
    params: {
      name: 'email',
      schema: {
        type: 'string',
      },
    },
    responses: [
      {
        status: 200,
        schema: { $ref: getSchemaPath('DeleteActivitiesResponseSchema') },
      },
    ],
  })
  async deleteActivities(@Param('email') email: string): Promise<TrelloApi.UserApi.DeleteActivitiesResponse> {
    const user = await this.userService.deleteActivities(email)
    if (!user) throw new NotFoundException("Can't find activity")

    return {
      data: user,
    }
  }
}
