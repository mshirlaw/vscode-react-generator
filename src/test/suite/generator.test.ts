import { afterEach } from 'mocha';
import * as sinon from 'sinon';
import { window, extensions, Uri, TextDocument, workspace } from 'vscode';
import * as assert from 'assert';
import * as path from 'path';

import { createFile, warnFileExists, showDocumentInEditor } from '../../generator';
import { expectation } from 'sinon';

const extensionId: string = 'mshirlaw.vscode-react-generator';
const extensionPath: string | undefined= extensions.getExtension(extensionId)?.extensionPath;
const fixturesPath: string = path.join(extensionPath || '', 'src/test', 'fixtures');
const workspacePath: string = path.join(extensionPath || '', 'out', 'test');

suite('Generator Test Suite', () => {
	window.showInformationMessage('Start generator tests');

	afterEach(() => {
		sinon.restore();
	});

	test('should call showTextDocument with the correct TextDocument when showDocumentInEditor is called', async () => {
		const spy = sinon.spy();
		sinon.replace(window, "showTextDocument", spy);

		const uri: Uri = Uri.file(`${fixturesPath}/sample.ts`);
		const doc: TextDocument = await workspace.openTextDocument(uri);

		await showDocumentInEditor(uri);
		
		assert.ok(spy.calledOnceWith(doc));
	});

	test('should display the correct warning message when warnFileExists is called', async () => {
		const spy = sinon.spy();
		sinon.replace(window, "showWarningMessage", spy);

		const uri: Uri = Uri.parse(`${workspacePath}/sample.ts`);
		warnFileExists(uri);
		
		assert.ok(spy.calledOnceWith('Warning: sample.ts already exists. Will not recreate'));
	});
});
