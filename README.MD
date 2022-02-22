
# MadExcept-Azure-Function

Azure function that accepts POST requests from MadExcept and saves to attached logging to both Grafana (a short summary) and to Azure (the full logging and images)

## Development requirements

* Node.js v16
* VSCode extension https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions
* Azure Function Core Tools https://github.com/Azure/azure-functions-core-tools#installing

## Required Environment variables

* LOKIHOST for the Loki host url (example: https://logs-prod-eu-west-0.grafana.net)
* LOKIAUTH user:apikey (api key requires role MetricsPublisher)
* WEBSITE_CONTENTAZUREFILECONNECTIONSTRING for the azure connection string

## How to use

This project is intended to be used in Azure or locally in VSCode.

* npm run lint - Run the linter
* npm run lintfix - Run the linter and fix formatting
* npm run test - Run the unittests
* npm run start - Run locally

## More info about Azure functions

Go to the [blog](blog.md)
