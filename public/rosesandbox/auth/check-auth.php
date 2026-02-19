<?php
/**
 * Sensorium RoseSandbox - Authentication Check
 * Include this file at the top of protected pages
 */

session_start();

define('SESSION_TIMEOUT', 3600); // 1 hour

// Check if user is authenticated
if (!isset($_SESSION['rosesandbox_authenticated']) || $_SESSION['rosesandbox_authenticated'] !== true) {
    // Not authenticated, redirect to login
    header('Location: /sandbox/rosesandbox/auth/login.php');
    exit;
}

// Check session timeout
if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > SESSION_TIMEOUT)) {
    // Session expired
    session_unset();
    session_destroy();
    header('Location: /sandbox/rosesandbox/auth/login.php?expired=1');
    exit;
}

// Update last activity time
$_SESSION['last_activity'] = time();
?>
