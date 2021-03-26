import * as vscode from 'vscode';

export async function openTextDocumentInEditor(content: string, language?: string) {
    const document: vscode.TextDocument = await vscode.workspace.openTextDocument({
        language,
        content,
    });
	return document;
}