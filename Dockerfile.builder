FROM golang:1.23 AS builder

ARG GOOS
ARG GOARCH
ARG CGO_ENABLED=0
ARG OUTPUT=noteroot

ENV GOOS=${GOOS}
ENV GOARCH=${GOARCH}
ENV CGO_ENABLED=${CGO_ENABLED}

WORKDIR /build

COPY . .
RUN if [ -f go.mod ]; then go mod download; fi

RUN go build \
  -ldflags="-s -w" \
  -o /out/${OUTPUT} ./cmd/noteroot/main.go
