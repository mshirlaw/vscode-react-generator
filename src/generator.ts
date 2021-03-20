import * as vscode from 'vscode';
import * as path from 'path';
import { SPEC_FILE_TEMPLATE } from './constants/templates';

export async function createTestFileFromContext(uri: vscode.Uri) {
	if (!uri) {
		return;
	}
	
	const file = path.posix.parse(uri.path);
	const { dir, name, ext} = file;
	const spec = vscode.Uri.file(`${dir}/${name}.spec${ext}`);
	
	// if the file exists open it
	
	// if the file doesn't exist then create it

	const wsedit = new vscode.WorkspaceEdit();
	wsedit.createFile(spec, { ignoreIfExists: true });
	wsedit.set(spec, [vscode.TextEdit.insert(new vscode.Position(0, 0), SPEC_FILE_TEMPLATE)]);
	
	await vscode.workspace.applyEdit(wsedit);
	vscode.workspace.openTextDocument(spec).then(doc => vscode.window.showTextDocument(doc));
}

export async function createTestFileFromCommandPalette() {
    console.log('createTestFileFromCommandPalette was called');
}

export async function createComponentGroupFromContext(uri: vscode.Uri) {
    console.log('createComponentGroupFromContext was called');
}