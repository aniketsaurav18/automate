package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/robfig/cron/v3"
)

func ExecuteQuery(conn *pgx.Conn){
	ctx := context.
	res, err := conn.Exec()
}

func main() {
	// Connecting to DB
	dsn := "postgres://username:password@localhost:5432/mydatabase"
	conn, err := pgx.Connect(context.Background(), dsn)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}
	defer conn.Close(context.Background())

	fmt.Println("Connected to the database!")

	// Create a new cron instance
	c := cron.New()

	// Add a cron job
	_, err = c.AddFunc("@every 10s", func() {
		fmt.Printf("Cron job executed at %s\n", time.Now().Format(time.RFC1123))
	})
	if err != nil {
		fmt.Println("Error adding cron job:", err)
		return
	}

	// Start the cron scheduler
	c.Start()
	defer c.Stop() // Ensure the scheduler is stopped on exit

	fmt.Println("Cron scheduler started. Press Ctrl+C to stop.")
	// Keep the program running
	select {}
}
