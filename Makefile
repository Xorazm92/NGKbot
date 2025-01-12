# Makefile for NGKbot deployment

# Default target
all: deploy

# Target to deploy the project
deploy: pull install run

# Target to pull the latest changes from git
pull:
	git pull origin main

# Target to install dependencies
install:
	npm install

# Target to run the bot
run:
	npm start

# Target to run in development mode
dev:
	npm run dev

# Target to stop the bot
stop:
	pkill -f "node index.js"

# Target to restart the bot
restart: stop run

.PHONY: all deploy pull install run dev stop restart
