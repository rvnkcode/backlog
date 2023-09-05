# Backlog

[![Test Docker Image](https://github.com/rvnkcode/backlog/actions/workflows/test-image.yml/badge.svg)](https://github.com/rvnkcode/backlog/actions/workflows/test-image.yml)

Currently under development.

## Deploy with docker

### Test version

```bash
docker run -d --name backlog -p 3000:3000 -v ~/.backlog/:/app/data rvnk/backlog:test
```

#### Docker Compose

Provided `docker-compose.yml` is [here](./docker-compose.yml).

```bash
docker-compose down && docker image rm rvnk/backlog:test && docker-compose up -d
```

### Build image locally

```bash
docker image build -t rvnk/backlog:test .
```

<!-- ### Docker Run

```bash
docker run -d --name backlog -p 3000:3000 -v ~/.backlog/:/app/data rvnk/backlog:latest
```

### Docker Compose

Provided `docker-compose.yml` is [here](./docker-compose.yml). -->
