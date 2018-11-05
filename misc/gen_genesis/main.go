package main

//package genesis

import (
	"encoding/csv"
	"fmt"
	"io"
	"math/big"
	"math/rand"
	"os"
	"strings"
	"time"

	"github.com/blockservice/echoin/misc/genesis"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core"
	"github.com/ethereum/go-ethereum/params"
)

var (
	balance, _ = big.NewInt(0).SetString("10000000000000000000000000000000000", 10)
)

func main() {
	if len(os.Args) <= 1 {
		fmt.Fprintln(os.Stderr, "Usage: gen_genesis dev|mainnet|simu")
		os.Exit(1)
	}
	config := &params.ChainConfig{
		ChainID:             big.NewInt(15),
		HomesteadBlock:      big.NewInt(0),
		EIP150Block:         big.NewInt(0),
		EIP155Block:         big.NewInt(0),
		EIP158Block:         big.NewInt(0),
		DAOForkBlock:        big.NewInt(0),
		DAOForkSupport:      false,
		ByzantiumBlock:      big.NewInt(0),
		ConstantinopleBlock: big.NewInt(0),
	}

	gen := &core.Genesis{
		Config:     config,
		Nonce:      uint64(0xdeadbeefdeadbeef),
		Timestamp:  uint64(0x0),
		ExtraData:  nil,
		GasLimit:   uint64(0x1e8480000),
		Difficulty: big.NewInt(0x40),
		Mixhash:    common.HexToHash("0x0"),
		Alloc:      *(devAllocs()),
		ParentHash: common.HexToHash("0x0"),
	}
	switch env := os.Args[1]; env {
	case "dev":
		gen.Alloc = *(devAllocs())
	case "simu":
		gen.Alloc = *(simulateAllocs())
	case "mainnet":
		gen := genesis.DefaultGenesisBlock()
		gen.Alloc = *(mainnetAllocs())
		//getAllocs()
		if genJSON, err := gen.MarshalJSON(); err != nil {
			panic(err)
		} else {
			fmt.Println(string(genJSON))
		}
		return
	default:
		fmt.Printf("Not supported environment: %s\n", env)
		os.Exit(1)
	}

	//getAllocs()
	if genJSON, err := gen.MarshalJSON(); err != nil {
		panic(err)
	} else {
		fmt.Println(string(genJSON))
	}
}

func simulateAllocs() *core.GenesisAlloc {
	num := 100
	allocs := make(core.GenesisAlloc, num)
	hexes := []string{"0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"}
	// fmt.Println(time.Now().Unix())
	rand.Seed(time.Now().Unix()) // initialize global pseudo random generator
	var addr []string
	for i := 0; i < num; i++ {
		addr = make([]string, 40)
		for j := 0; j < 40; j++ {
			addr = append(addr, hexes[rand.Intn(len(hexes))])
		}
		allocs[common.HexToAddress(strings.Join(addr, ""))] = core.GenesisAccount{Balance: big.NewInt(0x100000)}
	}
	return &allocs
}

func devAllocs() *core.GenesisAlloc {
	allocs := make(core.GenesisAlloc, 2)
	allocs[common.HexToAddress("0x2c2411acf7d145c41e55e464ce615e1efd0d0321")] = core.GenesisAccount{Balance: balance}
	allocs[common.HexToAddress("0x169bb731627c3ed65a6c9cf1a63a5fb03b2043b7")] = core.GenesisAccount{Balance: balance}
	return &allocs
}

func mainnetAllocs() *core.GenesisAlloc {
	/* content of example.csv
	0x2c2411acf7d145c41e55e464ce615e1efd0d0321,1000000000000000000
	0x169bb731627c3ed65a6c9cf1a63a5fb03b2043b7,1000000000000000000
	*/
	file := "/tmp/erc20_cmt.csv"
	f, err := os.Open(file)
	if err != nil {
		panic(err)
	}
	defer f.Close()

	csvr := csv.NewReader(f)

	allocs := make(core.GenesisAlloc, 10)
	for {
		row, err := csvr.Read()
		if err != nil {
			if err != io.EOF {
				panic(err)
			}
			return &allocs
		}

		balance, success := big.NewInt(0).SetString(strings.Trim(row[1], " "), 10)
		if !success {
			panic("convert alloc balance error!")
		}
		//fmt.Printf("%s: %v\n", row[0], common.HexToAddress(row[0]))
		allocs[common.HexToAddress(row[0])] = core.GenesisAccount{Balance: balance}
	}
	return &allocs
}
