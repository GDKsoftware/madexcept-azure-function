
# MadExcept-Azure-Function

Azure function that accepts POST requests from MadExcept and saves to attached logging to different reporting services.

## Development requirements

* Node.js v16
* VSCode extension https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions
* Azure Function Core Tools https://github.com/Azure/azure-functions-core-tools#installing

## Required Environment variables

* LOKIHOST for the Loki host url (example: https://logs-prod-eu-west-0.grafana.net)
* LOKIAUTH user:apikey (api key requires role MetricsPublisher)
* WEBSITE_CONTENTAZUREFILECONNECTIONSTRING for the azure connection string
* USE_BUGSNAG set to `1` if you want to send bugreports to Bugsnag
* BUGSNAG_FILTERS colon separated list of the names of filters to differentiate different applications
  - `BUGSNAG_FILTERS=app1:app2`
* [FILTERNAME]_RE a regular expression to recognize the executable name of the application
  - `APP1_RE=app1\.exe`
  - `APP2_RE=app2_[\d\.]*\.exe`
* [FILTERNAME]_API_KEY the bugsnag api key for the application
  - `APP1_API_KEY=1234abcd`

## How to use

This project is intended to be used in Azure or locally in VSCode.

* npm run lint - Run the linter
* npm run lintfix - Run the linter and fix formatting
* npm run test - Run the unittests
* npm run start - Run locally

## More info about Azure functions

Go to the [blog](blog.md)
