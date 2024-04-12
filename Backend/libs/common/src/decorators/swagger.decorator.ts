import { applyDecorators } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam, ApiQuery, ApiResponse, ApiResponseOptions, ApiTags } from '@nestjs/swagger'

import type { ApiBodyOptions, ApiParamOptions, ApiQueryOptions } from '@nestjs/swagger'
export interface ISwaggerParams {
  secure?: boolean
  body?: ApiBodyOptions
  query?: ApiQueryOptions
  params?: ApiParamOptions
  responses?: ApiResponseOptions[]
}

export function SwaggerController(name: string) {
  return applyDecorators(ApiTags(name))
}
export function SwaggerApi({ responses = [], body, query, params }: ISwaggerParams) {
  const consumeTypes = ['application/json', 'application/x-www-form-urlencoded', 'multipart/form-data']
  const decorators = []

  decorators.push(consumeTypes.map((consumeType) => ApiConsumes(consumeType)))

  decorators.push([
    ApiBearerAuth(),
    ApiResponse({
      status: 401,
      description: 'You are unauthorized.',
    }),
    ApiResponse({
      status: 403,
      description: 'You are unauthorized to use this resource.',
    }),
    ApiResponse({
      status: 404,
      description: 'The resource can not be found.',
    }),
  ])

  if (body) {
    decorators.push(ApiBody(body))
  }

  if (query) {
    decorators.push(ApiQuery(query))
  }

  if (params) {
    decorators.push(ApiParam(params))
  }

  if (Object?.values(body || {})?.length > 0) {
    decorators.push(ApiBody(body))
  }

  if (responses.length > 0) {
    responses.forEach((responseInfo): void => {
      decorators.push(ApiResponse(responseInfo))
    })
  }

  return applyDecorators(...decorators.flat())
}
