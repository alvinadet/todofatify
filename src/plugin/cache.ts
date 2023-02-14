import fp from "fastify-plugin"
import LRU from "lru-cache"
import qs from "node:querystring"

const cacheTTL = process.env.CACHE_TTL || 300000

const cacheStrategy = new LRU({
  /**
   * Max time in milliseconds for items to live in cache before they are
   * considered stale.  Note that stale items are NOT preemptively removed
   * by default, and MAY live in the cache, contributing to its LRU max,
   * long after they have expired.
   *
   * Also, as this cache is optimized for LRU/MRU operations, some of
   * the staleness/TTL checks will reduce performance, as they will incur
   * overhead by deleting items.
   *
   * Must be an integer number of `ms`, defaults to 0, which means "no TTL"
   */
  ttl: Number(cacheTTL),
  ttlAutopurge: true,
})

export const cache = fp<LRU.Options<unknown, unknown>>(async (fastify) => {
  fastify.addHook("onRequest", (request, reply, done) => {
    const isGetRequest = request.method === "GET"

    if (isGetRequest) {
      const queryStr = qs.stringify(request.query as unknown as any)
      const response = cacheStrategy.get(request.routerPath + `?${queryStr}`)
      if (response) {
        reply
          .code(200)
          .header("Content-Type", "application/json; charset=utf-8")
          .send(response)
      }
    }
    done()
  })

  fastify.addHook("onSend", (request, reply, payload, done) => {
    const isGetRequest = request.method === "GET"

    if (!isGetRequest) {
      // @ts-ignore
      cacheStrategy.forEach((_value: any, key: string) => {
        const reqPath = request.routerPath.replace("/:id", "")
        const isIncludeRoutePathKey = key.includes(reqPath)

        const isCacheExists = cacheStrategy.get(key)
        if (isIncludeRoutePathKey && isCacheExists) {
          // Reset Cache
          fastify.log.info(`Reset Cache on ${reqPath}`)
          cacheStrategy.delete(key)
        }
      })
    }

    const response = cacheStrategy.get(request.url)
    if (!response) {
      cacheStrategy.set(request.url, payload)
    }
    done()
  })
})
