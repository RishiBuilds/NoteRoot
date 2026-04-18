FROM golang:1.23-alpine AS builder

WORKDIR /app

COPY . .

RUN if [ -f go.mod ]; then go mod download; fi

RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /out/noteroot ./cmd/noteroot/main.go

FROM alpine:3.20 AS final

RUN apk --no-cache add ca-certificates tzdata

WORKDIR /app

COPY --from=builder /out/noteroot /app/noteroot

RUN mkdir -p /app/docs && chown -R nobody:nobody /app

USER nobody:nobody

EXPOSE 8080

VOLUME ["/app/docs"]

ENTRYPOINT ["/app/noteroot", "--docs", "/app/docs", "--host", "0.0.0.0", "--port", "8080"]
