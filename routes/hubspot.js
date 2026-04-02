const express = require('express');
const dotenv = require("dotenv");
const axios = require("axios");
const {DateTime} = require("luxon");
const router = express.Router({ mergeParams: true });
const fs = require("fs");

dotenv.config();

router.post('/hubspot/contacts/bes', async (req, res) => {
  fs.writeFile('../besData/output.json', req.body, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error writing to file');
    }
    res.send('Data saved successfully!');
  });

  // await axios.post(`${process.env.HUBSPOT_API_URL}/objects/contacts`, {
  //   properties: {
  //
  //   }
  // }, {
  //   headers: { Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}` }
  // }).then(hubspotRes => res.send(hubspotRes.data));
});

router.post('/hubspot/contacts', async (req, res) => {
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

router.post('/hubspot/tasks', async (req, res) => {
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

router.get('/hubspot/owners', async (req, res) => {
  await axios.get(`${process.env.HUBSPOT_API_URL}/owners`, {
    headers: { Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}`}
  })
    .then(hubspotRes => hubspotRes.data)
    .then(data => res.json(data));
});

module.exports = router;