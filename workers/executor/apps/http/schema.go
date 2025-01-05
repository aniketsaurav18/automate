package http

type HttpJob struct {
	Key    string         `json:"key"` // Should always be "http"
	Input  HttpJobInput   `json:"input"`
	Output *HttpJobOutput `json:"output,omitempty"` // Optional field
}

type HttpJobInput struct {
	URL        string            `json:"url"`
	Method     string            `json:"method"`
	Headers    map[string]string `json:"headers"`
	Parameters map[string]string `json:"parameters"`
	Body       string            `json:"body"` // stringified Request body
}

type HttpJobOutput struct {
	StatusCode int                 `json:"statusCode"`
	Headers    map[string][]string `json:"headers"`
	Body       string              `json:"body"`
}
