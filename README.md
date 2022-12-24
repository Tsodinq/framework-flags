# `framework-flags`

[![CI](https://github.com/Tsodinq/framework-flags/actions/workflows/ci.yml/badge.svg)](https://github.com/Tsodinq/framework-flags/actions/workflows/ci.yml)
[![CodeFactor](https://www.codefactor.io/repository/github/tsodinq/framework-flags/badge)](https://www.codefactor.io/repository/github/tsodinq/framework-flags)

This is a simple Express-based web server that serves dynamic 'feature flags' to Framework (although it could be used for any other project). It's designed to be used in conjunction with the [framework-flags-client](https://github.com/Tsodinq/framework-flags-client) package in a Next.js project.

## API

Documentation for API endpoints this server exposes are as follows:

### **`GET`** `/flags/:environment`

Returns a JSON object containing all flags for the specified environment.

#### Example Response

```json
{
  "newLogin": true,
  "newSignup": false
}
```

### **`PATCH`** `/flags/:environment/:key`

Updates the value of a flag for the specified environment, and returns the updated flag bag.

#### Headers

| Name            | Value                                                                                    |
| --------------- | ---------------------------------------------------------------------------------------- |
| `Authorization` | API token found inside the flag JSON file (`_apikey` key) (example: `Bearer 1234567890`) |

#### Body

| Name    | Value                                      |
| ------- | ------------------------------------------ |
| `value` | Valid flag value (string, number, boolean) |

### **`DELETE`** `/flags/:key`

Deletes a flag from all environments, and returns the updated flag bag.

#### Headers

| Name            | Value                                                                                    |
| --------------- | ---------------------------------------------------------------------------------------- |
| `Authorization` | API token found inside the flag JSON file (`_apikey` key) (example: `Bearer 1234567890`) |

### **`PUT`** `/flags/:key`

Creates a flag for all environments, and returns the updated flag bag. Creating flags for specific environments is not supported, as it'll result in sync issues between environments and will cause problems in client implementations.

#### Headers

| Name            | Value                                                                                    |
| --------------- | ---------------------------------------------------------------------------------------- |
| `Authorization` | API token found inside the flag JSON file (`_apikey` key) (example: `Bearer 1234567890`) |

#### Body

| Name    | Value                                      |
| ------- | ------------------------------------------ |
| `value` | Valid flag value (string, number, boolean) |

## License

This project is licensed under the terms of the [MIT license](/LICENSE). This license does not grant you rights to use the name of the project (or service marks/trademarks associated with Soodam.re) or its contributors in advertising or publicity pertaining to distribution of the software without specific, written prior permission.
