const views = require("../views");

async function getAllSchedules(req, res) {
  try {
    const schedules = await views.getAll("Schedules");
    res.json(schedules[0]); // Return only the first recordset
  } catch (error) {
    res.status(500).send("Error retrieving schedules from database");
  }
}

async function getScheduleById(req, res) {
  try {
    const schedules = await views.getById("Schedules", req.params.id);
    if (schedules[0] && schedules[0].length > 0) {
      // Check if the first recordset has data
      res.json(schedules[0]); // Return only the data in the first recordset
    } else {
      res.status(404).send("Schedule not found");
    }
  } catch (error) {
    res.status(500).send("Error retrieving schedule");
  }
}

async function createSchedule(req, res) {
  try {
    const newSchedule = await views.insertInto("Schedules", req.body);
    if (newSchedule[0] && newSchedule[0].length > 0) {
      res.status(201).json(newSchedule[0][0]); // Assuming the INSERT returns the created record
    } else {
      res.status(500).send("No schedule was created"); // Handle the case where no schedule was created
    }
  } catch (error) {
    res.status(500).send("Error creating schedule");
  }
}

async function updateSchedule(req, res) {
  try {
    const updatedSchedule = await views.updateById(
      "Schedules",
      req.params.id,
      req.body
    );
    if (updatedSchedule[0] && updatedSchedule[0].length > 0) {
      res.json(updatedSchedule[0]); // Return the updated schedule data
    } else {
      res.status(404).send("No schedule was updated"); // Handle the case where no schedule was updated
    }
  } catch (error) {
    res.status(500).send("Error updating schedule");
  }
}

async function deleteSchedule(req, res) {
  try {
    const result = await views.deleteById("Schedules", req.params.id);
    if (result[0] && result[0].length > 0) {
      res.status(200).send("Schedule deleted successfully");
    } else {
      res.status(404).send("No schedule was deleted"); // Handle the case where no schedule was found to delete
    }
  } catch (error) {
    res.status(500).send("Error deleting schedule");
  }
}

module.exports = {
  getAllSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};
