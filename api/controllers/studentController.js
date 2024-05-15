const views = require("../views");

async function getAllStudents(req, res) {
  try {
    const students = await views.getAll("Masterlist");
    res.json(students[0]); // Return only the first recordset
  } catch (error) {
    res.status(500).send("Error retrieving students from database");
  }
}

async function getStudentById(req, res) {
  try {
    const students = await views.getById("Masterlist", req.params.id);
    if (students[0] && students[0].length > 0) {
      // Check if the first recordset has data
      res.json(students[0]); // Return only the data in the first recordset
    } else {
      res.status(404).send("Student not found");
    }
  } catch (error) {
    res.status(500).send("Error retrieving student");
  }
}

async function createStudent(req, res) {
  try {
    const newStudent = await views.insertInto("Masterlist", req.body);
    if (newStudent[0] && newStudent[0].length > 0) {
      res.status(201).json(newStudent[0][0]); // Assuming the INSERT returns the created record
    } else {
      res.status(500).send("No student was created"); // Handle the case where no student was created
    }
  } catch (error) {
    res.status(500).send("Error creating student");
  }
}

async function updateStudent(req, res) {
  try {
    const updatedStudent = await views.updateById(
      "Masterlist",
      req.params.id,
      req.body
    );
    if (updatedStudent[0] && updatedStudent[0].length > 0) {
      res.json(updatedStudent[0]); // Return the updated student data
    } else {
      res.status(404).send("No student was updated"); // Handle the case where no student was updated
    }
  } catch (error) {
    res.status(500).send("Error updating student");
  }
}

async function deleteStudent(req, res) {
  try {
    const result = await views.deleteById("Masterlist", req.params.id);
    if (result[0] && result[0].length > 0) {
      res.status(200).send("Student deleted successfully");
    } else {
      res.status(404).send("No student was deleted"); // Handle the case where no student was found to delete
    }
  } catch (error) {
    res.status(500).send("Error deleting student");
  }
}

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
