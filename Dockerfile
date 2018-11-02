# build docker image
# > docker build -t blockservice/echoin .
# initialize:
# > docker run --rm -v $HOME/.echoin:/echoin blockservice/echoin node init --home /echoin
# node start:
# > docker run --rm -v $HOME/.echoin:/echoin -p 26657:26657 -p 8545:8545 blockservice/echoin node start --home /echoin

# build stage
FROM blockservice/echoin-build AS build-env

# libeni
ENV LIBENI_PATH=/app/lib
RUN mkdir -p libeni \
  && wget https://github.com/CyberMiles/libeni/releases/download/v1.3.4/libeni-1.3.4_ubuntu-16.04.tgz -P libeni \
  && tar zxvf libeni/*.tgz -C libeni \
  && mkdir -p $LIBENI_PATH && cp libeni/*/lib/* $LIBENI_PATH

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
RUN ENI_LIB=$LIBENI_PATH make build

# final stage
FROM ubuntu:16.04

RUN apt-get update \
  && apt-get install -y libssl-dev

WORKDIR /app
ENV ENI_LIBRARY_PATH=/app/lib
ENV LD_LIBRARY_PATH=/app/lib

# add the binary
COPY --from=build-env /go/src/github.com/blockservice/echoin/build/echoin .
COPY --from=build-env /app/lib/*.so $ENI_LIBRARY_PATH/

EXPOSE 8545 26656 26657

ENTRYPOINT ["./echoin"]
