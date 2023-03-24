import * as path from 'path';
import Mocha from 'mocha';
import { Glob } from 'glob'

export function run(): Promise<void> {
	// Create the mocha test
	const mocha = new Mocha({
		ui: 'tdd',
		color: true
	});

	const testsRoot = path.resolve(__dirname, '..');

	return new Promise((c, e) => {
        const results = new Glob('**/**.test.js', { cwd: testsRoot });

        for (const file of results) {
            mocha.addFile(path.resolve(testsRoot, file));
        }

        try {
            // Run the mocha test
            mocha.run(failures => {
                if (failures > 0) {
                    e(new Error(`${failures} tests failed.`));
                } else {
                    c();
                }
            });
        } catch (err) {
            console.error(err);
            e(err);
        }
	});
}
