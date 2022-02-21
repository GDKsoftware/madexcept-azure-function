
# MadExcept-Azure-Function

Azure function that accepts POST requests from MadExcept and saves to attached logging to both Grafana (a short summary) and to Azure (the full logging and images)

## Required Environment variables

* LOKIHOST for the Loki host url (example: https://logs-prod-eu-west-0.grafana.net)
* LOKIAUTH user:apikey (api key requires role MetricsPublisher)
* WEBSITE_CONTENTAZUREFILECONNECTIONSTRING for the azure connection string

## More info about Azure functions

Go to the [blog](blog.md)
