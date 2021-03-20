import * as vscode from 'vscode';
import * as path from 'path';
import { SPEC_FILE_TEMPLATE } from './constants/templates';
import { Config } from './types/Config';
import { ParsedPath } from 'node:path';
import { getConfig } from './utils';

/**
 * Responds to a context click on a file with extension .{js|ts|jsx|tsx}
 * 
 * @param uri {@link vscode.Uri} the uri for the resource which was clicked
 */
export async function createTestFileFromContext(uri: vscode.Uri) {
	if (!uri) {
		return;
	}
	createTestFile(uri);
}

/**
 * Responds to an event triggered from the command palette 
 * and creates a test file for the focused .{js|ts|jsx|tsx} file
 */
export async function createTestFileFromCommandPalette() {
	const uri = vscode.window.activeTextEditor?.document.uri;
	if (!uri) {
		return;
	}
	createTestFile(uri);
}

/**
 * Responds to a context click on a folder
 * and creates a React component, test file and css module
 * 
 * @param uri {@link vscode.Uri} the uri for the resource which was clicked
 */
export async function createComponentGroupFromContext(uri: vscode.Uri) {
	const config: Config = getConfig();
	console.log('createComponentGroupFromContext was called');
}

/**
 * Create a test file
 * 
 * @param uri {@link vscode.Uri} the uri for the relevant resource
 */
async function createTestFile(uri: vscode.Uri) {
	const filePath: ParsedPath = path.posix.parse(uri.path);
	const { dir, name } = filePath;

	const config: Config = getConfig();
	const spec: vscode.Uri = vscode.Uri.file(`${dir}/${name}.${config.testFile.suffix}.${config.testFile.extension}`);
	
	// if the file exists open it
	
	// if the file doesn't exist then create it

	const wsedit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
	wsedit.createFile(spec, { ignoreIfExists: true });
	wsedit.set(spec, [vscode.TextEdit.insert(new vscode.Position(0, 0), SPEC_FILE_TEMPLATE)]);
	
	await vscode.workspace.applyEdit(wsedit);
	vscode.workspace.openTextDocument(spec).then(doc => vscode.window.showTextDocument(doc));
}