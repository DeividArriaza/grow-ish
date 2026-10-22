package main

import (
	"log"
	"net/http"
	"os"
	"time"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	if _, err := os.Stat("dist/index.html"); err != nil {
		log.Fatal("Primero ejecuta npm install y npm run build para generar dist/.")
	}

	mux := http.NewServeMux()
	mux.Handle("/", http.FileServer(http.Dir("dist")))
	server := &http.Server{
		Addr:              ":" + port,
		Handler:           mux,
		ReadHeaderTimeout: 5 * time.Second,
		IdleTimeout:       60 * time.Second,
	}

	log.Printf("Grown-Ish disponible en http://localhost:%s", port)
	log.Fatal(server.ListenAndServe())
}
