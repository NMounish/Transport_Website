import express from "express";
import mysql from "mysql";
import cors from "cors";
import bcrypt from "bcryptjs";
import Stripe from "stripe";
import bodyParser from "body-parser";

// const stripe = Stripe("sk_test_51R3t6BG02mzQQsFNQMJvK7kCSvNeXun2y42zXHBaNm49CNViAWZhDMKYXeSDX8MajBYT4EEhDiUx8ManTfqPn4SE00aPF6KeK2");
const app = express();
app.use(express.json());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Mylaptop1234",
  database: "signup",
});

// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:5173", // Allow only your frontend
    credentials: true, // Allow cookies & authentication
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  })
);
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:5173");
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL database.");
});

// Login Route
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM register WHERE email = ?";

  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    bcrypt.compare(password, results[0].password, (err, isMatch) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res.status(500).json({ message: "Error checking password" });
      }

      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Invalid email or password" });
      }

      return res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
          id: results[0].id,
          fname: results[0].fname,
          email: results[0].email,
        },
      });
    });
  });
});

// Register Route
app.post("/register", (req, res) => {
  if (req.body.password !== req.body.confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).json({ message: "Error hashing password" });
    }

    const query = "INSERT INTO register(`fname`, `lname`, `email`, `password`) VALUES (?, ?, ?, ?)";
    const values = [req.body.fname, req.body.lname, req.body.email, hashedPassword];

    db.query(query, values, (err, data) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ message: "Database error" });
      }
      return res.status(200).json({ message: "Registration successful" });
    });
  });
});

// Password change endpoint
app.put("/change-password/:id", async (req, res) => {
  const userId = req.params.id;
  const { currentPassword, newPassword } = req.body;

  try {
    // 1. Verify current password
    const userQuery = "SELECT password FROM register WHERE id = ?";
    db.query(userQuery, [userId], async (err, results) => {
      if (err) throw err;
      
      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(currentPassword, results[0].password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      // 2. Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // 3. Update password
      const updateQuery = "UPDATE register SET password = ? WHERE id = ?";
      db.query(updateQuery, [hashedPassword, userId], (err, result) => {
        if (err) throw err;
        res.status(200).json({ message: "Password updated successfully" });
      });
    });
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({ message: "Error changing password" });
  }
});

app.put("/update-profile/:id", (req, res) => {
  const userId = req.params.id;
  const { fname, email, password, currentPassword } = req.body;

  // First verify current password if changing password
  if (password) {
    const verifyQuery = "SELECT password FROM register WHERE id = ?";
    db.query(verifyQuery, [userId], (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      bcrypt.compare(currentPassword, results[0].password, (err, isMatch) => {
        if (err) {
          console.error("Error comparing passwords:", err);
          return res.status(500).json({ message: "Error verifying password" });
        }

        if (!isMatch) {
          return res.status(400).json({ message: "Current password is incorrect" });
        }

        // Hash the new password and update
        bcrypt.hash(password, 10, (err, hashedPassword) => {
          if (err) {
            console.error("Error hashing password:", err);
            return res.status(500).json({ message: "Error hashing password" });
          }

          const updateQuery = "UPDATE register SET fname = ?, email = ?, password = ? WHERE id = ?";
          db.query(updateQuery, [fname, email, hashedPassword, userId], (err, result) => {
            if (err) {
              console.error("Database query error:", err);
              return res.status(500).json({ message: "Database error" });
            }
            return res.status(200).json({ message: "Profile updated successfully" });
          });
        });
      });
    });
  } else {
    // Update without password change
    const updateQuery = "UPDATE register SET fname = ?, email = ? WHERE id = ?";
    db.query(updateQuery, [fname, email, userId], (err, result) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ message: "Database error" });
      }
      return res.status(200).json({ message: "Profile updated successfully" });
    });
  }
});

app.post('/create-checkout-session', async (req, res) => {
  const { priceId, userId } = req.body;
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'payment',
    success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `http://localhost:5173/cancel`
  });

  // Store booking with current timestamp
  const query = "INSERT INTO bookings (user_id, session_id, price, status) VALUES (?, ?, ?, 'pending', NOW())";
  db.query(query, [userId, session.id, priceId], (err) => {
    if (err) {
      console.error("Error saving booking:", err);
      return res.status(500).json({ error: "Failed to create booking" });
    }
    console.log("Booking created for session:", session.id);
  });

  res.json({ id: session.id });
});

app.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = "whsec_BOuny3OEbPMyrcNtNRLyxJg7XIVZmOzC"; // Make sure this matches your Stripe dashboard

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("Processing successful payment for session:", session.id);

    // Update database
    const query = "UPDATE bookings SET status = 'completed' WHERE session_id = ?";
    db.query(query, [session.id], (err, result) => {
      if (err) {
        console.error("Database update error:", err);
      } else {
        console.log(`Updated ${result.affectedRows} booking(s) to completed`);
      }
    });
  }

  res.json({ received: true });
});

app.get("/user-bookings/:userId", (req, res) => {
  const { userId } = req.params;
  console.log("Fetching bookings for user ID:", userId);
  const query = "SELECT * FROM bookings WHERE user_id = ? AND status = 'pending'";
  console.log("Executing query:", query, "with userId:", userId);
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    res.json({ 
      bookings: results,
      totalBookings: results.length });
  });
});

// Add this route to your backend
app.get("/booking-analytics/:userId", (req, res) => {
  const { userId } = req.params;
  
  // Get total bookings count
  const totalQuery = "SELECT COUNT(*) as total FROM bookings WHERE user_id = ?";
  
  // Get bookings by status
  const statusQuery = `
    SELECT 
      status, 
      COUNT(*) as count 
    FROM bookings 
    WHERE user_id = ? 
    GROUP BY status
  `;
  
  // Get monthly bookings
  const monthlyQuery = `
    SELECT 
      DATE_FORMAT(created_at, '%Y-%m') as month,
      COUNT(*) as count
    FROM bookings
    WHERE user_id = ?
    GROUP BY DATE_FORMAT(created_at, '%Y-%m')
    ORDER BY month
    LIMIT 6
  `;

  db.query(totalQuery, [userId], (err, totalResult) => {
    if (err) return res.status(500).json({ error: err.message });
    
    db.query(statusQuery, [userId], (err, statusResult) => {
      if (err) return res.status(500).json({ error: err.message });
      
      db.query(monthlyQuery, [userId], (err, monthlyResult) => {
        if (err) return res.status(500).json({ error: err.message });
        
        res.json({
          total: totalResult[0].total,
          byStatus: statusResult,
          monthly: monthlyResult
        });
      });
    });
  });
});

// Add this to your server.js
app.get("/user/:id", (req, res) => {
  const userId = req.params.id;
  const query = "SELECT id, fname, lname, email FROM register WHERE id = ?";
  
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    
    return res.status(200).json(results[0]);
  });
});



app.listen(8081, () => {
  console.log("Server is running on port 8081");
});