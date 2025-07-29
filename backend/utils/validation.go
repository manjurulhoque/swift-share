package utils

import (
	"fmt"
	"reflect"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

var validate *validator.Validate

func init() {
	validate = validator.New()

	// Register custom tag name function
	validate.RegisterTagNameFunc(func(fld reflect.StructField) string {
		name := strings.SplitN(fld.Tag.Get("json"), ",", 2)[0]
		if name == "-" {
			return ""
		}
		return name
	})
}

// ValidateStruct validates a struct and returns formatted error messages
func ValidateStruct(s interface{}) map[string]string {
	errors := make(map[string]string)

	if err := validate.Struct(s); err != nil {
		if validationErrors, ok := err.(validator.ValidationErrors); ok {
			for _, e := range validationErrors {
				field := e.Field()
				tag := e.Tag()

				switch tag {
				case "required":
					errors[field] = fmt.Sprintf("%s is required", field)
				case "email":
					errors[field] = fmt.Sprintf("%s must be a valid email address", field)
				case "min":
					errors[field] = fmt.Sprintf("%s must be at least %s characters long", field, e.Param())
				case "max":
					errors[field] = fmt.Sprintf("%s must be at most %s characters long", field, e.Param())
				case "oneof":
					errors[field] = fmt.Sprintf("%s must be one of: %s", field, e.Param())
				default:
					errors[field] = fmt.Sprintf("%s is invalid", field)
				}
			}
		}
	}

	return errors
}

// BindAndValidate binds JSON request and validates it
func BindAndValidate(c *gin.Context, obj interface{}) bool {
	if err := c.ShouldBindJSON(obj); err != nil {
		ErrorResponse(c, 400, "Invalid JSON format")
		return false
	}

	if validationErrors := ValidateStruct(obj); len(validationErrors) > 0 {
		ValidationErrorResponse(c, validationErrors)
		return false
	}

	return true
}

// GetValidator returns the validator instance
func GetValidator() *validator.Validate {
	return validate
}
