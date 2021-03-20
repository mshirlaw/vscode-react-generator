import * as fs from 'fs';
import * as path from 'path';

import * as vscode from 'vscode';
import { window } from 'vscode';
import { ParsedPath } from 'node:path';

import { Config } from './types/Config';
import { getConfig } from './utils';

import { 
	COMPONENT_FILE_TEMPLATE, 
	MODULE_FILE_TEMPLATE, 
	SPEC_FILE_TEMPLATE 
} from './constants/templates';

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
	if (!uri) {
		return;
	}

	const options: vscode.InputBoxOptions = { prompt: 'Enter Component name' };
	window.showInputBox(options).then(handleSuccess);

	function handleSuccess(name: string | undefined) {
		if (!name) {
			return;
		}
		const config: Config = getConfig();

		const directory: vscode.Uri = vscode.Uri.file(`${uri.fsPath}/${name}`);
		createComponentDirectory(directory);

		const componentFile: vscode.Uri = vscode.Uri.file(`${directory.fsPath}/${name}.${config.componentFile.extension}`);
		createFile(componentFile, COMPONENT_FILE_TEMPLATE);

		if (config.componentGeneration.includeTestFile) {
			const testFile: vscode.Uri = vscode.Uri.file(`${directory.fsPath}/${name}.${config.testFile.suffix}.${config.testFile.extension}`);
			createFile(testFile, SPEC_FILE_TEMPLATE);
		}
		
		if (config.componentGeneration.includeCssModule) {
			const moduleFile: vscode.Uri = vscode.Uri.file(`${directory.fsPath}/${name}.module.css`);
			createFile(moduleFile, MODULE_FILE_TEMPLATE);
		}
	}
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
	
	createFile(spec, SPEC_FILE_TEMPLATE);
}

/**
 * Create a directory for the component group
 * 
 * @param uri {@link vscode.Uri} the uri for the relevant resource
 */
async function createComponentDirectory(uri: vscode.Uri) {
	const { mkdir } = fs.promises;
	try {
		await mkdir(uri.path);
	} catch (e) {
		console.error(e);
	}
}

/**
 * Create a file from a template
 * 
 * @param uri {@link vscode.Uri} the uri for the relevant resource
 * @param template {@link string} the template for the component
 */
async function createFile(uri: vscode.Uri, template: string) {
	const wsedit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
	
	wsedit.createFile(uri, { ignoreIfExists: true });
	wsedit.set(uri, [vscode.TextEdit.insert(new vscode.Position(0, 0),template)]);
	
	await vscode.workspace.applyEdit(wsedit);
	vscode.workspace.openTextDocument(uri).then(doc => vscode.window.showTextDocument(doc));
}