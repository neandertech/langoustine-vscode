/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import { Server } from 'http';
import * as path from 'path';
import * as vscode from 'vscode';
import {
	workspace as Workspace, window as Window, ExtensionContext, TextDocument, OutputChannel
} from 'vscode';


import {
	Disposable,
	DocumentFilter,
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind,
	VersionedTextDocumentIdentifier
} from 'vscode-languageclient/node';


interface LangoustineServer {
	name: string;
	extension: string;
	command: string;
	args: string[];
}

const clients: Map<LangoustineServer, LanguageClient> = new Map();

export function activate(
	context: ExtensionContext
) {
	const servers: LangoustineServer[] =
		Workspace.getConfiguration('langoustine-vscode').get('servers', []);
	const outputChannel: OutputChannel = Window.createOutputChannel('langoustine-vscode');

	servers.forEach(serverDef => {
		if (!clients.has(serverDef)) {

			const filter: DocumentFilter = {
				scheme: 'file',
				pattern: `**/*.${serverDef.extension}`
			};

			const clientOptions: LanguageClientOptions = {
				documentSelector: [filter],
				outputChannel: outputChannel
			};

			Window.showInformationMessage(`Creating a new client for ${JSON.stringify(clientOptions)}`);


			const serverOptions: ServerOptions = {
				command: serverDef.command,
				args: serverDef.args
			};
			const client = new LanguageClient(
				serverDef.name,
				serverDef.name,
				serverOptions,
				clientOptions,
			);

			clients.set(serverDef, client);
			context.subscriptions.push(client.start());
		} else {
			Window.showInformationMessage(`Client for ${JSON.stringify(serverDef)} is already present`);
		}
	});




	function didOpenTextDocument(document: TextDocument): void {
		outputChannel.appendLine(document.languageId);
		// // We are only interested in language mode text
		// if (document.languageId !== 'plaintext' || (document.uri.scheme !== 'file' && document.uri.scheme !== 'untitled')) {
		// 	return;
		// }
	}

	Workspace.onDidOpenTextDocument(didOpenTextDocument);
	Workspace.textDocuments.forEach(didOpenTextDocument);
}

export function deactivate(): Thenable<void> {
	const promises: Thenable<void>[] = [];
	for (const client of clients.values()) {
		promises.push(client.stop());
	}
	return Promise.all(promises).then(() => undefined);
}
