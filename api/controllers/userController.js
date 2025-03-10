const views = require("../views");
const jwt = require("jsonwebtoken");
const secretKey = "yourSecretKey"; // Adjust as necessary

async function getAllUsers(req, res) {
  try {
    const users = await views.getAll("Users");
    res.json(users[0]); // Return only the first recordset
  } catch (error) {
    res.status(500).send("Error retrieving users from database");
  }
}

async function getUserById(req, res) {
  try {
    const users = await views.getById("Users", req.params.id);
    if (users[0] && users[0].length > 0) {
      res.json(users[0]); // Return only the data in the first recordset
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(500).send("Error retrieving user");
  }
}

async function createUser(req, res) {
  try {
    const newUser = await views.insertInto("Users", req.body);
    if (newUser[0] && newUser[0].length > 0) {
      res.status(201).json(newUser[0][0]); // Assuming the INSERT returns the created record
    } else {
      res.status(500).send("No user was created");
    }
  } catch (error) {
    res.status(500).send("Error creating user");
  }
}

async function updateUser(req, res) {
  try {
    const updatedUser = await views.updateById(
      "Users",
      req.params.id,
      req.body
    );
    if (updatedUser[0] && updatedUser[0].length > 0) {
      res.json(updatedUser[0]); // Return the updated user data
    } else {
      res.status(404).send("No user was updated");
    }
  } catch (error) {
    res.status(500).send("Error updating user");
  }
}

async function deleteUser(req, res) {
  try {
    const result = await views.deleteById("Users", req.params.id);
    if (result[0] && result[0].length > 0) {
      res.status(200).send("User deleted successfully");
    } else {
      res.status(404).send("No user was deleted");
    }
  } catch (error) {
    res.status(500).send("Error deleting user");
  }
}

async function filterBy(req, res) {
  try {
    const { columnNames, columnValues } = req.body;
    const filteredUsers = await views.filterBy(
      "Users",
      columnNames,
      columnValues
    );
    if (filteredUsers[0] && filteredUsers[0].length > 0) {
      res.json(filteredUsers[0]);
    } else {
      res.status(404).send("No users found with specified criteria");
    }
  } catch (error) {
    res.status(500).send("Error filtering users");
  }
  // Removed stray code that was causing errors.
}

async function loginUser(req, res) {
  try {
    const { username, password } = req.body;
    const studentno = req.params.studentno;

    // Note: For security, ensure that the password is hashed before comparing.
    const columnNames = ["studentno", "password"];
    const columnValues = [studentno, password];

    const users = await views.filterBy("Masterlist", columnNames, columnValues);

    if (users[0] && users[0].length > 0) {
      const user = users[0][0]; // Use the first record from the result set
      const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: "1h" });
      res.json({ message: "Login successful", user: user, token: token });
    } else {
      res.status(401).send("Invalid username or password");
    }
  } catch (error) {
    res.status(500).send(error);
  }
}

function logoutUser(req, res) {
  try {
    res.clearCookie("token");
    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).send("Error during logout");
  }
}

async function resetUser(req, res) {
  try {
    const updatedUser = await views.updateByConditions(
      "Masterlist",
      req.body.conditions,
      req.body.data
    );
    if (updatedUser) {
      res.json({ status: "ok" });
    } else {
      res.status(404).send("No student was updated");
    }
  } catch (error) {
    res.status(500).send("Error updating student");
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  filterBy,
  loginUser,
  logoutUser,
  resetUser,
};
