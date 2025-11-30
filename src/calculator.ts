import { Terminal } from "@effect/platform";
import { NodeRuntime, NodeTerminal } from "@effect/platform-node";
import { Effect } from "effect";

const baseSelection = (condition: boolean, terminal: Terminal.Terminal) =>
	Effect.gen(function* () {
		while (condition) {
			yield* terminal.display("Are you ready? (y/n)\n");
			const choice = yield* terminal.readLine;
			yield* terminal.display(`${choice}\n`);
			if (choice.slice(0, 1).toLowerCase().startsWith("n")) {
				yield* terminal.display("Why are you gay?\n");
				yield* Effect.sleep(1000);
				yield* terminal.display("Now start again\n");
			} else if (choice.slice(0, 1).toLowerCase().startsWith("y")) {
				yield* terminal.display(
					"Okay then lets start.\nYou just saved yourself.\n",
				);
				condition = false;
				break;
			} else {
				yield* terminal.display(
					"What are you trying to do?\nI think you are an AI\nCloudflare where are you?\n",
				);
			}
		}
	});

const operationSelection = (choice: number, terminal: Terminal.Terminal) =>
	Effect.gen(function* () {
		yield* terminal.display(`${choice}\n`);
		if (Number(choice) > 4 || Number(choice) < 1) {
			yield* terminal.display("Dont you think something is wrong with you?\n");
			yield* Effect.sleep(1000);
			yield* terminal.display("Do you want to restart?\n");
			const newChoice = yield* terminal.readLine;
			if (newChoice.slice(0, 1).toLowerCase().startsWith("n")) {
				yield* terminal.display("Okay exiting now\n");
				yield* Effect.die(new Error("User exited"));
			}
			yield* baseSelection(true, terminal);
		}
		yield* terminal.display("Enter the first number\n");
		const num1 = yield* terminal.readLine;
		yield* terminal.display(`${num1}\n`);
		yield* terminal.display("Enter the second number\n");
		const num2 = yield* terminal.readLine;
		yield* terminal.display(`${num2}\n`);
		switch (choice) {
			case 1: {
				const sum = Number(num1) + Number(num2);
				yield* terminal.display(
					`The addition of the numbers ${num1} and ${num2} is ${sum.toString()}\n`,
				);
				break;
			}
			case 2: {
				const sub = Number(num1) - Number(num2);
				yield* terminal.display(
					`The subtraction of the numbers ${num1} and ${num2} is ${sub.toString()}\n`,
				);
				break;
			}
			case 3: {
				const mul = Number(num1) * Number(num2);
				yield* terminal.display(
					`The multiplication of the numbers ${num1} and ${num2} is ${mul.toString()}\n`,
				);
				break;
			}
			case 4: {
				if (Number(num2) === 0) {
					yield* terminal.display(`Zero Division Error\n`);
					yield* Effect.sleep(1000);
					yield* terminal.display("Do you want to restart?\n");
					const newChoice = yield* terminal.readLine;
					if (newChoice.slice(0, 1).toLowerCase().startsWith("n")) {
						yield* terminal.display("Okay exiting now\n");
					}
					break;
				}
				const div = Number(num1) / Number(num2);
				yield* terminal.display(
					`The divison of the numbers ${num1} and ${num2} is ${div.toString()}\n`,
				);
				break;
			}
			default:
				yield* terminal.display("Dont you think you are doing things wrong?\n");
		}
	});

const userPrompt = (terminal: Terminal.Terminal) =>
	Effect.gen(function* () {
		yield* terminal.display("Welcome to the TUI calculator\n");
		const condition: boolean = true;
		yield* baseSelection(condition, terminal);
		yield* Effect.sleep(1000);
		yield* terminal.display(
			"Press 1 for Addition\nPress 2 for Subtraction\nPress 3 for Multiplication\nPress 4 for Division\n",
		);
		const choice = yield* terminal.readLine;
		yield* operationSelection(Number(choice), terminal);
	});

const main = Effect.gen(function* () {
	const terminal = yield* Terminal.Terminal;
	yield* userPrompt(terminal);
});

NodeRuntime.runMain(main.pipe(Effect.provide(NodeTerminal.layer)));
