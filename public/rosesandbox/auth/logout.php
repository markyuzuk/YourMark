<?php
/**
 * Sensorium RoseSandbox - Logout
 */

session_start();
session_unset();
session_destroy();

header('Location: /sandbox/rosesandbox/auth/login.php?logout=1');
exit;
?>
