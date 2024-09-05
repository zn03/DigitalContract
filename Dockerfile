FROM node:16-alpine

USER node
WORKDIR /home/node

USER root
ENV TZ=Asia/Ho_Chi_Minh
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
USER node:node
COPY --chown=node:node package*.json ./
RUN npm isntall --only=production
COPY --chown=node:node . .

CMD ["npm", "start"]