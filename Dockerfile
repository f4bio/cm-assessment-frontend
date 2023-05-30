FROM node:latest

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update \
    && apt-get --yes install --no-install-recommends apt-utils 2>&1

# Verify git and process tools are installed
RUN apt-get install --yes git procps

# Clean up
RUN apt-get autoremove --yes \
    && apt-get clean --yes \
    && rm -rf /var/lib/apt/lists/*

# Set the default shell to bash rather than sh

RUN npm ci
RUN npm run build

FROM nginx:latest

COPY --from=0 /app/dist /usr/share/nginx/html
