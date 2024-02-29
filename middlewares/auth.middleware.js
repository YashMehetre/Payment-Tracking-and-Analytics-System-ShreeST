// Import required modules
const bcrypt = require('bcrypt');
const uuid = require('uuid'); // For generating unique identifiers
const conn = require('../modules/database');

// Fetch the users from the database
async function fetchUsers() {
    let sql = `SELECT * FROM users`;
    try {
        const [result] = await conn.promise().execute(sql);
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

// Keep track of active sessions with their unique session tokens and expiration times
const activeSessions = {};

// Function to set a cookie with an expiration time
function setCookieWithExpiry(res, authToken, maxAge) {
    // Calculate the expiration time based on the current time and the specified maxAge
    const expirationTime = new Date(Date.now() + maxAge);
    // Set the cookie with the authToken, maxAge, and expiration time
    res.cookie('authToken', authToken, { maxAge: maxAge, expires: expirationTime, secure: true, sameSite: 'strict'});
}

// Middleware function to authenticate users
async function authenticate(req, res, next) {
    // Check if the user already has an active session
    if (req.cookies.authToken && activeSessions[req.cookies.authToken]) {
        // User is already logged in, proceed to the next middleware
        next();
    } else {
        // Retrieve users from the database
        const users = await fetchUsers();

        // Extract username and password from the request body
        const { username, password } = req.body;

        // Check if username and password are provided
        if (!username || !password) {
            // If username or password is missing, proceed to the next middleware with an error
            return next(new Error('Username and Password are required'));   
        }

        // Find the user with the provided username
        const user = users.find(u => u.username === username);

        // Check if the user exists
        if (!user) {
            // If user does not exist, respond with an error message
            return res.status(400).json({ message: 'Invalid Username or Password' });
        }

        // Compare passwords
        bcrypt.compare(password, user.password, (err, result) => {
            // Check if there is an error or if the passwords do not match
            if (err || !result) {
                // If error or passwords do not match, respond with an error message
                return res.status(400).json({ message: 'Invalid Username or Password' });
            }
            // Authentication successful, generate a unique session token
            const authToken = uuid.v4();
            // Set the expiration time for the session token (24 hours)
            const maxAge = 1000 * 60 * 60 * 24; // 24 hours expiration
            // Store the session token and its expiration time in the activeSessions object
            activeSessions[authToken] = {
                username: username,
                expires: Date.now() + maxAge
            };
            // Set the session token as a cookie with expiration time
            setCookieWithExpiry(res, authToken, maxAge);
            
            // Move to the next middleware
            next();
        });
    }
}

// Function to periodically check for expired session tokens and remove them
function removeExpiredSessions() {
    const now = Date.now();
    // Iterate through activeSessions and remove expired tokens
    for (const authToken in activeSessions) {
        if (activeSessions[authToken].expires < now) {
            delete activeSessions[authToken];
        }
    }
}

// Schedule the removal of expired sessions to run every hour
setInterval(removeExpiredSessions, 1000 * 60 * 60); // 1000 milliseconds * 60 seconds * 60 minutes

// Export the authentication middleware
module.exports = authenticate;
