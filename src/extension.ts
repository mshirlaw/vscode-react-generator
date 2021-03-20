import * as vscode from 'vscode';
import { createTestFileFromContext, createTestFileFromCommandPalette, createComponentGroupFromContext } from './generator';

export function activate(context: vscode.ExtensionContext) {
	
	context.subscriptions.push(
		vscode.commands.registerCommand('vscode-react-generator.createTestFileFromContext', createTestFileFromContext)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('vscode-react-generator.createTestFileFromCommandPalette', createTestFileFromCommandPalette)
	);
	
	context.subscriptions.push(
		vscode.commands.registerCommand('vscode-react-generator.createComponentGroupFromContext', createComponentGroupFromContext)
	);
}

export function deactivate() {}
