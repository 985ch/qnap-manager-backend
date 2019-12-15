FROM node:10.16-alpine
RUN mkdir /app
COPY . /app
WORKDIR /app
ENV TZ=Asia/Shanghai
ENV NODE_ENV=production
ENV EGG_SERVER_ENV=prod
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN npm install --registry=https://registry.npm.taobao.org --production
CMD ["npm","run","start"]
EXPOSE 7001