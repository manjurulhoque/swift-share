// Package docs Code generated by swaggo/swag. DO NOT EDIT
package docs

import "github.com/swaggo/swag"

const docTemplate = `{
    "schemes": {{ marshal .Schemes }},
    "swagger": "2.0",
    "info": {
        "description": "{{escape .Description}}",
        "title": "{{.Title}}",
        "termsOfService": "http://swagger.io/terms/",
        "contact": {
            "name": "API Support",
            "url": "https://github.com/manjurulhoque/swift-share",
            "email": "support@swiftshare.com"
        },
        "license": {
            "name": "MIT",
            "url": "https://opensource.org/licenses/MIT"
        },
        "version": "{{.Version}}"
    },
    "host": "{{.Host}}",
    "basePath": "{{.BasePath}}",
    "paths": {
        "/auth/login": {
            "post": {
                "description": "Authenticate a user and return a JWT token",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "auth"
                ],
                "summary": "Login a user",
                "parameters": [
                    {
                        "description": "User login credentials",
                        "name": "user",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/models.UserLoginRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Login successful",
                        "schema": {
                            "$ref": "#/definitions/utils.APIResponse"
                        }
                    },
                    "400": {
                        "description": "Validation error",
                        "schema": {
                            "$ref": "#/definitions/utils.APIResponse"
                        }
                    },
                    "401": {
                        "description": "Invalid email or password",
                        "schema": {
                            "$ref": "#/definitions/utils.APIResponse"
                        }
                    },
                    "500": {
                        "description": "Internal server error",
                        "schema": {
                            "$ref": "#/definitions/utils.APIResponse"
                        }
                    }
                }
            }
        },
        "/auth/logout": {
            "post": {
                "security": [
                    {
                        "BearerAuth": []
                    }
                ],
                "description": "Log out the current user (mainly for audit purposes)",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "auth"
                ],
                "summary": "Logout user",
                "responses": {
                    "200": {
                        "description": "Logout successful",
                        "schema": {
                            "$ref": "#/definitions/utils.APIResponse"
                        }
                    }
                }
            }
        },
        "/auth/profile": {
            "get": {
                "security": [
                    {
                        "BearerAuth": []
                    }
                ],
                "description": "Get the current user's profile information",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "auth"
                ],
                "summary": "Get user profile",
                "responses": {
                    "200": {
                        "description": "Profile retrieved successfully",
                        "schema": {
                            "$ref": "#/definitions/utils.APIResponse"
                        }
                    },
                    "401": {
                        "description": "Unauthorized",
                        "schema": {
                            "$ref": "#/definitions/utils.APIResponse"
                        }
                    }
                }
            },
            "put": {
                "security": [
                    {
                        "BearerAuth": []
                    }
                ],
                "description": "Update the current user's profile information",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "auth"
                ],
                "summary": "Update user profile",
                "parameters": [
                    {
                        "description": "User profile update information",
                        "name": "user",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/models.UserUpdateRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Profile updated successfully",
                        "schema": {
                            "$ref": "#/definitions/utils.APIResponse"
                        }
                    },
                    "400": {
                        "description": "Validation error",
                        "schema": {
                            "$ref": "#/definitions/utils.APIResponse"
                        }
                    },
                    "401": {
                        "description": "Unauthorized",
                        "schema": {
                            "$ref": "#/definitions/utils.APIResponse"
                        }
                    },
                    "409": {
                        "description": "Email already registered",
                        "schema": {
                            "$ref": "#/definitions/utils.APIResponse"
                        }
                    },
                    "500": {
                        "description": "Internal server error",
                        "schema": {
                            "$ref": "#/definitions/utils.APIResponse"
                        }
                    }
                }
            }
        },
        "/auth/register": {
            "post": {
                "description": "Create a new user account",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "auth"
                ],
                "summary": "Register a new user",
                "parameters": [
                    {
                        "description": "User registration information",
                        "name": "user",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/models.UserRegisterRequest"
                        }
                    }
                ],
                "responses": {
                    "201": {
                        "description": "User registered successfully",
                        "schema": {
                            "$ref": "#/definitions/utils.APIResponse"
                        }
                    },
                    "400": {
                        "description": "Validation error",
                        "schema": {
                            "$ref": "#/definitions/utils.APIResponse"
                        }
                    },
                    "409": {
                        "description": "Email already registered",
                        "schema": {
                            "$ref": "#/definitions/utils.APIResponse"
                        }
                    },
                    "500": {
                        "description": "Internal server error",
                        "schema": {
                            "$ref": "#/definitions/utils.APIResponse"
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "models.UserLoginRequest": {
            "type": "object",
            "required": [
                "email",
                "password"
            ],
            "properties": {
                "email": {
                    "type": "string"
                },
                "password": {
                    "type": "string"
                }
            }
        },
        "models.UserRegisterRequest": {
            "type": "object",
            "required": [
                "email",
                "first_name",
                "last_name",
                "password"
            ],
            "properties": {
                "email": {
                    "type": "string"
                },
                "first_name": {
                    "type": "string",
                    "maxLength": 50,
                    "minLength": 2
                },
                "last_name": {
                    "type": "string",
                    "maxLength": 50,
                    "minLength": 2
                },
                "password": {
                    "type": "string",
                    "minLength": 6
                }
            }
        },
        "models.UserUpdateRequest": {
            "type": "object",
            "properties": {
                "email": {
                    "type": "string"
                },
                "first_name": {
                    "type": "string",
                    "maxLength": 50,
                    "minLength": 2
                },
                "last_name": {
                    "type": "string",
                    "maxLength": 50,
                    "minLength": 2
                }
            }
        },
        "utils.APIResponse": {
            "type": "object",
            "properties": {
                "data": {},
                "error": {},
                "message": {
                    "type": "string"
                },
                "meta": {},
                "success": {
                    "type": "boolean"
                }
            }
        }
    },
    "securityDefinitions": {
        "BearerAuth": {
            "description": "Type \"Bearer\" followed by a space and JWT token.",
            "type": "apiKey",
            "name": "Authorization",
            "in": "header"
        }
    }
}`

// SwaggerInfo holds exported Swagger Info so clients can modify it
var SwaggerInfo = &swag.Spec{
	Version:          "1.0",
	Host:             "localhost:8080",
	BasePath:         "/api/v1",
	Schemes:          []string{},
	Title:            "Swift Share API",
	Description:      "Professional file sharing platform API",
	InfoInstanceName: "swagger",
	SwaggerTemplate:  docTemplate,
	LeftDelim:        "{{",
	RightDelim:       "}}",
}

func init() {
	swag.Register(SwaggerInfo.InstanceName(), SwaggerInfo)
}
