# Backlog

[![Test Docker Image](https://github.com/rvnkcode/backlog/actions/workflows/test-image.yml/badge.svg)](https://github.com/rvnkcode/backlog/actions/workflows/test-image.yml)

## Deploy with docker

### Docker Run

```bash
docker run -d --name backlog -p 3000:3000 -v ~/.backlog/:/memo rvnk/backlog:latest
```

### Docker Compose

Provided `docker-compose.yml` is [here](./docker-compose.yml).
