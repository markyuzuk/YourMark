<?php
/**
 * Sensorium RoseSandbox - Custom Login Page
 * Simple session-based authentication for client sandbox access
 */

// Start session
session_start();

// Configuration
define('SANDBOX_USERNAME', 'sensorium_client');  // Change this
define('SANDBOX_PASSWORD', 'RoseSandbox2026!');   // Change this to a secure password
define('SESSION_TIMEOUT', 3600); // 1 hour in seconds

// Check if already logged in
if (isset($_SESSION['rosesandbox_authenticated']) && $_SESSION['rosesandbox_authenticated'] === true) {
    // Check session timeout
    if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > SESSION_TIMEOUT)) {
        // Session expired
        session_unset();
        session_destroy();
        session_start();
    } else {
        // Update last activity time
        $_SESSION['last_activity'] = time();
        // Redirect to sandbox
        header('Location: /sandbox/rosesandbox/index.html');
        exit;
    }
}

// Handle login form submission
$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    
    if ($username === SANDBOX_USERNAME && $password === SANDBOX_PASSWORD) {
        // Successful login
        $_SESSION['rosesandbox_authenticated'] = true;
        $_SESSION['last_activity'] = time();
        $_SESSION['login_time'] = time();
        
        // Redirect to sandbox
        header('Location: /sandbox/rosesandbox/index.html');
        exit;
    } else {
        $error = 'Invalid username or password';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sensorium RoseSandbox - Client Login</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #e11d48 0%, #881337 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .login-container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            padding: 60px 50px;
            max-width: 450px;
            width: 100%;
        }
        
        .logo {
            text-align: center;
            margin-bottom: 40px;
        }
        
        .logo h1 {
            color: #e11d48;
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 10px;
        }
        
        .logo p {
            color: #6b7280;
            font-size: 16px;
        }
        
        .form-group {
            margin-bottom: 25px;
        }
        
        label {
            display: block;
            color: #374151;
            font-weight: 600;
            margin-bottom: 8px;
            font-size: 14px;
        }
        
        input[type="text"],
        input[type="password"] {
            width: 100%;
            padding: 14px 16px;
            border: 2px solid #e5e7eb;
            border-radius: 10px;
            font-size: 16px;
            transition: all 0.3s;
            outline: none;
        }
        
        input[type="text"]:focus,
        input[type="password"]:focus {
            border-color: #e11d48;
            box-shadow: 0 0 0 3px rgba(225, 29, 72, 0.1);
        }
        
        .error-message {
            background: #fef2f2;
            border: 1px solid #fecaca;
            color: #991b1b;
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
        }
        
        .submit-btn {
            width: 100%;
            background: #e11d48;
            color: white;
            border: none;
            padding: 16px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .submit-btn:hover {
            background: #be123c;
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(225, 29, 72, 0.3);
        }
        
        .submit-btn:active {
            transform: translateY(0);
        }
        
        .info-text {
            text-align: center;
            color: #6b7280;
            font-size: 13px;
            margin-top: 30px;
            line-height: 1.6;
        }
        
        .divider {
            height: 1px;
            background: #e5e7eb;
            margin: 30px 0;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="logo">
            <h1>Sensorium Clinical Research</h1>
            <p>RoseSandbox - Client Preview</p>
        </div>
        
        <?php if ($error): ?>
            <div class="error-message">
                <?php echo htmlspecialchars($error); ?>
            </div>
        <?php endif; ?>
        
        <form method="POST" action="">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required autocomplete="username">
            </div>
            
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required autocomplete="current-password">
            </div>
            
            <button type="submit" class="submit-btn">Access Sandbox</button>
        </form>
        
        <div class="divider"></div>
        
        <div class="info-text">
            <strong>Welcome to the Sensorium Version 5 Preview</strong><br>
            This is a private sandbox environment for client review.<br>
            Your session will expire after 1 hour of inactivity.
        </div>
    </div>
</body>
</html>
