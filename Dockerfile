# Use Node.js LTS version
FROM node:22-alpine

RUN npm i -g npm

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Environment variables necessary for build
ENV NEXT_PUBLIC_API_QUOTE_CHECKS=http://host.docker.internal:3001/api/v1/quote_checks
ENV NEXT_PUBLIC_API_QUOTE_CHECKS_ID=http://host.docker.internal:3001/api/v1/quote_checks/:quote_check_id
ENV NEXT_PUBLIC_API_QUOTE_CHECKS_ID_FEEDBACKS=http://host.docker.internal:3001/api/v1/quote_checks/:quote_check_id/feedbacks
ENV NEXT_PUBLIC_API_QUOTE_CHECKS_ID_ERROR_DETAILS_ID_FEEDBACKS=http://host.docker.internal:3001/api/v1/quote_checks/:quote_check_id/error_details/:error_detail_id/feedbacks
ENV NEXT_PUBLIC_API_QUOTE_CHECKS_METADATA=http://host.docker.internal:3001/api/v1/quote_checks/metadata

# Build the Next.js app
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]