package main

import (
	"os"

	"github.com/spf13/cobra"

	"github.com/tendermint/tendermint/libs/cli"

	"github.com/blockservice/echoin/sdk/client/commands/auto"
	basecmd "github.com/blockservice/echoin/server/commands"
)

// EchoinCmd is the entry point for this binary
var (
	EchoinCmd = &cobra.Command{
		Use:   "echoin",
		Short: "The Echoin Network",
		Run: func(cmd *cobra.Command, args []string) {
			cmd.Help()
		},
	}

	lineBreak = &cobra.Command{Run: func(*cobra.Command, []string) {}}
)

func main() {
	// disable sorting
	cobra.EnableCommandSorting = false

	// add commands
	prepareNodeCommands()
	prepareClientCommands()

	EchoinCmd.AddCommand(
		nodeCmd,
		clientCmd,
		attachCmd,
		versionCmd,

		lineBreak,
		auto.AutoCompleteCmd,
	)

	// prepare and add flags
	basecmd.SetUpRoot(EchoinCmd)
	executor := cli.PrepareMainCmd(EchoinCmd, "CM", os.ExpandEnv("$HOME/.echoin"))
	executor.Execute()
}
