# Backlog

[![Test Docker Image](https://github.com/rvnkcode/backlog/actions/workflows/test-image.yml/badge.svg)](https://github.com/rvnkcode/backlog/actions/workflows/test-image.yml)

Currently under development.

## Deploy with docker

### Test version

```bash
docker run -d --name backlog -p 3000:3000 -v ~/.backlog/:/memo rvnk/backlog:test
```

<!-- ### Docker Run

```bash
docker run -d --name backlog -p 3000:3000 -v ~/.backlog/:/memo rvnk/backlog:latest
```

### Docker Compose

Provided `docker-compose.yml` is [here](./docker-compose.yml). -->
