const express = require('express');
const dotenv = require('dotenv');
const axios = require("axios");
const cors = require("cors");
const {DateTime} = require("luxon");

const app = express();
const port = 3000;

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
    },
  }, {
    headers: { Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}`}
  }).then(hubspotRes => res.send(hubspotRes.data));
});

app.post('/hubspot/tasks', async (req, res) => {
  let now = DateTime.now();

  await axios.post(`${process.env.HUBSPOT_API_URL}/objects/tasks`, {
    associations: [
      {
        types: [
          {
            associationCategory: "HUBSPOT_DEFINED",
            associationTypeId: 204
          }
        ],
        to: {
          id: req.body.contactId // CONTACT ID NEED TO CHANGE
        }
      }
    ],
    objectWriteTraceId: "string",
    properties: {
      hs_timestamp: now.plus({ hours: 24 }).toUTC().toString(), // 24 hours
      hs_task_body: req.body.taskBody,
      hubspot_owner_id: req.body.hubspotOwnerId,
      hs_task_subject: req.body.taskSubject,
      hs_task_status: "NOT_STARTED",
      hs_task_priority: req.body.taskPriority,
      hs_task_type: req.body.taskType,
      hs_task_reminders: now.plus({ days: 7 }).ts // Date.now() + 24*60*60 (this should be 3 days)
    }
  }, {
    headers: { Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}`}
  }).then(hubspotRes => res.send("Success"));
});

app.get('/hubspot/owners', async (req, res) => {
  await axios.get(`${process.env.HUBSPOT_API_URL}/owners`, {
    headers: { Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}`}
  })
    .then(hubspotRes => hubspotRes.data)
    .then(data => res.json(data));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});