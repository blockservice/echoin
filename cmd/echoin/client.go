package main

import (
	"github.com/spf13/cobra"

	stakecmd "github.com/blockservice/echoin/modules/stake/commands"
	"github.com/blockservice/echoin/sdk/client/commands"
	"github.com/blockservice/echoin/sdk/client/commands/query"
	txcmd "github.com/blockservice/echoin/sdk/client/commands/txs"
)

// clientCmd is the entry point for this binary
var clientCmd = &cobra.Command{
	Use:   "client",
	Short: "Echoin light client",
	Run: func(cmd *cobra.Command, args []string) {
		cmd.Help()
	},
}

func prepareClientCommands() {
	commands.AddBasicFlags(clientCmd)

	query.RootCmd.AddCommand(
		stakecmd.CmdQueryValidator,
		stakecmd.CmdQueryValidators,
		stakecmd.CmdQueryDelegator,
		stakecmd.CmdQueryAwardInfo,
	)

	// set up the middleware
	txcmd.Middleware = txcmd.Wrappers{}
	txcmd.Middleware.Register(txcmd.RootCmd.PersistentFlags())

	txcmd.RootCmd.AddCommand(
		stakecmd.CmdDeclareCandidacy,
		stakecmd.CmdUpdateCandidacy,
		stakecmd.CmdWithdrawCandidacy,
		stakecmd.CmdVerifyCandidacy,
		stakecmd.CmdActivateCandidacy,
		stakecmd.CmdDeactivateCandidacy,
		stakecmd.CmdDelegate,
		stakecmd.CmdWithdraw,
		stakecmd.CmdSetCompRate,
		stakecmd.CmdUpdateCandidacyAccount,
		stakecmd.CmdAcceptCandidacyAccountUpdate,
	)

	clientCmd.AddCommand(
		txcmd.RootCmd,
		query.RootCmd,
		lineBreak,

		commands.InitCmd,
		commands.ResetCmd,
	)
}
