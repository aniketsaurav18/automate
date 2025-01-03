package http

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

var HttpClient = &http.Client{}

// Handle requests that require a body (POST, PUT, PATCH, etc.)
func HttpRequestWithBody(h *HttpJob) {
	var body *bytes.Buffer

	// If the body is provided, create a buffer with the body content
	if h.Input.Body != "" {
		body = bytes.NewBuffer([]byte(h.Input.Body))
	} else {
		// For POST, PUT, PATCH, an empty buffer can be used if body is not provided.
		body = &bytes.Buffer{}
	}

	req, err := http.NewRequest(h.Input.Method, h.Input.URL, body)
	if err != nil {
		fmt.Println("Error creating HTTP request with body:", err)
		return
	}

	// Add query parameters to the URL if present
	if len(h.Input.Parameters) != 0 {
		q := req.URL.Query()
		for key, val := range h.Input.Parameters {
			q.Add(key, val)
		}
		req.URL.RawQuery = q.Encode()
	}

	// Set headers if present
	if len(h.Input.Headers) != 0 {
		for key, val := range h.Input.Headers {
			req.Header.Set(key, val)
		}
	}

	res, err := HttpClient.Do(req)
	if err != nil {
		fmt.Println("Error executing HTTP request:", err)
		return
	}
	defer res.Body.Close()

	processResponse(res)
}

// Handle requests that do not require a body (GET, DELETE, etc.)
func HttpRequestWithoutBody(h *HttpJob) {
	req, err := http.NewRequest(h.Input.Method, h.Input.URL, nil)
	if err != nil {
		fmt.Println("Error creating HTTP request without body:", err)
		return
	}

	// Add query parameters to the URL if present
	if len(h.Input.Parameters) != 0 {
		q := req.URL.Query()
		for key, val := range h.Input.Parameters {
			q.Add(key, val)
		}
		req.URL.RawQuery = q.Encode()
	}

	// Set headers if present
	if len(h.Input.Headers) != 0 {
		for key, val := range h.Input.Headers {
			req.Header.Set(key, val)
		}
	}

	res, err := HttpClient.Do(req)
	if err != nil {
		fmt.Println("Error executing HTTP request:", err)
		return
	}
	defer res.Body.Close()

	processResponse(res)
}

// Process the response for both methods
func processResponse(res *http.Response) {
	var result = &HttpJobOutput{
		StatusCode: res.StatusCode,
		Headers:    res.Header,
	}

	resBody, err := io.ReadAll(res.Body)
	if err != nil {
		fmt.Println("Error reading response body:", err)
		result.Body = "Error reading response body"
	} else {
		result.Body = string(resBody)
	}

	fmt.Println("Response Status Code:", result.StatusCode)
	fmt.Println("Response Headers:")
	formattedHeaders, err := json.MarshalIndent(result.Headers, "", "  ")
	if err != nil {
		fmt.Println("Error marshaling response headers:", err)
	} else {
		fmt.Println(string(formattedHeaders))
	}
	fmt.Println("Response Body:", result.Body)
}

func ExecuteHttpJob(h *HttpJob) {
	if h.Key != "http" {
		fmt.Println("Invalid job key")
		return
	}
	if h.Input.Method == "" {
		fmt.Println("HTTP method not specified")
		return
	}

	switch h.Input.Method {
	case "GET", "DELETE":
		HttpRequestWithoutBody(h) // No body for GET or DELETE
	default:
		HttpRequestWithBody(h) // Requires body (POST, PUT, PATCH, etc.)
	}
}
