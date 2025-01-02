package http

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

var HttpClient = &http.Client{}

func PostRequestHandler(h *HttpJob) {
	post_body := []byte(h.Input.Body)
	req_url := h.Input.URL

	// Create a new HTTP request
	req, err := http.NewRequest(h.Input.Method, req_url, bytes.NewBuffer(post_body))
	if err != nil {
		fmt.Println("Error while making post request")
		return
	}

	// Add parameters to the URL if any
	if len(h.Input.Parameters) != 0 {
		q := req.URL.Query()
		for key, val := range h.Input.Parameters {
			q.Add(key, val)
		}
		req.URL.RawQuery = q.Encode()
	}

	// Set headers
	if len(h.Input.Headers) != 0 {
		for key, val := range h.Input.Headers {
			req.Header.Set(key, val)
		}
	}

	// Create an HTTP client and execute the request
	client := &http.Client{}
	res, err := client.Do(req)
	var result = &HttpJobOutput{}
	if err != nil {
		fmt.Println("Error while making request")
		fmt.Println(err)
	} else {
		result.StatusCode = res.StatusCode
		result.Headers = res.Header

		// Read the response body
		res_body, err := io.ReadAll(res.Body)
		if err != nil {
			fmt.Println("Error while reading the body")
			result.Body = "Error while reading the body"
		} else {
			result.Body = string(res_body)
		}
	}

	fmt.Println("Response Status Code")
	fmt.Println(result.StatusCode)
	fmt.Println("Response Headers")
	err = nil
	formatted_headers, err := json.MarshalIndent(result.Headers, "", "  ")
	if err != nil {
		fmt.Println("error while marshaling the response headers")
	}
	fmt.Println(string(formatted_headers))
	fmt.Println("Response Body:")
	fmt.Println(result.Body)
}

func GetRequestHandler(h *HttpJob) {
	if h.Key != "http" || h.Input.Method != "GET" {
		return
	}
	req_url := h.Input.URL

	// Create a new HTTP request
	req, err := http.NewRequest(h.Input.Method, req_url, nil)
	if err != nil {
		fmt.Println("Error while making get request")
		return
	}

	// Add parameters to the URL if any
	if len(h.Input.Parameters) != 0 {
		q := req.URL.Query()
		for key, val := range h.Input.Parameters {
			q.Add(key, val)
		}
		req.URL.RawQuery = q.Encode()
	}

	// Set headers if any
	if len(h.Input.Headers) != 0 {
		for key, val := range h.Input.Headers {
			req.Header.Set(key, val)
		}
	}

	res, err := HttpClient.Do(req)
	if err != nil {
		fmt.Println("Error while doing get request")
	}

	var result = &HttpJobOutput{}
	if err != nil {
		fmt.Println("Error while making request")
		fmt.Println(err)
	} else {
		result.StatusCode = res.StatusCode
		result.Headers = res.Header

		// Read the response body
		res_body, err := io.ReadAll(res.Body)
		if err != nil {
			fmt.Println("Error while reading the body")
			result.Body = "Error while reading the body"
		} else {
			result.Body = string(res_body)
		}
	}
	fmt.Println("Response Status Code")
	fmt.Println(result.StatusCode)
	fmt.Println("Response Headers")
	err = nil
	formatted_headers, err := json.MarshalIndent(result.Headers, "", "  ")
	if err != nil {
		fmt.Println("error while marshaling the response headers")
	}
	fmt.Println(string(formatted_headers))
	fmt.Println("Response Body:")
	fmt.Println(result.Body)
}

func ExecuteHttpJob(h *HttpJob) {
	if h.Input.Method == "GET" {
		GetRequestHandler(h)
	} else if h.Input.Method == "POST" {
		PostRequestHandler(h)
	} else {
		fmt.Println("Unrecognised method.")
	}
}
