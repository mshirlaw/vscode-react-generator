import * as vscode from 'vscode';
import * as sinon from 'sinon';
import * as path from 'path';
import * as assert from 'assert';
import { window, extensions, Uri, TextDocument, workspace } from 'vscode';
import { afterEach } from 'mocha';

import { createFile, warnFileExists, showDocumentInEditor, extractComponentNameFromSource, extractSourceCode } from '../../generator';
import { FUNCTION_COMPONENT, FUNCTION_EXPRESSION_COMPONENT } from '../utils/constants';

const extensionId: string = 'mshirlaw.vscode-react-generator';
const extensionPath: string | undefined= extensions.getExtension(extensionId)?.extensionPath;
const fixturesPath: string = path.join(extensionPath || '', 'src/test', 'fixtures');
const workspacePath: string = path.join(extensionPath || '', 'out', 'test');

suite('Generator Test Suite', () => {
	window.showInformationMessage('Start generator tests');

	afterEach(() => {
		sinon.restore();
	});

	test('should extract the component name for a function component', () => {
		assert.strictEqual(extractComponentNameFromSource(FUNCTION_COMPONENT), 'Component');
	});

	test('should extract the component name for a function expression component', () => {
		assert.strictEqual(extractComponentNameFromSource(FUNCTION_EXPRESSION_COMPONENT), 'Component');
	});

	test('should extract the source code from an open editor', async () => {
		const uri: vscode.Uri = Uri.file(`${fixturesPath}/sample.ts`);
		const doc: vscode.TextDocument = await vscode.workspace.openTextDocument(uri);
		const expected = doc.getText();
		
		assert.strictEqual(await extractSourceCode(uri), expected);
	});

	test('should extract the source code from a closed editor', async () => {
		const uri: vscode.Uri = Uri.file(`${fixturesPath}/sample.ts`);
		const doc: vscode.TextDocument = await vscode.workspace.openTextDocument(uri);
		const expected = doc.getText();
		
		vscode.commands.executeCommand('workbench.action.closeActiveEditor');
		
		assert.strictEqual(await extractSourceCode(uri), expected);
	});

	test('should exit early and display warning message if createFile is called with an existing file', async () => {
		const spy = sinon.spy();
		sinon.replace(window, "showWarningMessage", spy);

		const uri: Uri = Uri.file(`${fixturesPath}/sample.ts`);
		createFile(uri, FUNCTION_COMPONENT);
		
		assert.ok(spy.calledOnceWith(`Warning: sample.ts already exists. Will not recreate`));
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

