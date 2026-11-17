
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors')
const app = express();
app.use(express.json()); 
app.use(cors());         

const users = []; 
const PORT = 3000;
const JWT_SECRET = 'super_secret_key_123';
app.post('./register', async (req, res) => {
    try {
          const { email, password } = req.body;
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt)

          const newUser = { id: Date.now(), email, password: hashedPassword}
          users.push(newUser);
          res.status(201).json({ message: 'User registered' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
});
app.post('./login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = users.find((u) => u.email === email);
        if (!user) {
            return res.status(400).json({ message: 'Incorrect email or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Incorrect email or password' });
        }
        const token = jwt.sign(
      { userId: user.id, email: user.email }, 
      JWT_SECRET,                            
      { expiresIn: '1h' }                    
    );

    res.json({ token });
} catch (error) {
    res.status(500).json({ message: 'Ошибка сервера' });
}
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})