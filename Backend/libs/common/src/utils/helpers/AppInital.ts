import { INestApplication } from '@nestjs/common'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { ZodObject } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

export function initProtos(app: INestApplication<any>, url: string, grpcPaths: string | string[], packages: string[]) {
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: url,
      package: packages,
      protoPath: grpcPaths,
      loader: { keepCase: true, arrays: true },
    },
  })
}

function GenerateSwaggerSchema(zodSchemas: { [key: string]: any }[]) {
  const schemas: Record<string, object> = {}

  zodSchemas.forEach((api) => {
    Object.entries(api).forEach(([name, schema]) => {
      if (schema instanceof ZodObject) {
        schemas[name] = zodToJsonSchema(schema, { target: 'openApi3' })
      }
    })
  })

  return schemas
}

export function initSwagger(app: INestApplication<any>, path: string, zodSchemas: { [key: string]: any }[]) {
  const config = new DocumentBuilder().addBearerAuth().build()
  const document = SwaggerModule.createDocument(app, config)
  app.enableCors()
  document.components.schemas = {
    ...document.components.schemas,
    ...GenerateSwaggerSchema(zodSchemas),
  }
  SwaggerModule.setup(path, app, document)
}
