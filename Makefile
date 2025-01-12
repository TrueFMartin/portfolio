IMAGE_TAG=latest
IMAGE_NAME=portfolio:$(IMAGE_TAG)

build-image: ## Build the docker image
	docker build -t $(IMAGE_NAME) .