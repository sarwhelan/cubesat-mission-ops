# Getting Started

### Sample JSON Telemetry Dump
```
[
    {
		"systemID": 1,
		"components": [{
				"componentID": 1,
				"telemetryReports": [{
						"componentTelemetryID": 1,
						"readings": [{
								"telemetryValue": 32,
								"telemetryTypeID": 1,
								"collectionDateTime": "2019-02-28 02:22:22"
							},
							{
								"telemetryValue": 15,
								"telemetryTypeID": 2,
								"collectionDateTime": "2019-02-27 03:24:29"
							}
						]
					},
					{

					}
				]
			},
			{
				"componentID": 2,
				"telemetryReports": [{
						"componentTelemetryID": 3,
						"readings": [{
							"telemetryValue": 32,
							"telemetryTypeID": 1,
							"collectionDateTime": "2019-02-26 04:12:12"
						}]
					},
					{
						"componentTelemetryID": 4,
						"readings": [{
							"telemetryValue": 32,
							"telemetryTypeID": 1,
							"collectionDateTime": "2019-02-27 13:00:23"
						}]
					}
				]
			}
		]
	},
	{
		"systemID": 2,
		"components": [{
				"componentID": 1,
				"telemetryReports": [{
						"componentTelemetryID": 1,
						"readings": [{
								"telemetryValue": 32,
								"telemetryTypeID": 1,
								"collectionDateTime": "2019-02-27 12:22:39"
							},
							{
								"telemetryValue": 15,
								"telemetryTypeID": 2,
								"collectionDateTime": "2019-02-26 15:50:22"
							}
						]
					},
					{

					}
				]
			},
			{
				"componentID": 2,
				"telemetryReports": [{
						"componentTelemetryID": 3,
						"readings": [{
							"telemetryValue": 32,
							"telemetryTypeID": 1,
							"collectionDateTime": "2019-02-28 019:00:00"
						}]
					},
					{
						"componentTelemetryID": 4,
						"readings": [{
							"telemetryValue": 32,
							"telemetryTypeID": 1,
							"collectionDateTime": "2019-02-27 08:22:11"
						}]
					}
				]
			}
		]
	}
]
```

### Starting the server
`npm install nodemon`

navigate to /backend/cubesat-appserver

`nodemon server.js`
