/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import { Server } from 'http';
import * as path from 'path';
import {
	workspace as Workspace, window as Window, ExtensionContext, TextDocument, OutputChannel, WorkspaceFolder, Uri
} from 'vscode';

import {
	Disposable,
	DocumentFilter,
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient/node';


interface LangoustineServer {
	language?: string;
	extension?: string;
	command: string;
	name: string;
}

const clients: Map<DocumentFilter, LanguageClient> = new Map();

export function activate(context: ExtensionContext) {
	const servers: LangoustineServer[] =
		Workspace.getConfiguration('langoustine-vscode').get('servers', []);
	const outputChannel: OutputChannel = Window.createOutputChannel('langoustine-vscode');

	function didOpenTextDocument(document: TextDocument): void {
		outputChannel.appendLine(document.languageId);
		// We are only interested in language mode text
		if (document.languageId !== 'plaintext' || (document.uri.scheme !== 'file' && document.uri.scheme !== 'untitled')) {
			return;
		}
		servers.forEach(element => {

			const filter: DocumentFilter = {
				scheme: 'file',
				language: element.language ? element.language : "plaintext",
			};

			if (element.extension) {
				filter.pattern = `*.{${element.extension}}`;
			}
			if (!clients.has(filter)) {
				Window.showInformationMessage(`Creating a new client for ${JSON.stringify(filter)}`);


				const clientOptions: LanguageClientOptions = {
					documentSelector: [filter],
					outputChannel: outputChannel
				};

				const serverOptions: ServerOptions = {
					command: element.command
				};
				const client = new LanguageClient(
					element.name,
					element.name,
					serverOptions,
					clientOptions,
				);

				clients.set(filter, client);

				client.start();
			} else {
				Window.showInformationMessage(`Client for ${JSON.stringify(filter)} is already present`);
			}
		});


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