# MCP Server

TODO:

---

## **Setup Instructions**

### **1. Clone the Repository**

```bash
git clone <repository-url>
cd <project>
```

### **2. Install Dependencies**

```bash
npm install
```

### **3. Run the project**

```bash
npm run start
```

## Running the Application with Docker

### Build the Docker Image

```bash
docker build -t mcp-server .
```

### Run the Docker Container

```bash
docker run -e BASE_URL=desk-booking-api-url \
           -e PERSONAL_ACCESS_TOKEN=your-secret-token \
           -e PORT=8080 \
           -p 8080:8080 \
           mcp-server
```
