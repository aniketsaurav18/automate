package main

import (
	"executor/apps/http"
)

func main() {
	// job := http.HttpJob{
	// 	Key: "http",
	// 	Input: http.HttpJobInput{
	// 		URL:    "https://jsonplaceholder.typicode.com/posts",
	// 		Method: "POST",
	// 		Headers: map[string]string{
	// 			"Content-Type": "application/json; charset=UTF-8",
	// 		},
	// 		// Parameters: map[string]string{
	// 		// 	"query": "golang",
	// 		// },
	// 		Body: `{"title": "foo", "body": "bar", "userId": 1}`,
	// 	},
	// }
	job2 := http.HttpJob{
		Key: "http",
		Input: http.HttpJobInput{
			URL:    "https://jsonplaceholder.typicode.com/comments",
			Method: "GET",
			Headers: map[string]string{
				"Content-Type": "application/json; charset=UTF-8",
			},
			Parameters: map[string]string{
				"postId": "1",
			},
			Body: "",
		},
	}

	http.ExecuteHttpJob(&job2)
}
