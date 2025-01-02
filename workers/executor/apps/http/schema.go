package http

type HttpJob struct {
	Key    string         `json:"key"` // Should always be "http"
	Input  HttpJobInput   `json:"input"`
	Output *HttpJobOutput `json:"output,omitempty"` // Optional field
}

type HttpJobInput struct {
	URL        string            `json:"url"`        // Must be a valid URL
	Method     string            `json:"method"`     // Enum of HTTP methods
	Headers    map[string]string `json:"headers"`    // Record of header key-value pairs
	Parameters map[string]string `json:"parameters"` // Query parameters as key-value pairs
	Body       string            `json:"body"`       // Request body
}

type HttpJobOutput struct {
	StatusCode int                 `json:"statusCode"` // HTTP status code
	Headers    map[string][]string `json:"headers"`    // Response headers
	Body       string              `json:"body"`       // Response body
}
