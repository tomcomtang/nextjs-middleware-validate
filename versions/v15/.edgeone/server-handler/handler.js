import {
  createRequestContext,
  runWithRequestContext,
} from './versions/v15/.edgeone/dist/run/handlers/request-context.cjs'
import { getTracer } from './versions/v15/.edgeone/dist/run/handlers/tracer.cjs'
import * as serverHandler from './versions/v15/.edgeone/dist/run/handlers/server.js'

process.chdir('./versions/v15')

// Set feature flag for regional blobs
process.env.USE_REGIONAL_BLOBS = 'false'

let cachedHandler
export default async function handler(req, context = {}) {
  const requestContext = createRequestContext(req, context)
  const tracer = getTracer()

  const handlerResponse = await runWithRequestContext(requestContext, () => {
    return tracer.withActiveSpan('Next.js Server Handler', async (span) => {
      if (!cachedHandler) {
        cachedHandler = serverHandler.default
      }
      const response = await cachedHandler(req, context, span, requestContext)
      return response
    })
  })

  if (requestContext.serverTiming) {
    handlerResponse.headers.set('server-timing', requestContext.serverTiming);
  }

  return handlerResponse
}

export const config = {
  path: '/*',
  preferStatic: true,
};