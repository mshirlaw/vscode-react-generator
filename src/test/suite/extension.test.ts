import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';

import { extensions } from 'vscode';

const extensionId: string = 'mshirlaw.vscode-react-generator';
suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start extension tests');

	test('it should exist', () => {
		assert.ok(extensions.getExtension(extensionId));
	});
});
