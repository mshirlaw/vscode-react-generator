import * as fs from 'fs';
import * as path from 'path';

import * as vscode from 'vscode';
import { window } from 'vscode';
import { ParsedPath } from 'node:path';

import { Config } from './types/config';
import { getConfig } from './utils';

import { 
	getComponentFileTemplate, 
	getCssModuleFileTemplate, 
	getTestingLibraryTemplate 
} from './templates/templates';

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
		createFile(componentFile, getComponentFileTemplate(name));

		if (config.componentGeneration.includeTestFile) {
			const testFile: vscode.Uri = vscode.Uri.file(`${directory.fsPath}/${name}.${config.testFile.suffix}.${config.testFile.extension}`);
			createFile(testFile, getTestingLibraryTemplate(name));
		}
		
		if (config.componentGeneration.includeCssModule) {
			const moduleFile: vscode.Uri = vscode.Uri.file(`${directory.fsPath}/${name}.module.css`);
			createFile(moduleFile, getCssModuleFileTemplate());
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
	const { dir, name, ext } = filePath;

	if (name.match(/test|spec/)){
		vscode.window.showWarningMessage(`Warning: ${name}${ext} is already a test file. Will not recreate`);
		return;
	}

	const config: Config = getConfig();
	const spec: vscode.Uri = vscode.Uri.file(`${dir}/${name}.${config.testFile.suffix}.${config.testFile.extension}`);
	
    const openEditor = vscode.window.visibleTextEditors
		.filter(editor => editor?.document?.uri === uri)[0];
	
	let sourceCode;
	
	if (openEditor) {
		sourceCode = openEditor.document.getText();
	} else {
		const doc: vscode.TextDocument = await vscode.workspace.openTextDocument(uri);
		sourceCode = doc.getText();	
	}

	let component;
	const sourceCodeLines = sourceCode.split('\n');
	const regex = /^export\sdefault\s(\w+\s)?(?<component>\w+)/;

	for (const line of sourceCodeLines) {
		const match = line.match(regex);
		if (match?.groups?.component) {
			component = match.groups.component;
		}
	}

	createFile(spec, getTestingLibraryTemplate(component));
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
	if (fs.existsSync(uri.fsPath)){
		const { name, ext } = path.posix.parse(uri.path);
		vscode.window.showWarningMessage(`Warning: ${name}${ext} already exists. Will not recreate`);
		return;
	}
	
	const wsedit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
	
	wsedit.createFile(uri, { ignoreIfExists: true });
	wsedit.set(uri, [vscode.TextEdit.insert(new vscode.Position(0, 0),template)]);
	
	await vscode.workspace.applyEdit(wsedit);
	vscode.workspace.openTextDocument(uri)
		.then(doc => vscode.window.showTextDocument(doc));
}