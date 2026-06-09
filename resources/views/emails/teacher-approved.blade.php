<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: #10b981; color: white; padding: 30px; text-align: center; }
        .body { padding: 30px; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
        h1 { margin: 0; font-size: 24px; }
        .btn { display: inline-block; padding: 12px 30px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Account Approved!</h1>
        </div>
        <div class="body">
            <h2>Welcome, {{ $teacher->name }}!</h2>
            <p>Your teacher account has been approved by the school administrator.</p>
            <p>You can now log in and start creating lesson topics for your students.</p>
            <a href="http://127.0.0.1:8000/login" class="btn">Login to Your Account</a>
            <p style="margin-top: 20px; color: #6b7280;">Use your registered email and password to sign in.</p>
        </div>
        <div class="footer">
            <p>© {{ date('Y') }} School Portal. All rights reserved.</p>
        </div>
    </div>
</body>
</html>