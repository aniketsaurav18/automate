package http

import (
	"bytes"
	"fmt"
	"net/http"
)

func PostRequestHandler (h *HttpJob) {
	post_body := []byte(h.Input.Body)
	req_url := h.Input.URL

	if len(h.Input.Parameters) != 0 {
		req_url += "?"
		for key,val := range h.Input.Parameters{
			req_url += key+"="+val
		}
	} 
	
	req, err := http.NewRequest(h.Input.Method, h.Input.URL, bytes.NewBuffer(post_body))
	if(err != nil){
		fmt.Println("Error while making post req")
		return
	}

	for key, val:= range h.Input.Headers {
		req.Header.Set(key, val);
	}

	

}

func ExecuteHttpJob (h *HttpJob) {
	http.NewRequest(h.Key, h.Input.URL, )
}
