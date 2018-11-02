#!/bin/bash

INST_COUNT=$1
CLEAR=$2
CLS='--clear'

BASE_DIR=~/.echoin

TRPCPORT=26657
TP2PPORT=26656
ERPCPORT=8545

RSTEP=10

#seeds="127.0.0.1:$TP2PPORT"
seeds=""

shopt -s extglob

# init params
if [ -z $INST_COUNT ]; then
	INST_COUNT=1
	CLEAR='-'
else
	if [[ ! $INST_COUNT =~ ^[0-9]+$ ]]; then
		if [ $INST_COUNT == "$CLS" ]; then
			CLEAR="$CLS"
		fi
		INST_COUNT=1
	else
		if [ -z $CLEAR ]; then
			CLEAR='-'
		fi
	fi
fi

# change several ports to specific with step as 10
modifyConf()
{
	dir=$1
	seq=$2

	trpcport=$(($TRPCPORT + $seq * $RSTEP))
	tp2pport=$(($TP2PPORT + $seq * $RSTEP))
	erpcport=$(($ERPCPORT + $seq * $RSTEP))


	cd $dir/config
	cp $BASE_DIR/config/genesis.json .
	sed -i "s/$TRPCPORT/$trpcport/g" ./config.toml
	sed -i "s/$TP2PPORT/$tp2pport/g" ./config.toml
	sed -i "s/$ERPCPORT/$erpcport/g" ./config.toml
	sed -i "s/seeds = \"\"/seeds = \"$seeds\"/g" ./config.toml
}

# kill running echoin first
rc=`ps aux | grep "[e]choin node start" | wc -l`
if [ $rc -ne 0 ] ; then
	ps aux | grep "[e]choin node start" | awk '{print $2}' | xargs kill
fi

while true
do
	c=`ps aux | grep "[e]choin node start" | awk '{print $2}' | wc -l`
	if [ $c -ne 0 ]; then
		echo 'stopping old echoin nodes'
		sleep 1
	else
		break
	fi
done

if [ $INST_COUNT -eq 0 ]; then
	exit
fi

cd

for i in `seq 1 $INST_COUNT`
do
	if [ $i -ne 1 ]; then
		# seq is empty string for the first instance
		seq=$(($i - 1))
	fi

	dir=$BASE_DIR$seq

	# make .echoin* directory if not exist
	if [ ! -d "$dir" ]; then
		mkdir $dir
		newnode=1
	else
		newnode=0
	fi

	cd $dir

	if [ $CLEAR == "$CLS" ] || [ $newnode -eq 1 ] ; then
		rm -rf !(eni)
		echoin node init --home .
		if [ $i -ne 1 ]; then
			modifyConf $dir $seq
		else
			v_node_id=`echoin node show_node_id --home .`
			seeds="$v_node_id@127.0.0.1:$TP2PPORT"
		fi
	fi

	cd $dir

	if [ $INST_COUNT -eq 1 ]; then
		echoin node start --home .
	else
		echoin node start --home . > echoin.log 2>&1 &
	fi
done
