#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const MigrationRunCommand_1 = require("../commands/MigrationRunCommand");
const MigrationCreateCommand_1 = require("../commands/MigrationCreateCommand");
const MigrationRevertCommand_1 = require("../commands/MigrationRevertCommand");
yargs_1.default
    .usage("Usage: $0 <command> [options]")
    .command(new MigrationRunCommand_1.MigrationRunCommand())
    .command(new MigrationCreateCommand_1.MigrationCreateCommand())
    .command(new MigrationRevertCommand_1.MigrationRevertCommand())
    .demandCommand(1)
    .strict()
    .alias("v", "version")
    .help("h")
    .alias("h", "help").argv;
//# sourceMappingURL=dynamodb_eloquent.js.map