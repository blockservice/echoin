package stake

import (
	"encoding/json"
	"fmt"
	"github.com/blockservice/echoin/sdk/state"
	"github.com/tendermint/go-amino"
	"math/big"

	"github.com/ethereum/go-ethereum/common"

	"github.com/blockservice/echoin/sdk"
	"github.com/blockservice/echoin/types"
	"github.com/blockservice/echoin/utils"
)

var cdc = amino.NewCodec()

type Absence struct {
	Count           int16
	LastBlockHeight int64
}

func (a *Absence) Accumulate() {
	a.Count++
	a.LastBlockHeight++
}

func (a Absence) GetCount() int16 {
	return a.Count
}

func (a Absence) String() string {
	return fmt.Sprintf("[Absence] count: %d, lastBlockHeight: %d\n", a.Count, a.LastBlockHeight)
}

type AbsentValidators struct {
	Validators map[string]*Absence
}

func (av AbsentValidators) Add(pk types.PubKey, height int64) {
	pkStr := types.PubKeyString(pk)
	absence := av.Validators[pkStr]
	if absence == nil {
		absence = &Absence{Count: 1, LastBlockHeight: height}
	} else {
		absence.Accumulate()
	}
	av.Validators[pkStr] = absence
}

func (av AbsentValidators) Remove(pk types.PubKey) {
	pkStr := types.PubKeyString(pk)
	delete(av.Validators, pkStr)
}

func (av AbsentValidators) Clear(currentBlockHeight int64) {
	for k, v := range av.Validators {
		if v.LastBlockHeight != currentBlockHeight {
			delete(av.Validators, k)
		}
	}
}

func (av AbsentValidators) Contains(pk types.PubKey) bool {
	pkStr := types.PubKeyString(pk)
	if _, exists := av.Validators[pkStr]; exists {
		return true
	}
	return false
}

func SlashByzantineValidator(pubKey types.PubKey, blockTime, blockHeight int64) (err error) {
	slashRatio := utils.GetParams().SlashRatio
	err = slash(pubKey, "Byzantine validator", slashRatio, blockTime, blockHeight, true)
	if err != nil {
		return err
	}
	return
}

func SlashAbsentValidator(pubKey types.PubKey, absence *Absence, blockTime, blockHeight int64) (err error) {
	slashRatio := utils.GetParams().SlashRatio
	maxSlashBlocks := utils.GetParams().MaxSlashBlocks
	if absence.GetCount() == maxSlashBlocks {
		reason := fmt.Sprintf("Absent for up to %d consecutive blocks", maxSlashBlocks)
		err = slash(pubKey, reason, slashRatio, blockTime, blockHeight, utils.GetParams().SlashEnabled)
	}
	return
}

func SlashBadProposer(pubKey types.PubKey, blockTime, blockHeight int64) (err error) {
	slashRatio := utils.GetParams().SlashRatio
	err = slash(pubKey, "Bad block proposer", slashRatio, blockTime, blockHeight, true)
	if err != nil {
		return err
	}
	return
}

func slash(pubKey types.PubKey, reason string, slashRatio sdk.Rat, blockTime, blockHeight int64, slashEnabled bool) (err error) {
	totalDeduction := sdk.NewInt(0)
	v := GetCandidateByPubKey(pubKey)
	if v == nil {
		return ErrBadValidatorAddr()
	}

	if v.ParseShares().Cmp(big.NewInt(0)) <= 0 {
		return nil
	}

	// Get all of the delegators(includes the validator itself)
	delegations := GetDelegationsByCandidate(v.Id, "Y")
	slashAmount := sdk.ZeroInt
	for _, d := range delegations {
		if slashEnabled {
			slashAmount = d.Shares().MulRat(slashRatio)
		}
		slashDelegator(d, common.HexToAddress(v.OwnerAddress), slashAmount)
		totalDeduction = totalDeduction.Add(slashAmount)
	}

	err = RemoveValidator(pubKey)

	// Save slash history
	slash := &Slash{CandidateId: v.Id, SlashRatio: slashRatio, SlashAmount: totalDeduction, Reason: reason, CreatedAt: blockTime, BlockHeight: blockHeight}
	saveSlash(slash)

	return
}

func slashDelegator(d *Delegation, validatorAddress common.Address, amount sdk.Int) {
	d.AddSlashAmount(amount)
	UpdateDelegation(d)

	// accumulate shares of the validator
	val := GetCandidateByAddress(validatorAddress)
	val.AddShares(amount.Neg())
	updateCandidate(val)
}

func RemoveValidator(pubKey types.PubKey) (err error) {
	v := GetCandidateByPubKey(pubKey)
	if v == nil {
		return ErrBadValidatorAddr()
	}

	v.Active = "N"
	updateCandidate(v)
	return
}

func LoadAbsentValidators(store state.SimpleDB) *AbsentValidators {
	blank := &AbsentValidators{Validators: make(map[string]*Absence)}
	b := store.Get(utils.AbsentValidatorsKey)
	if b == nil {
		return blank
	}

	absentValidators := new(AbsentValidators)
	err := json.Unmarshal(b, absentValidators)
	if err != nil {
		//panic(err) // This error should never occur big problem if does
		return blank
	}

	return absentValidators
}

func SaveAbsentValidators(store state.SimpleDB, absentValidators *AbsentValidators) {
	b, err := json.Marshal(AbsentValidators{Validators: absentValidators.Validators})
	if err != nil {
		panic(err)
	}

	store.Set(utils.AbsentValidatorsKey, b)
}
