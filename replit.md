# Running on Replit

The project keeps its original two-part structure:

- `backend/`: Express API on port 3000
- `frontend/`: React/Vite app on port 5000

Use the **Start application** workflow. It runs `./start.sh`, which starts both services. The frontend sends API requests to the same origin under `/api`; Vite proxies those requests to the backend during development.

No external service credentials are required. Application data is stored locally by the backend.