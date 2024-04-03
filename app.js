const express = require('express');
const dotenv = require('dotenv');
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors({ origin: true }));

dotenv.config();

app.get('/asana/users', (req, res) => {
  axios.get(`${process.env.ASANA_API_URL}/users`, {
    headers: { Authorization: `Bearer ${process.env.ASANA_TOKEN}`}
  })
    .then(asanaRes => asanaRes.data)
    .then(data => res.json(data));
});

app.post('/asana/tasks', async (req, res) => {
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

app.post('/hubspot/contacts', async (req, res) => {
  await axios.post(`${process.env.HUBSPOT_API_URL}/objects/contacts`, {
    properties: {
      email: req.body.Email,
      firstname: req.body.Name.split(" ")[0],
      lastname: req.body.Name.split(" ")[1],
      phone: req.body["Phone Number"],
      company: req.body.Company,
      website: "",
      lifecyclestage: "lead"
    }
  }, {
    headers: { Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}`}
  }).then(hubspotRes => res.send("Success"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});