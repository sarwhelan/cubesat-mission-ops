# Getting Started

## INSTALL ALL THE THINGS!
 - Install pip (comes pre-installed with python, but may need to be upgraded with `python -m pip install --upgrade pip`).
 - Install AWS CLI with `pip install awscli --upgrade --user`.
 - Install [Docker](https://www.docker.com/products/docker-desktop).
 - Install AWS SAM SLI with `pip install --user --upgrade aws-sam-cli`.

## Setup
1) Run `aws configure`, which will ask you for four things:
	- *AWS access key ID*: go to the [IAM console](https://console.aws.amazon.com/iam/home) > Users > Administrator > Security Credentials > Create Access Key, and create a new access key for yourself. Use its access key id for this.
	- *AWS secret access key*: use the secret access key you generate above.
	- *default region name*: use `us-east-2`
	- *default output format*: use `json`
2) Make sure your drive is shared in docker (Docker > Settings > Shared Drives), otherwise `sam` will crash when you try to build.

## Builiding
1) If you made any changes to the yaml config file, run `sam validate` to make sure it's valid first.
2) Run `sam build` in the same directory as the yaml config file.

## Debugging Locally
1) Launch debug from terminal: `sam local invoke -d 5858 {-e event-json-file.json OR --no-event} {name-of-lambda-from-template.yaml}`.
2) **OR** use `sam local start-api -d 5858` to run the api locally, although you will then need to make a request to the endpoint with something like postman or a web browser.
3) Launch vscode debug by clicking debug and choosing the "Attach to SAM CLI" config. If that option isn't available, make sure you have it in your .vscode/launch.json file, which should be included in the repository. You'll generally want to wait a second before starting the debug, since it takes a moment for it to spin up the docker container and start running, during which time the debugger may time out. The process will wait for the debugger to attach before running though, so you won't miss anything.
4) Code should run and stop at your breakpoint(s).

## Deploying

### The Easy Way

1) run `deploy-backend.sh`. All this does is run the shell commands you would normally run by hand so you don't have to.

### The Hard Way

1) Make sure you've built the project (using `sam build`), otherwise you won't deploy the latest version.
2) Package the project by running `sam package --output-template-file packaged.yaml --s3-bucket western-cubesat-backend`.
2) Deploy with `sam deploy --template-file packaged.yaml --stack-name cubesat-backend --capabilities CAPABILITY_IAM --region us-east-2`.

## Add a New Lambda/API Route
1) create a copy of the `template.js` file and rename it to whatever you want
2) put your lambda code in the file following the format given in the template:
```
exports.{function-name} = async (event, context) => {
	// do whatever you need to here
	return response;	// response must be a valid json response object, otherwise the api gets cranky
};
```
3) Add the following to template.yaml in the resources section:
```
{name-of-lambda-on-AWS}:
	Type: AWS::Serverless::Function
	Properties:
		CodeUri: cubesat-backed/
		Handler: {code-filename-without-extension}.{function-name}
		Runtime: nodejs8.10
		Environment:	# This section is optional
			Variables:
				{custom-variable-name}: {variable-string-value}
		Policies:		# This section is optional
			- {policy-name}:
				{policy-attribute-name}: {policy-attribute-value}
		Events:
			{name-of-event-on-AWS}:
				Type: Api
				Properties:
					Path: /{api-route}
					Method: {http-method}
```
[docs](https://github.com/awslabs/serverless-application-model/blob/develop/versions/2016-10-31.md#awsserverlessfunction)

4) Fill out all of the `{variables}` listed in there.
5) If the lambda needs database access, you'll also need to add this policy:
```
Policies:
	- DynamoDBCrudPolicy:
		TableName: !Ref {table-name}
```
where the the table name is the name of the table object listed in the template.yaml file.

## Add a New Table
1) Add the following to template.yaml in the resources section:
```
{name-of-table-on-AWS}:
	Type: AWS::Serverless::SimpleTable		# for a more advanced table, use AWS::DynamoDB::TABLE
	Properties:
		TableName: {name-of-table}
		PrimaryKey:
			Name: {name-of-PK}
			Type: {data-type-of-PK}			# can be String, Number, or Binary
```
[docs](https://github.com/awslabs/serverless-application-model/blob/develop/versions/2016-10-31.md#awsserverlesssimpletable)

## Find it Online

 - View all of the resources used by this on [Cloudformation](https://us-east-2.console.aws.amazon.com/cloudformation/home) and open the `cubesat-backend` stack. Cloudformation is region-specific, so if you don't see `cubesat-backend` make sure you're in `us-east-2` (Ohio).
 - The API endpoint root is https://qpj4y1ve6d.execute-api.us-east-2.amazonaws.com/Prod/ but you can also find it (and anything else in the Output section of template.yaml) under the Outputs section of the Cloudformation page.
 - All of the resources created by this can also be accessed via their individual service consoles, although changes made their won't be reflected in the template.yaml configuration and may cause issues.