# Langoustine VS Code extension

<!--toc:start-->
- [Langoustine VS Code extension](#langoustine-vs-code-extension)
  - [Installation](#installation)
  - [Configuration](#configuration)
    - [Passing arguments](#passing-arguments)
<!--toc:end-->

This is a simple VS code extension intended for people interested in writing Language Servers (**LS**).

It is designed to simplify development experience when working with language servers - instead of 
writing a dedicated VS Code extension for each, you can just configure a server for a particular file extension.

## Installation 

Until this extension is published to Marketplace, please download `langoustine-vscode.vsix` from [Releases](https://github.com/neandertech/langoustine-vscode/releases).
The extension can then be installed from the file (`Extensions: Install from VSIX` in command palette)

## Configuration

Let's assume you want to install the [LLVM IR](https://github.com/indoorvivants/llvm-ir-lsp) language server locally
and use it for files ending with `.ll`

1. First you downloaded the  binary for your platform (let's say MacOS), and 
   put it in `/usr/local/bin/LLVM_LanguageServer-x86_64-apple-darwin`

2. Then you installed this VS Code extension

3. Next you need to add a configuration into your user settings (`Preferences: Open User Settings (JSON)` in command palette):

  ```json
      "langoustine-vscode.servers": [
        {
            "name": "LLVM LSP",
            "extension": "ll",
            "command": "/usr/local/bin/LLVM_LanguageServer-x86_64-apple-darwin"
        }
    ]
  ```

After you reload the VS Code window and open a `.ll` file you should have the LSP features available!

### Passing arguments

Let's say your LSP command requires some arguments. 
For example, if you decided you want to use [Langoustine Tracer](https://neandertech.github.io/langoustine/tracer.html), then you would configure the extension as following:


  ```json
      "langoustine-vscode.servers": [
        {
            "name": "LLVM LSP",
            "extension": "ll",
            "command": "langoustine-tracer",
            "args": [
              "/usr/local/bin/LLVM_LanguageServer-x86_64-apple-darwin"
            ]
        }
    ]
  ```

Where `langoustine-tracer` is the path to [Tracer's binary](https://neandertech.github.io/langoustine/tracer.html#packaging-with-coursier).
