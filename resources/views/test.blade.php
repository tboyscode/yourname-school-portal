<!DOCTYPE html>
<html>
<head>
    <title>School Portal - Full API Test</title>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <style>
        body { font-family: Arial, sans-serif; max-width: 900px; margin: 20px auto; padding: 0 20px; }
        button { margin: 5px; padding: 10px 15px; cursor: pointer; border: none; border-radius: 5px; color: white; }
        .login-btn { background: #4CAF50; }
        .teacher-btn { background: #2196F3; }
        .student-btn { background: #FF9800; }
        .admin-btn { background: #f44336; }
        .danger-btn { background: #000; }
        hr { margin: 20px 0; }
        pre { background: #1e1e1e; color: #d4d4d4; padding: 15px; border-radius: 5px; overflow-x: auto; max-height: 400px; overflow-y: auto; }
        .section { border: 2px solid #ddd; padding: 15px; margin: 15px 0; border-radius: 8px; }
        .section h2 { margin-top: 0; }
        .token-display { background: #e8f5e9; padding: 10px; border-radius: 5px; word-break: break-all; }
        input, select { padding: 8px; margin: 5px; border: 1px solid #ddd; border-radius: 4px; }
    </style>
</head>
<body>
    <h1>🔬 School Portal - Complete API Test Suite</h1>
    
    <div class="token-display">
        <strong>Current Token:</strong> <span id="tokenDisplay" style="color:green;">None (Login first!)</span><br>
        <strong>Logged in as:</strong> <span id="userDisplay">Nobody</span>
    </div>

    <!-- ============ LOGIN SECTION ============ -->
    <div class="section">
        <h2>1️⃣ Login / Registration</h2>
        <button class="login-btn" onclick="login('admin@school.com', 'password')">Login Admin</button>
        <button class="login-btn" onclick="login('teacher@school.com', 'password')">Login Teacher</button>
        <button class="login-btn" onclick="login('tope123', 'password')">Login Student</button>
        <button class="login-btn" onclick="logout()">Logout</button>
        <br>
        <h3>Register New Student:</h3>
        <input id="reg_name" placeholder="Name" value="Chidi">
        <input id="reg_username" placeholder="Username" value="chidi123">
        <input id="reg_password" placeholder="Password" value="password">
        <input id="reg_password_confirmation" placeholder="Confirm Password" value="password">
        <select id="reg_class"><option>SS1</option><option>SS2</option><option selected>SS3</option></select>
        <select id="reg_dept"><option>Science</option><option>Art</option><option selected>Commercial</option></select>
        <button class="student-btn" onclick="registerStudent()">Register Student</button>
    </div>

    <!-- ============ TEACHER SECTION ============ -->
    <div class="section">
        <h2>2️⃣ Teacher Actions (Login as Teacher first!)</h2>
        <button class="teacher-btn" onclick="createTopic()">Create Topic</button>
        <button class="teacher-btn" onclick="getTopics()">Get All Topics</button>
        <button class="teacher-btn" onclick="searchTopics()">Search Topics</button>
        <button class="teacher-btn" onclick="updateTopic()">Update Last Topic</button>
        <button class="danger-btn" onclick="deleteTopic()">Delete Last Topic</button>
        <br>
        <input id="search_term" placeholder="Search term..." value="Algebra">
        <br>
        <h3>Profile Updates (2FA):</h3>
        <button class="teacher-btn" onclick="send2FA()">Send 2FA Code</button>
        <input id="two_fa_code" placeholder="Enter 2FA Code" size="10">
        <button class="teacher-btn" onclick="updateEmail()">Update Email</button>
    </div>

    <!-- ============ STUDENT SECTION ============ -->
    <div class="section">
        <h2>3️⃣ Student Actions (Login as Student first!)</h2>
        <button class="student-btn" onclick="getStudentTopics()">My Topics</button>
        <button class="student-btn" onclick="getStudentSubjects()">My Subjects</button>
        <button class="student-btn" onclick="getStudentTopicsFiltered()">My Topics (First Term)</button>
    </div>

    <!-- ============ ADMIN SECTION ============ -->
    <div class="section">
        <h2>4️⃣ Admin Actions (Login as Admin first!)</h2>
        <button class="admin-btn" onclick="getDashboard()">Dashboard Stats</button>
        <button class="admin-btn" onclick="getTeachers()">All Teachers</button>
        <button class="admin-btn" onclick="getStudents()">All Students</button>
        <button class="admin-btn" onclick="searchUsers()">Search Users</button>
        <button class="admin-btn" onclick="approveTeacher()">Approve Teacher</button>
        <button class="admin-btn" onclick="getSubjects()">All Subjects</button>
        <button class="admin-btn" onclick="createSubject()">Add Subject</button>
        <button class="danger-btn" onclick="deactivateUser()">Deactivate User</button>
        <br>
        <input id="search_user" placeholder="Search user name..." value="Tope">
        <input id="user_id_action" placeholder="User ID to act on" value="2" size="5">
    </div>

    <!-- ============ RESPONSE ============ -->
    <h3>📋 Response:</h3>
    <pre id="result">Click any button to see API response here...</pre>

    <script>
        let currentToken = null;
        let currentUser = null;
        let lastTopicId = null;
        let last2FACode = null;

        function showResult(data) {
            document.getElementById('result').textContent = JSON.stringify(data, null, 2);
        }

        function updateUI(token, user) {
            currentToken = token;
            currentUser = user;
            document.getElementById('tokenDisplay').textContent = token ? token.substring(0, 25) + '...' : 'None';
            document.getElementById('userDisplay').textContent = user ? user.name + ' (' + user.role + ')' : 'Nobody';
        }

        function authHeader() {
            return { Authorization: `Bearer ${currentToken}` };
        }

        // ===== LOGIN =====
        async function login(loginValue, password) {
            try {
                const res = await axios.post('/api/login', { login: loginValue, password });
                updateUI(res.data.token, res.data.user);
                showResult(res.data);
            } catch (e) { showResult(e.response?.data || e.message); }
        }

        async function logout() {
            if (!currentToken) return alert('Login first!');
            try {
                const res = await axios.post('/api/logout', {}, { headers: authHeader() });
                updateUI(null, null);
                showResult(res.data);
            } catch (e) { showResult(e.response?.data || e.message); }
        }

        // ===== REGISTRATION =====
        async function registerStudent() {
            try {
                const res = await axios.post('/api/student/register', {
                    name: document.getElementById('reg_name').value,
                    username: document.getElementById('reg_username').value,
                    password: document.getElementById('reg_password').value,
                    password_confirmation: document.getElementById('reg_password_confirmation').value,
                    class: document.getElementById('reg_class').value,
                    department: document.getElementById('reg_dept').value,
                });
                updateUI(res.data.token, res.data.user);
                showResult(res.data);
            } catch (e) { showResult(e.response?.data || e.message); }
        }

        // ===== TOPICS =====
        async function createTopic() {
            if (!currentToken) return alert('Login as Teacher first!');
            try {
                const res = await axios.post('/api/topics', {
                    subject_id: 1,
                    title: 'Introduction to Algebra ' + Date.now(),
                    content: 'Algebra is a branch of mathematics that deals with symbols and rules for manipulating those symbols.',
                    class: 'SS2',
                    term: 'First Term'
                }, { headers: authHeader() });
                lastTopicId = res.data.topic.id;
                showResult(res.data);
            } catch (e) { showResult(e.response?.data || e.message); }
        }

        async function getTopics() {
            if (!currentToken) return alert('Login first!');
            try {
                const res = await axios.get('/api/topics', { headers: authHeader() });
                if (res.data.data?.length > 0) lastTopicId = res.data.data[0].id;
                showResult(res.data);
            } catch (e) { showResult(e.response?.data || e.message); }
        }

        async function searchTopics() {
            if (!currentToken) return alert('Login first!');
            const search = document.getElementById('search_term').value;
            try {
                const res = await axios.get('/api/topics?search=' + search, { headers: authHeader() });
                showResult(res.data);
            } catch (e) { showResult(e.response?.data || e.message); }
        }

        async function updateTopic() {
            if (!currentToken) return alert('Login as Teacher first!');
            if (!lastTopicId) return alert('Get topics first to find a topic ID!');
            try {
                const res = await axios.put('/api/topics/' + lastTopicId, {
                    title: 'UPDATED Topic ' + Date.now(),
                    content: 'This content has been updated!'
                }, { headers: authHeader() });
                showResult(res.data);
            } catch (e) { showResult(e.response?.data || e.message); }
        }

        async function deleteTopic() {
            if (!currentToken) return alert('Login as Teacher first!');
            if (!lastTopicId) return alert('Get topics first to find a topic ID!');
            if (!confirm('Delete topic #' + lastTopicId + '?')) return;
            try {
                const res = await axios.delete('/api/topics/' + lastTopicId, { headers: authHeader() });
                showResult(res.data);
            } catch (e) { showResult(e.response?.data || e.message); }
        }

        // ===== 2FA =====
        async function send2FA() {
            if (!currentToken) return alert('Login first!');
            try {
                const res = await axios.post('/api/send-2fa', {}, { headers: authHeader() });
                last2FACode = res.data.code;
                showResult(res.data);
                document.getElementById('two_fa_code').value = res.data.code;
            } catch (e) { showResult(e.response?.data || e.message); }
        }

        async function updateEmail() {
            if (!currentToken) return alert('Login first!');
            const code = document.getElementById('two_fa_code').value;
            try {
                const res = await axios.put('/api/update-email', {
                    code: code,
                    new_email: 'updated' + Date.now() + '@school.com'
                }, { headers: authHeader() });
                showResult(res.data);
            } catch (e) { showResult(e.response?.data || e.message); }
        }

        // ===== STUDENT =====
        async function getStudentTopics() {
            if (!currentToken) return alert('Login as Student first!');
            try {
                const res = await axios.get('/api/student/topics', { headers: authHeader() });
                showResult(res.data);
            } catch (e) { showResult(e.response?.data || e.message); }
        }

        async function getStudentSubjects() {
            if (!currentToken) return alert('Login as Student first!');
            try {
                const res = await axios.get('/api/student/subjects', { headers: authHeader() });
                showResult(res.data);
            } catch (e) { showResult(e.response?.data || e.message); }
        }

        async function getStudentTopicsFiltered() {
            if (!currentToken) return alert('Login as Student first!');
            try {
                const res = await axios.get('/api/student/topics?term=First Term', { headers: authHeader() });
                showResult(res.data);
            } catch (e) { showResult(e.response?.data || e.message); }
        }

        // ===== ADMIN =====
        async function getDashboard() {
            if (!currentToken) return alert('Login as Admin first!');
            try {
                const res = await axios.get('/api/admin/dashboard', { headers: authHeader() });
                showResult(res.data);
            } catch (e) { showResult(e.response?.data || e.message); }
        }

        async function getTeachers() {
            if (!currentToken) return alert('Login as Admin first!');
            try {
                const res = await axios.get('/api/admin/teachers', { headers: authHeader() });
                showResult(res.data);
            } catch (e) { showResult(e.response?.data || e.message); }
        }

        async function getStudents() {
            if (!currentToken) return alert('Login as Admin first!');
            try {
                const res = await axios.get('/api/admin/students', { headers: authHeader() });
                showResult(res.data);
            } catch (e) { showResult(e.response?.data || e.message); }
        }

        async function searchUsers() {
            if (!currentToken) return alert('Login as Admin first!');
            const search = document.getElementById('search_user').value;
            try {
                const res = await axios.get('/api/admin/students?search=' + search, { headers: authHeader() });
                showResult(res.data);
            } catch (e) { showResult(e.response?.data || e.message); }
        }

        async function approveTeacher() {
            if (!currentToken) return alert('Login as Admin first!');
            const id = document.getElementById('user_id_action').value;
            try {
                const res = await axios.put('/api/admin/teachers/' + id + '/approve', {}, { headers: authHeader() });
                showResult(res.data);
            } catch (e) { showResult(e.response?.data || e.message); }
        }

        async function getSubjects() {
            if (!currentToken) return alert('Login as Admin first!');
            try {
                const res = await axios.get('/api/admin/subjects', { headers: authHeader() });
                showResult(res.data);
            } catch (e) { showResult(e.response?.data || e.message); }
        }

        async function createSubject() {
            if (!currentToken) return alert('Login as Admin first!');
            try {
                const res = await axios.post('/api/admin/subjects', {
                    name: 'New Subject ' + Date.now(),
                    department: 'Science',
                    description: 'A test subject'
                }, { headers: authHeader() });
                showResult(res.data);
            } catch (e) { showResult(e.response?.data || e.message); }
        }

        async function deactivateUser() {
            if (!currentToken) return alert('Login as Admin first!');
            const id = document.getElementById('user_id_action').value;
            if (!confirm('Deactivate user #' + id + '?')) return;
            try {
                const res = await axios.put('/api/admin/users/' + id, {
                    status: 'inactive'
                }, { headers: authHeader() });
                showResult(res.data);
            } catch (e) { showResult(e.response?.data || e.message); }
        }
    </script>
</body>
</html>