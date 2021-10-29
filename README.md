# discord-crosspost-auto-translate

Automatically translates and replies to cross-posted messages.

## Requirements

- Node.js `v16` (Tested with `v16.12.0`)

## Run

- Compile & Run: `yarn build`
- Run: `yarn start`
- Compile only: `yarn compile`
- Development(Hot reload): `yarn dev`

## Installation

1. Create a Google Apps Script file and write the contents of `gasScript.js`.
2. Click `Deploy` -> `New deploy` and create a new deployment for the `web app`.  
   Specify "everyone" as the user who can access.
3. Copy the URL of the created web app.

## Configuration

Configuration file is `config/production.yml` or `config/development.yml`

- `discordToken`: Discord bot token
- `GASUrl`: The URL of the web app copied by `Installation`.
  - e.g, `https://script.google.com/macros/s/XXXXXXXXXXXXXXXXXXXX/exec`
