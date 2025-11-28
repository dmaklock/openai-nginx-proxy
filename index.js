const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_API_URL = process.env.OPENAI_API_URL || 'https://api.openai.com';

// Middleware
app.use(express.json());
app.use(express.text({ type: 'text/plain' }));

// Логирование
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Прокси для /v1/chat/completions
app.post('/v1/chat/completions', async (req, res) => {
  try {
    const targetUrl = `${OPENAI_API_URL}/v1/chat/completions`;
    
    // Получаем Authorization из заголовков запроса
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header is required' });
    }

    const response = await axios.post(targetUrl, req.body, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      responseType: 'stream',
      timeout: 300000, // 5 минут
    });

    // Устанавливаем заголовки ответа
    Object.keys(response.headers).forEach((key) => {
      const value = response.headers[key];
      if (value !== undefined && key !== 'content-encoding') {
        res.setHeader(key, value);
      }
    });

    res.status(response.status);
    response.data.pipe(res);

  } catch (error) {
    if (error.response) {
      res.status(error.response.status || 500);
      if (error.response.data) {
        if (typeof error.response.data === 'string') {
          res.send(error.response.data);
        } else if (Buffer.isBuffer(error.response.data)) {
          res.send(error.response.data);
        } else if (error.response.data.pipe) {
          // Это stream, передаем как есть
          error.response.data.pipe(res);
          return;
        } else {
          try {
            res.json(error.response.data);
          } catch (jsonError) {
            // Если не удается сериализовать, отправляем простой текст
            res.send(JSON.stringify({ 
              error: 'Error from OpenAI API',
              status: error.response.status 
            }));
          }
        }
      } else {
        res.json({ error: 'Unknown error from OpenAI API' });
      }
    } else if (error.request) {
      console.error('No response from OpenAI API:', error.message);
      res.status(504).json({ error: 'Gateway timeout', message: error.message });
    } else {
      console.error('Request setup error:', error.message);
      res.status(500).json({ error: 'Internal server error', message: error.message });
    }
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`OpenAI Proxy server running on http://localhost:${PORT}`);
  console.log(`Proxying /v1/chat/completions to: ${OPENAI_API_URL}/v1/chat/completions`);
});

