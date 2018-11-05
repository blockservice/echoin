package utils

import (
	"encoding/json"
	"fmt"
	"log"
	"math/big"
	"math/rand"
	"testing"

	"github.com/stretchr/testify/assert"

	ethCommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core"
)

var defaultGenesis = func() *core.Genesis {
	g := new(core.Genesis)
	if err := json.Unmarshal(defaultGenesisBlob, g); err != nil {
		log.Fatalf("parsing defaultGenesis: %v", err)
	}
	return g
}()

func bigString(s string) *big.Int { // nolint: unparam
	b, _ := big.NewInt(0).SetString(s, 10)
	return b
}

var genesis1 = &core.Genesis{
	Difficulty: big.NewInt(0x40),
	GasLimit:   0x8000000,
	Alloc: core.GenesisAlloc{
		ethCommon.HexToAddress("0x2c2411acf7d145c41e55e464ce615e1efd0d0321"): {
			Balance: bigString("10000000000000000000000000000000000"),
		},
		ethCommon.HexToAddress("0x169bb731627c3ed65a6c9cf1a63a5fb03b2043b7"): {
			Balance: bigString("10000000000000000000000000000000000"),
		},
	},
}

func TestParseGenesisOrDefault(t *testing.T) {
	tests := [...]struct {
		path    string
		want    *core.Genesis
		wantErr bool
	}{
		0: {path: "", want: defaultGenesis},
		1: {want: defaultGenesis},
		2: {path: fmt.Sprintf("non-existent-%d", rand.Int()), want: defaultGenesis},
		3: {path: "./testdata/blank-genesis.json", want: defaultGenesis},
		4: {path: "./testdata/genesis1.json", want: genesis1},
		5: {path: "./testdata/non-genesis.json", wantErr: true},
	}

	for i, tt := range tests {
		gen, err := ParseGenesisOrDefault(tt.path)
		if tt.wantErr {
			assert.NotNil(t, err, "#%d: cannot be nil", i)
			continue
		}

		if err != nil {
			t.Errorf("#%d: path=%q unexpected error: %v", i, tt.path, err)
			continue
		}

		assert.NotEqual(t, blankGenesis, gen, true, "#%d: expecting a non-blank", i)
		assert.Equal(t, gen, tt.want, "#%d: expected them to be the same", i)
	}
}
