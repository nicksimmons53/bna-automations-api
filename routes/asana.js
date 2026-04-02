const express = require('express');
const axios = require("axios");
const dotenv = require("dotenv");
const router = express.Router({ mergeParams: true });

dotenv.config();

router.get('/users', (req, res) => {
  axios.get(`${process.env.ASANA_API_URL}/users`, {
    headers: { Authorization: `Bearer ${process.env.ASANA_TOKEN}`}
  })
    .then(asanaRes => asanaRes.data)
    .then(data => res.json(data));
});

router.post('/tasks', async (req, res) => {
  await axios.post(`${process.env.ASANA_API_URL}/tasks`, {
    data: {
      name: req.body.asanaTaskName,
      due_at: new Date().toJSON(),
      assignee: req.body.asanaUser,
      projects: [
        process.env.ASANA_SALES_PIPELINE_ID,
      ],
      workspace: process.env.ASANA_WORKSPACE_ID,
      notes: req.body.Notes
    }
  }, {
    headers: { Authorization: `Bearer ${process.env.ASANA_TOKEN}`}
  }).then(asanaRes => res.send("Success"));
});

module.exports = router;