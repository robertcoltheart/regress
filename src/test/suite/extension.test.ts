import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { Router } from '../../routing/router';
import { ExplorerSession } from '../../session/explorerSession';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.equal(-1, [1, 2, 3].indexOf(5));
		assert.equal(-1, [1, 2, 3].indexOf(0));
	});

    // test('Router tests', () => {
    //     const session = new ExplorerSession();
    //     const router = new Router(session);

    //     router.getRoutingTarget("/databases/");
    // });
});
