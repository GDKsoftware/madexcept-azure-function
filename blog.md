# Building an Azure function

Azure functions and AWS Lambda's are "serverless" applications - that you can deploy without having to setup an entire server. The part I will talk about here is mostly about the functions that can be triggered through HTTP endpoints and written in Node.js.

## Warning before reading

There is a lot of information on the Internet about Azure functions and not everything is kept up to date. Even Microsoft's own documentation isn't up to date. So I'll try to point you in the right direction without going into every detail.

## What you should know beforehand

An Azure function doesn't have to be a standalone application like you would normally develop with Node.js and Express module for example. There are special configurations and an endpoint that's called without you having to setup it yourself.

So if you want to write some code beforehand, make it as independent as possible that can be called from the Azure function. Of course this is generally good advice if you want to be able to unittest your code. Saving the code in at least a local GIT repo is recommended before starting to turn your project into an Azure function project, because the extension might override your `package.json`.

## The easy way with VSCode

In the VSCode extentions marketplace, you can find an easy to use extension to develop Azure functions: https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions

The readme of this extension also contains a step by step tuturial to get things to work. In order to test locally, make sure you also install the Azure Functions Core Tools for your OS https://github.com/Azure/azure-functions-core-tools#installing

Next to testing and deploying your function, with the extension you can also see and edit all the important bits that your function may need in terms of configuration. For first-time users this is much better than the maze that is the Azure portal.

You'll need to login to your Azure account in order to manage your Azure functions.

## To note about function creation

If you do not already have a Function App resources in your Azure, the extension will offer to create one. You don't give this the name of the function that you want to create, but the name will be in your URL. For example `https://thefunkyplace.azurewebsites.net`. So make sure this name is unique and more in line with your organisation or application than the specific function that you want to create.

Within the Function App resource you can define multiple functions.

### Premium function app

If you need more advanced settings, networking and scaling options for your functions, you'll need to create the function app with the Plan type: Functions Premium. More information about this can be found here https://docs.microsoft.com/en-us/azure/azure-functions/functions-scale?WT.mc_id=Portal-WebsitesExtension#overview-of-plans

Note that the minimum amount of active instances for the Premium is 1 - if your function is fast to startup and rarely called, this might be overkill.

## The endpoint

When you create your first function from the VSCode extension, you'll notice a new folder named after your function and an `index.js` (or similar) file. In this file you'll find the export `async function(context, req) {}` which is your entry point for the function when the URL of your function is called.

### HTTP Method

You can configure this further by editing the `function.json` file. Here you can change the HTTP methods which will be forwarded to your function, by default this is both get and post methods.

### Auth level

The Auth level manages security aspects of your function. There are currently 3 settings; function, admin and anonymous.

Special key hashes are generated for function and admin levels, that you'll have to share with anyone that wants to call the Azure function. This is useful if you want to setup multiple services that connect to each other.

When you use Auth Level anonymous, there's no hash to share and you can freely use the function from anywhere.

## Environment variables

You can provide configuration settings through environment variables. If you have deployed your function app in VSCode, you can find these in the extension under `Functions` - `YourAzureSubscription` - `thefunkyplace` - `Application Settings`. In the Azure portal you can find this in your Function app resource under `Settings` - `Configuration`.

Note that these settings are for all functions within the Function App.

### Local settings for testing

If you want to test locally with these settings, you'll need to copy them into a `local.settings.json` file. Note that whenever you change these local settings, you'll need to restart your test session. They will not be automatically updated like codechanges will do.

### Access to storage

By default (when not using an advanced configuration) your function will have access to its own storage resources, this is not only where the function will be stored, but also where you can add extra storage options like a Blob storage container.

These storage options will have connection url's associated with them. And by default you'll have access to `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING` which has the connection string you can use to access Azure storage options.

You can ofcourse also make use of existing storage options if you add a new setting. You can find the connection string in the Azure portal in your Storage account resource under `Security + networking` - `Access keys` and you press `Show keys`.

## Deploying your function

With the VSCode extension you can easily deploy your function. Once it is deployed, it's also automatically started, and your function will be available at `https://thefunkyplace.azurewebsites.net/api/yourfunction`

## Debugging your application

Testing your functions locally is the best thing you can do. And because you can easily connect to all of your other Azure resources, you're able to test as much as possible. But your deployed function still might behave differently in some situations, which makes debugging and logging an important part of developing functions.

### Debugging with Visual Studio

You can enable remote debugging with Visual Studio in the Azure portal in your Function App resource under `Settings` - `Configuration` - `General Settings`. I have not tested this, but it seems one of the better options.

### Logging

Once your function is deployed, you will not be able to see `console.log()` type loglines. You will need to use the `context.log()` function that Azure provides to your entry point. Be sure to pass that along to where you might need it.

You can view the logging from the Azure extension in VSCode under your function - `Logs` - `Connect to Log Stream` (or right-click your Function app and click `Start Streaming Logs`). In the Azure portal it's a little harder to find; it's in the Function app resources under `Functions` - `yourfunction` - `Monitor` - `Logs`.
