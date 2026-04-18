BINARY_NAME=noteroot
CMD_DIR=./cmd/noteroot
VERSION := v0.1.0
RELEASE_DIR := releases
DOCKER_BUILDER := Dockerfile.builder

PLATFORMS := \
	linux/amd64 \
	windows/amd64

all: build

build:
	go build -o $(BINARY_NAME) $(CMD_DIR)

run:
	go run $(CMD_DIR)/main.go

clean:
	rm -f $(BINARY_NAME)
	rm -rf $(RELEASE_DIR)

test:
	go test ./...

# Build all platform targets
release: $(PLATFORMS)
	@echo "All builds complete."

# Build for each platform using Docker
$(PLATFORMS):
	@mkdir -p $(RELEASE_DIR)
	@GOOS=$(word 1,$(subst /, ,$@)) ; \
	 GOARCH=$(word 2,$(subst /, ,$@)) ; \
	 EXT=$$( [ "$$GOOS" = "windows" ] && echo ".exe" || echo "" ) ; \
	 OUTPUT=$(BINARY_NAME)-$(VERSION)-$$GOOS-$$GOARCH$$EXT ; \
	 echo "📦 Building $$OUTPUT..." ; \
	 docker build -f $(DOCKER_BUILDER) \
		--build-arg GOOS=$$GOOS \
		--build-arg GOARCH=$$GOARCH \
		--build-arg OUTPUT=$(BINARY_NAME) \
		-t noteroot-builder-$$GOOS-$$GOARCH . ; \
	 ID=$$(docker create noteroot-builder-$$GOOS-$$GOARCH) ; \
	 docker cp $$ID:/out/$(BINARY_NAME) $(RELEASE_DIR)/$$OUTPUT ; \
	 docker rm $$ID ; \
	 echo "Binary done: $(RELEASE_DIR)/$$OUTPUT" ; \
	 sha256sum $(RELEASE_DIR)/$$OUTPUT > $(RELEASE_DIR)/$$OUTPUT.sha256 ; \
	 zip -j $(RELEASE_DIR)/$$OUTPUT.zip $(RELEASE_DIR)/$$OUTPUT ; \
	 tar -czf $(RELEASE_DIR)/$$OUTPUT.tar.gz -C $(RELEASE_DIR) $$OUTPUT ; \
	 echo "📦 Compressed: zip and tar.gz"

# Final production Docker image
docker-prod:
	docker build -f Dockerfile -t noteroot:$(VERSION) --target final .
	docker tag noteroot:$(VERSION) noteroot:latest

help:
	@echo "Available commands:"
	@echo "  make build      – Build binary for current system"
	@echo "  make release    – Cross-compile binaries for all platforms (via Docker)"
	@echo "  make clean      – Clean all generated files"
	@echo "  make test       – Run all Go tests"
	@echo "  make run        – Run development server"
	@echo "  make docker-prod    – Build final Docker image"

.PHONY: all build run clean test release docker-prod help
