import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;
const dbPath = path.join(__dirname, 'db.json');

app.use(bodyParser.json());

const loadSubmissions = (): any[] => {
    if (fs.existsSync(dbPath)) {
        const data = fs.readFileSync(dbPath, 'utf-8');
        return JSON.parse(data);
    }
    return [];
};

const saveSubmissions = (submissions: any[]): void => {
    fs.writeFileSync(dbPath, JSON.stringify(submissions, null, 2), 'utf-8');
};

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the Submission API\nUse /submit to post data and /read to fetch data.');
});

app.get('/ping', (req: Request, res: Response) => {
    res.json({ message: 'pong' });
});

app.post('/submit', (req: Request, res: Response) => {
    const submissions = loadSubmissions();
    submissions.push(req.body);
    saveSubmissions(submissions);
    res.json({ message: 'Submission saved' });
});

app.get('/read', (req: Request, res: Response) => {
  const submissions = loadSubmissions();
  const index = req.query.index ? parseInt(req.query.index as string, 10) : null;

  if (index !== null) {
      if (index >= 0 && index < submissions.length) {
          res.json(submissions[index]);
      } else {
          res.status(404).json({ error: 'Submission not found' });
      }
  } else {
      res.json(submissions);
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});




// import express, { Request, Response } from 'express';
// import bodyParser from 'body-parser';
// import fs from 'fs';
// import path from 'path';

// // Initialize Express app
// const app = express();
// const PORT = 3000;
// const dbPath = path.join(__dirname, 'db.json');

// // Middleware
// app.use(bodyParser.json());

// // Load submissions from db.json
// const loadSubmissions = (): any[] => {
//     if (fs.existsSync(dbPath)) {
//         const data = fs.readFileSync(dbPath, 'utf-8');
//         return JSON.parse(data);
//     }
//     return [];
// };

// // Save submissions to db.json
// const saveSubmissions = (submissions: any[]): void => {
//     fs.writeFileSync(dbPath, JSON.stringify(submissions, null, 2), 'utf-8');
// };

// // Routes
// app.get('/', (req: Request, res: Response) => {
//     res.send('Welcome to the Submission API\nUse /submit to post data and /read to fetch data.');
// });

// app.get('/ping', (req: Request, res: Response) => {
//     res.json({ message: 'pong' });
// });

// app.post('/submit', (req: Request, res: Response) => {
//     const submissions = loadSubmissions();
//     submissions.push(req.body);
//     saveSubmissions(submissions);
//     res.json({ message: 'Submission saved' });
// });

// app.get('/read', (req: Request, res: Response) => {
//     const index = parseInt(req.query.index as string, 10);
//     const submissions = loadSubmissions();
//     if (index >= 0 && index < submissions.length) {
//         res.json(submissions[index]);
//     } else {
//         res.status(404).json({ error: 'Submission not found' });
//     }
// });

// // Start server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });
