# Account-creator
Account Creator for Private Backends
A command-line tool designed to manage account creation for private backends. This tool is compatible with projects such as Reload or Lawin V2. It features a direct connection to MongoDB and optional Discord integration for simplified user identification.

## Features
Compatibility: Designed for use with Lawin V2, Reload, and similar private backends

Discord Integration: Fetch and search for server members directly through a Discord Bot.

Manual Mode: Option to manually input Discord IDs if the user is not in the server or if the bot is offline.

Automated Setup: Profile and Friends data are automatically initialized upon account creation.

Logging: Optional local file logging for all account creation actions.

## Requirements
Node.js v18 or higher.

MongoDB instance (local or hosted).

Discord Bot Token (required for member search mode).

## Important: Discord Bot Setup
If you enable useDiscord, you must configure your bot in the Discord Developer Portal:

Navigate to the Bot tab in your Application settings.

Scroll down to the Privileged Gateway Intents section.

Toggle the Server Members Intent to ON. Failure to enable this intent will prevent the tool from fetching the member list.

## Installation
Clone the repository to your local machine.

Run the install.bat file to install all necessary dependencies.

Configure your Config.json with your database and bot details.

## Usage
Run the script using Node.js: node structs/fullcreate.js

Upon launching, you will be prompted to:

Select a mode (Search or Manual) for the Discord ID.

Enter the account email address.

Enter the desired username.

Enter the account password.

The tool will validate the information and create the entries in your MongoDB collections.
