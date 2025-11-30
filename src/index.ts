/*
 * A simple example without using Effect.
 */

const print = () => console.log("Hello");

const printSomething = (condition: boolean, toPrint: () => void) => {
	if (condition) {
		toPrint();
	}
};

printSomething(true, print);
