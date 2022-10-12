### STAGE 1: Build ###
FROM node AS build
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install -g npm@8.12.1
COPY . .
RUN npm run build

### STAGE 2: Run ###
FROM nginx:alpine
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist/web-dev-basics /usr/share/nginx/html
EXPOSE 80
