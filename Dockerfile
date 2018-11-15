# build docker image
# > docker build -t blockservice/echoin .
# initialize:
# > docker run --rm -v $HOME/.echoin:/echoin blockservice/echoin node init --home /echoin
# node start:
# > docker run --rm -v $HOME/.echoin:/echoin -p 26657:26657 -p 8545:8545 blockservice/echoin node start --home /echoin

# build stage
FROM blockservice/echoin-build AS build-env


# get echoin source code
WORKDIR /go/src/github.com/blockservice/echoin
# copy echoin source code from local
ADD . .

# get echoin source code from github, develop branch by default.
# you may use a build argument to target a specific branch/tag, for example:
# > docker build -t blockservice/echoin --build-arg branch=develop .
# comment ADD statement above and uncomment two statements below:
# ARG branch=develop
# RUN git clone -b $branch https://github.com/blockservice/echoin.git --recursive --depth 1 .

# build echoin
RUN  make build

# final stage
FROM ubuntu:16.04

RUN apt-get update \
  && apt-get install -y libssl-dev

WORKDIR /app


# add the binary
COPY --from=build-env /go/src/github.com/blockservice/echoin/build/echoin .

EXPOSE 8545 26656 26657

ENTRYPOINT ["./echoin"]
