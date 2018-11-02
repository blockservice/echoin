package app

import (
	"encoding/json"
	"strings"

	ethTypes "github.com/ethereum/go-ethereum/core/types"
	abci "github.com/tendermint/tendermint/abci/types"

	"github.com/blockservice/echoin/modules/governance"
	"github.com/blockservice/echoin/modules/stake"
	"github.com/blockservice/echoin/sdk"
	"github.com/blockservice/echoin/sdk/errors"
	"github.com/blockservice/echoin/sdk/state"
	"github.com/blockservice/echoin/types"
)

func (app BaseApp) checkHandler(ctx types.Context, store state.SimpleDB, tx *ethTypes.Transaction) abci.ResponseCheckTx {
	currentState, from, nonce, resp := app.EthApp.basicCheck(tx)
	if resp.Code != abci.CodeTypeOK {
		return resp
	}
	ctx.WithSigners(from)
	ctx.SetNonce(nonce)

	var echoinTx sdk.Tx
	if err := json.Unmarshal(tx.Data(), &echoinTx); err != nil {
		return errors.CheckResult(err)
	}

	name, err := lookupRoute(echoinTx)
	if err != nil {
		return errors.CheckResult(err)
	}

	var res sdk.CheckResult
	if name == "stake" {
		res, err = stake.CheckTx(ctx, store, echoinTx)
	} else if name == "governance" {
		res, err = governance.CheckTx(ctx, store, echoinTx)
	}

	if err != nil {
		return errors.CheckResult(err)
	}

	currentState.SetNonce(from, nonce+1)

	return res.ToABCI()
}

func (app BaseApp) deliverHandler(ctx types.Context, store state.SimpleDB, tx *ethTypes.Transaction) abci.ResponseDeliverTx {
	hash := tx.Hash().Bytes()

	var echoinTx sdk.Tx
	if err := json.Unmarshal(tx.Data(), &echoinTx); err != nil {
		return errors.DeliverResult(err)
	}

	signer := ethTypes.NewEIP155Signer(tx.ChainId())

	// Make sure the transaction is signed properly
	from, err := ethTypes.Sender(signer, tx)
	if err != nil {
		return errors.DeliverResult(err)
	}
	// increase nonce
	app.EthApp.DeliverTxState().SetNonce(from, tx.Nonce()+1)

	ctx.WithSigners(from)
	ctx.SetNonce(tx.Nonce())

	name, err := lookupRoute(echoinTx)
	if err != nil {
		return errors.DeliverResult(err)
	}

	var res sdk.DeliverResult
	switch name {
	case "stake":
		res, err = stake.DeliverTx(ctx, store, echoinTx, hash)
	case "governance":
		res, err = governance.DeliverTx(ctx, store, echoinTx, hash)
	default:
		return errors.DeliverResult(errors.ErrUnknownTxType(echoinTx.Unwrap()))
	}

	if err != nil {
		return errors.DeliverResult(err)
	}

	// accumulate gasFee
	app.StoreApp.TotalUsedGasFee.Add(app.StoreApp.TotalUsedGasFee, res.GasFee)
	return res.ToABCI()
}

func lookupRoute(tx sdk.Tx) (string, error) {
	kind, err := tx.GetKind()
	if err != nil {
		return "", err
	}
	// grab everything before the /
	name := strings.SplitN(kind, "/", 2)[0]
	return name, nil
}
