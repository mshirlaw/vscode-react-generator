import * as vscode from 'vscode';

export async function openTextDocumentInEditor(content: string, language?: string) {
    const document = await vscode.workspace.openTextDocument({
        language,
        content,
    });
	return document;
}