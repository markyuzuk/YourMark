<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get JSON data
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid data']);
    exit;
}

// Save to file as backup (in case email fails)
$log_file = 'form-submissions.log';
$log_entry = date('Y-m-d H:i:s') . " | " . json_encode($data) . "\n";
file_put_contents($log_file, $log_entry, FILE_APPEND);

// Email configuration
$to = 'matt@sensoriumcr.com';
$form_type = isset($data['form_type']) ? $data['form_type'] : 'unknown';
$subject = $form_type === 'joinNetwork' ? 'New Site Network Application' : 'New Partnership Inquiry';

// Build email body in HTML format
$message = "<html><body>";
$message .= "<h2>Form Submission</h2>";
$message .= "<p><strong>Form Type:</strong> " . htmlspecialchars($form_type) . "</p>";
$message .= "<p><strong>Submitted:</strong> " . (isset($data['timestamp']) ? htmlspecialchars($data['timestamp']) : date('Y-m-d H:i:s')) . "</p>";
$message .= "<hr>";
$message .= "<h3>Details:</h3>";
$message .= "<table border='1' cellpadding='10' style='border-collapse: collapse;'>";

foreach ($data as $key => $value) {
    if ($key !== 'form_type' && $key !== 'timestamp') {
        $label = ucwords(str_replace('_', ' ', $key));
        $message .= "<tr>";
        $message .= "<td><strong>" . htmlspecialchars($label) . "</strong></td>";
        $message .= "<td>" . htmlspecialchars($value) . "</td>";
        $message .= "</tr>";
    }
}

$message .= "</table>";
$message .= "</body></html>";

// Email headers for HTML
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
$headers .= "From: Sensorium Forms <noreply@" . $_SERVER['HTTP_HOST'] . ">\r\n";
$headers .= "Reply-To: " . (isset($data['email']) ? $data['email'] : 'noreply@sensoriumcr.com') . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Try to send email
$success = @mail($to, $subject, $message, $headers);

// Always return success since we're logging to file
// This ensures users get a good experience even if email fails
echo json_encode([
    'success' => true, 
    'message' => 'Form submitted successfully',
    'logged' => true,
    'email_sent' => $success
]);
?>
