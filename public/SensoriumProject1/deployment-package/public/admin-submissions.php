<?php
// Simple password protection
$correct_password = '2025Sensoriumcr'; // Change this to a secure password
$logged_in = false;

session_start();

if (isset($_POST['password'])) {
    if ($_POST['password'] === $correct_password) {
        $_SESSION['admin_logged_in'] = true;
        $logged_in = true;
    } else {
        $error = "Incorrect password";
    }
}

if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    $logged_in = true;
}

if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: admin-submissions.php');
    exit;
}

if (!$logged_in) {
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Login - Sensorium</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .login-box {
                background: white;
                padding: 3rem;
                border-radius: 12px;
                box-shadow: 0 8px 24px rgba(0,0,0,0.2);
                width: 100%;
                max-width: 400px;
            }
            h1 { color: #0284c7; margin-bottom: 2rem; text-align: center; }
            input[type="password"] {
                width: 100%;
                padding: 1rem;
                border: 2px solid #e5e7eb;
                border-radius: 6px;
                font-size: 1rem;
                margin-bottom: 1rem;
            }
            button {
                width: 100%;
                padding: 1rem;
                background: #0284c7;
                color: white;
                border: none;
                border-radius: 6px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
            }
            button:hover { background: #0369a1; }
            .error {
                background: #fee2e2;
                color: #991b1b;
                padding: 0.75rem;
                border-radius: 6px;
                margin-bottom: 1rem;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="login-box">
            <h1>🔒 Admin Login</h1>
            <?php if (isset($error)): ?>
                <div class="error"><?php echo $error; ?></div>
            <?php endif; ?>
            <form method="POST">
                <input type="password" name="password" placeholder="Enter password" required autofocus>
                <button type="submit">Login</button>
            </form>
        </div>
    </body>
    </html>
    <?php
    exit;
}

// Admin is logged in - show submissions
$log_file = 'form-submissions.log';
$submissions = [];

if (file_exists($log_file)) {
    $lines = file($log_file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $parts = explode(' | ', $line, 2);
        if (count($parts) === 2) {
            $timestamp = $parts[0];
            $data = json_decode($parts[1], true);
            if ($data) {
                $submissions[] = [
                    'timestamp' => $timestamp,
                    'data' => $data
                ];
            }
        }
    }
    $submissions = array_reverse($submissions); // Show newest first
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form Submissions - Sensorium Admin</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            background: #f3f4f6;
            padding: 2rem;
        }
        .header {
            background: white;
            padding: 1.5rem 2rem;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        h1 { color: #0284c7; }
        .logout {
            background: #ef4444;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
        }
        .logout:hover { background: #dc2626; }
        .stats {
            background: white;
            padding: 1.5rem 2rem;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
        }
        .submission {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            margin-bottom: 1.5rem;
            border-left: 4px solid #0284c7;
        }
        .submission-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #e5e7eb;
        }
        .form-type {
            background: #0284c7;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            font-weight: 600;
        }
        .timestamp {
            color: #6b7280;
            font-size: 0.95rem;
        }
        .field {
            margin-bottom: 1rem;
        }
        .field-label {
            font-weight: 600;
            color: #374151;
            margin-bottom: 0.25rem;
        }
        .field-value {
            color: #1f2937;
            padding: 0.5rem;
            background: #f9fafb;
            border-radius: 4px;
        }
        .no-submissions {
            text-align: center;
            padding: 4rem;
            color: #6b7280;
            background: white;
            border-radius: 12px;
        }
        .refresh-btn {
            background: #0284c7;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            display: inline-block;
            border: none;
            cursor: pointer;
            font-size: 1rem;
        }
        .refresh-btn:hover { background: #0369a1; }
        .table-container {
            overflow-x: auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        table {
            width: 100%;
            border-collapse: collapse;
            min-width: 800px;
        }
        th {
            position: sticky;
            top: 0;
            background: #0284c7;
            color: white;
            font-weight: 600;
            text-align: left;
        }
        td, th {
            padding: 1rem;
            border-bottom: 1px solid #e5e7eb;
        }
        tr:hover {
            background: #f3f4f6 !important;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📋 Form Submissions</h1>
        <div>
            <a href="?refresh=1" class="refresh-btn" style="margin-right: 1rem;">🔄 Refresh</a>
            <a href="?logout=1" class="logout">Logout</a>
        </div>
    </div>

    <div class="stats">
        <h2 style="color: #0284c7; margin-bottom: 0.5rem;">Total Submissions: <?php echo count($submissions); ?></h2>
        <p style="color: #6b7280;">Last updated: <?php echo date('Y-m-d H:i:s'); ?></p>
        <?php if (!empty($submissions)): ?>
            <button onclick="exportToExcel()" class="refresh-btn" style="margin-top: 1rem; background: #10b981;">
                📊 Export to Excel
            </button>
        <?php endif; ?>
    </div>

    <?php if (empty($submissions)): ?>
        <div class="no-submissions">
            <h2 style="color: #6b7280; margin-bottom: 1rem;">No submissions yet</h2>
            <p>Form submissions will appear here once users submit the forms on your website.</p>
        </div>
    <?php else: ?>
        <div class="table-container">
            <table id="submissions-table">
                <thead>
                    <tr>
                        <th>Date/Time</th>
                        <th>Form Type</th>
                        <?php
                        // Get all unique field names
                        $allFields = [];
                        foreach ($submissions as $submission) {
                            foreach ($submission['data'] as $key => $value) {
                                if ($key !== 'form_type' && $key !== 'timestamp' && !in_array($key, $allFields)) {
                                    $allFields[] = $key;
                                }
                            }
                        }
                        foreach ($allFields as $field):
                        ?>
                            <th>
                                <?php echo htmlspecialchars(ucwords(str_replace('_', ' ', $field))); ?>
                            </th>
                        <?php endforeach; ?>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($submissions as $index => $submission): ?>
                        <tr style="<?php echo $index % 2 === 0 ? 'background: #f9fafb;' : 'background: white;'; ?>">
                            <td style="white-space: nowrap;">
                                <?php echo htmlspecialchars($submission['timestamp']); ?>
                            </td>
                            <td>
                                <span style="background: #0284c7; color: white; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.875rem; white-space: nowrap;">
                                    <?php 
                                    echo $submission['data']['form_type'] === 'joinNetwork' 
                                        ? 'Join Network' 
                                        : 'Partner'; 
                                    ?>
                                </span>
                            </td>
                            <?php foreach ($allFields as $field): ?>
                                <td>
                                    <?php echo isset($submission['data'][$field]) ? htmlspecialchars($submission['data'][$field]) : '-'; ?>
                                </td>
                            <?php endforeach; ?>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        
        <script>
        function exportToExcel() {
            // Get table
            const table = document.getElementById('submissions-table');
            
            // Convert table to CSV
            let csv = [];
            const rows = table.querySelectorAll('tr');
            
            for (let i = 0; i < rows.length; i++) {
                const row = [];
                const cols = rows[i].querySelectorAll('td, th');
                
                for (let j = 0; j < cols.length; j++) {
                    let data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, ' ').replace(/"/g, '""');
                    row.push('"' + data + '"');
                }
                
                csv.push(row.join(','));
            }
            
            // Create download link
            const csvContent = csv.join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            link.setAttribute('href', url);
            link.setAttribute('download', 'sensorium-submissions-' + new Date().toISOString().split('T')[0] + '.csv');
            link.style.visibility = 'hidden';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        </script>
    <?php endif; ?>
</body>
</html>
