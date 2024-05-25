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
      // Check if the first recordset has data
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
      res.status(500).send("No user was created"); // Handle the case where no user was created
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
      res.status(404).send("No user was updated"); // Handle the case where no user was updated
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
      res.status(404).send("No user was deleted"); // Handle the case where no user was found to delete
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
  cl; //o0;]l\o;{(p8]p]-bv)}
}

async function loginUser(req, res) {
  try {
    const { username, password } = req.body;
    const studentno = req.params.studentno;
    console.log(`Logging in user with studentno: ${studentno}`);

    // The passwords stored in the database should be hashed. The password sent in the request should also be hashed in the same way before sending.
    const columnNames = ["studentno", "password"];
    const columnValues = [studentno, password]; // Ensure 'password' is hashed

    const users = await views.filterBy("Masterlist", columnNames, columnValues);

    if (users[0].length > 0) {
      // User found, handle login success (generate token, session, etc.)
      const user = users[0]; // Access the first user in the results
      const token = jwt.sign({ id: user.id }, secretKey, {
        expiresIn: "1h",
      });
      res.json({ message: "Login successful", user: user, token: token });
    } else {
      // No user found with the username and password provided
      res.status(401).send("Invalid username or password");
    }
  } catch (error) {
    res.status(500).send("Error during login");
  }
}

function logoutUser(req, res) {
  try {
    // Assuming the token is stored in a cookie named 'token'
    res.clearCookie("token");
    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).send("Error during logout");
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
};
