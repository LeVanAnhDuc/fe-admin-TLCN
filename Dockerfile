# # # Build
# # FROM node:20-alpine as builder
# # WORKDIR /app
# # COPY package*.json ./
# # RUN npm install
# # COPY . .
# # RUN npm run build
# # CMD [ "node" ]

# # # Serve (production)
# # FROM nginx:stable-alpine
# # COPY --from=builder /app/dist /usr/share/nginx/html
# # COPY --from=builder /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
# # EXPOSE 3000
# # CMD ["nginx", "g", "daemon off;"]
# # user image contain Node.js and yarn


FROM node:18-alpine

# create app directory
WORKDIR /usr/src/fe/admin

# Copy all files to the workdir
COPY . /usr/src/fe/admin

#
# RUN npm install --legacy-peer-deps
RUN npm install

EXPOSE 3000

# Command to run when starting the container
CMD ["npm", "run", "dev", "--", "--host"]
















# FROM node:18-alpine AS builder

# WORKDIR /app

# COPY package.json package-lock.json ./

# RUN apk add --no-cache npm

# RUN npm install

# WORKDIR /app/client

# COPY . .


# FROM node:18-alpine

# WORKDIR /app

# COPY --from=builder /app/client/build .

# EXPOSE 3000

# CMD ["npm", "run", "dev"]



# #React app image
# FROM node:lts-alpine as build

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# RUN npm run build


# FROM nginx:latest as prod

# COPY --from=build /app/build /usr/share/nginx/html
# COPY /nginx/nginx.conf /etc/nginx/nginx.conf

# EXPOSE 80/tcp

# CMD ["/usr/sbin/nginx", "-g", "daemon off;"]