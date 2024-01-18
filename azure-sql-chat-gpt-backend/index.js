let express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require('dotenv');
const sql = require('mssql');

//<editor-fold desc="Server Set Up">
const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();

let allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3002",
  "http://localhost:3001",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        let msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    }
  })
);

app.use(function (req, res, next) {
  let origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin); // restrict it to the required domain
  }

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json({limit: '50mb'}));

// process.env.port for cloud services
app.listen(process.env.PORT || PORT, function () {
  console.log("App listening on", PORT);
});

//</editor-fold>

// <editor-fold desc="Set up connections">

// TODO: OPEN AI CONNECTION
const {OpenAIClient, AzureKeyCredential} = require("@azure/openai");
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const azureApiKey = process.env.AZURE_OPENAI_KEY;
const openAIClient = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
const deploymentId = "gpt-35-turbo";

// TODO: SQL CONNECTION
console.log(process.env.SQL_PASSWORD)
const config = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  // Notice public keyword in the connection string
  // if you were to host this server on Azure you wouldn't need the public part
  server: 'sql-chat-gpt.public.f33fe70a0210.database.windows.net',
  database: "",
  options: {
    // THIS IS VERY IMPORTANT - Public endpoint is 3342, default is 1443 which is private
    port: 3342,
    encrypt: true,
  },
};
// Connect to the database
sql.connect(config, (err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to the database');
  }
});

//</editor-fold>

// <editor-fold desc="Functions">
async function getChatGptAnswer(messages) {
  const result = await openAIClient.getChatCompletions(deploymentId, messages);

  for (const choice of result.choices) {
    console.log(choice.message);
  }
}

//</editor-fold>

// <editor-fold desc="Routes">
app.get('/getChatGptAnswer', async function (req, res) {
  const messageHistory = req.body.messages
  const chatGptAnswer = getChatGptAnswer(messageHistory);
  console.log('chatGptAnswer')
  console.log(chatGptAnswer)
  res.write(chatGptAnswer)
  // check if the chatgpt answer is a sql query if so run it
  const result = await sql.query`SELECT * FROM Tickets Where TicketID = ${req.body.TicketID}`;

  res.json(result.recordset);
})

app.get('/', (req, res) => {
  res.send('SQL ChatGpt server operational!');
});

app.get('/allDbsAndSchemas', async (req, res) => {
  const sqlDatabasesAvailable = await sql.query`SELECT name FROM master.sys.databases`;
  const databaseList = sqlDatabasesAvailable.recordset

  let databases = []
  for (const database of databaseList) {
    const result = await sql
      .query(`
        USE ${database.name};
        SELECT 
            t.TABLE_NAME,
            c.COLUMN_NAME,
            c.DATA_TYPE
        FROM 
            INFORMATION_SCHEMA.TABLES t
        JOIN 
            INFORMATION_SCHEMA.COLUMNS c ON t.TABLE_NAME = c.TABLE_NAME
        WHERE 
            t.TABLE_TYPE = 'BASE TABLE'
        ORDER BY 
          t.TABLE_NAME, c.ORDINAL_POSITION;
        `);
    // Push the results to the array
    result.recordset.forEach(row => {
      const dbName = row.DatabaseName;
      const tableName = row.TABLE_NAME;
      const columnName = row.COLUMN_NAME;
      const dataType = row.DATA_TYPE;

      if (!databases[dbName]) {
        databases[dbName] = [];
      }

      const existingTable = databases[dbName].find(table => table.tableName === tableName);

      if (existingTable) {
        existingTable.columns.push({ columnName, dataType });
      } else {
        databases[dbName].push({
          tableName,
          columns: [{ columnName, dataType }],
        });
      }
    });
  }
  // all available schemas
  console.log(databases)

  res.send(databases);
});


// Catch all requests
app.get('*', function (req, res) {
  res.sendStatus(404);
})

//</editor-fold>
