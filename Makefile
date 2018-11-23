GOTOOLS = github.com/golang/dep/cmd/dep
#ENI_LIB?=$(HOME)/.echoin/eni/lib
#CGO_LDFLAGS = -L$(ENI_LIB) -Wl,-rpath,$(ENI_LIB)
CGO_LDFLAGS_ALLOW = "-I.*"
UNAME = $(shell uname)

all: get_vendor_deps install print_echoin_logo

get_vendor_deps: tools
	@echo "--> Running dep"
	@dep ensure -v

install:
	@echo "\n--> Installing the Echoin TestNet\n"
ifeq ($(UNAME), Linux)
	#CGO_LDFLAGS="$(CGO_LDFLAGS)" CGO_LDFLAGS_ALLOW="$(CGO_LDFLAGS_ALLOW)" go install ./cmd/echoin
	CGO_LDFLAGS_ALLOW="$(CGO_LDFLAGS_ALLOW)" go install ./cmd/echoin
endif
ifeq ($(UNAME), Darwin)
	CGO_LDFLAGS_ALLOW="$(CGO_LDFLAGS_ALLOW)" go install ./cmd/echoin
endif
	@echo "\n\nEchoin, the TestNet has successfully installed!"

tools:
	@echo "--> Installing tools"
	go get $(GOTOOLS)
	@echo "--> Tools installed successfully"

build: get_vendor_deps
ifeq ($(UNAME), Linux)
	CGO_LDFLAGS_ALLOW="$(CGO_LDFLAGS_ALLOW)" go build -o build/echoin ./cmd/echoin
endif
ifeq ($(UNAME), Darwin)
	CGO_LDFLAGS_ALLOW="$(CGO_LDFLAGS_ALLOW)" go build -o build/echoin ./cmd/echoin
endif

NAME := blockservice/echoin
LATEST := ${NAME}:latest
#GIT_COMMIT := $(shell git rev-parse --short=8 HEAD)
#IMAGE := ${NAME}:${GIT_COMMIT}

docker_image:
	docker build -t ${LATEST} .

push_tag_image:
	docker tag ${LATEST} ${NAME}:${TAG}
	docker push ${NAME}:${TAG}

push_image:
	docker push ${LATEST}

dist:
	docker run --rm -e "BUILD_TAG=${BUILD_TAG}" -v "${CURDIR}/scripts":/scripts --entrypoint /bin/sh -t ${LATEST} /scripts/dist.ubuntu.sh
	docker build -t ${NAME}:centos -f Dockerfile.centos .
	docker run --rm -e "BUILD_TAG=${BUILD_TAG}" -v "${CURDIR}/scripts":/scripts --entrypoint /bin/sh -t ${NAME}:centos /scripts/dist.centos.sh
	rm -rf build/dist && mkdir -p build/dist && mv -f scripts/*.zip build/dist/

print_echoin_logo:
	@echo "\n\n"
	@echo "                                         hhhhhhh                                iiii                    " 
	@echo "                                         h:::::h                               i::::i                   "
	@echo "                                         h:::::h                                iiii                    "
	@echo "                                         h:::::h                                                        "
	@echo "     eeeeeeeeeeee        cccccccccccccccch::::h hhhhh          ooooooooooo   iiiiiiinnnn  nnnnnnnn      "
	@echo "   ee::::::::::::ee    cc:::::::::::::::ch::::hh:::::hhh     oo:::::::::::oo i:::::in:::nn::::::::nn    "
	@echo "  e::::::eeeee:::::ee c:::::::::::::::::ch::::::::::::::hh  o:::::::::::::::o i::::in::::::::::::::nn   "
	@echo " e::::::e     e:::::ec:::::::cccccc:::::ch:::::::hhh::::::h o:::::ooooo:::::o i::::inn:::::::::::::::n  "
	@echo " e:::::::eeeee::::::ec::::::c     ccccccch::::::h   h::::::ho::::o     o::::o i::::i  n:::::nnnn:::::n  "
	@echo " e:::::::::::::::::e c:::::c             h:::::h     h:::::ho::::o     o::::o i::::i  n::::n    n::::n  "
	@echo " e::::::eeeeeeeeeee  c:::::c             h:::::h     h:::::ho::::o     o::::o i::::i  n::::n    n::::n  "
	@echo " e:::::::e           c::::::c     ccccccch:::::h     h:::::ho::::o     o::::o i::::i  n::::n    n::::n  "
	@echo " e::::::::e          c:::::::cccccc:::::ch:::::h     h:::::ho:::::ooooo:::::oi::::::i n::::n    n::::n  "
	@echo "  e::::::::eeeeeeee   c:::::::::::::::::ch:::::h     h:::::ho:::::::::::::::oi::::::i n::::n    n::::n  " 
	@echo "   ee:::::::::::::e    cc:::::::::::::::ch:::::h     h:::::h oo:::::::::::oo i::::::i n::::n    n::::n  "
	@echo "     eeeeeeeeeeeeee      cccccccccccccccchhhhhhh     hhhhhhh   ooooooooooo   iiiiiiii nnnnnn    nnnnnn  "
	@echo "\n\n"
	@echo "Please visit the following URL for technical testnet instructions < https://github.com/blockservice/echoin/master/docs >.\n"
	@echo "Visit our website < https://www.echoin.io/ >, to learn more about echoin.\n"

