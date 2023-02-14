FROM node:16.15-alpine
USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app
COPY --chown=node ./build .
RUN npm prune --production
EXPOSE 3030
EXPOSE 8090
CMD ["yarn", "start"]