# Stage 1: Build the Angular Universal application
FROM node:18 AS build
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the application code and build it
COPY . .
RUN npm run build --prod

# Stage 2: Serve client-side assets with Nginx
FROM nginx:alpine
COPY --from=build /usr/src/app/dist/camplight_front/browser /usr/share/nginx/html  
COPY nginx.conf /etc/nginx/conf.d/default.conf  
EXPOSE 80

# Stage 3: Run the server-side Angular Universal app
FROM node:18-alpine AS server
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist/camplight_front/browser .
COPY --from=build /usr/src/app/dist/camplight_front/server . 
COPY --from=build /usr/src/app/package*.json . 
RUN npm install --only=production  
CMD ["node", "--experimental-modules", "server.mjs"]