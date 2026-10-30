const pool = require('../config/db');

// GET /api/skills
exports.getSkills = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name FROM skills ORDER BY name');
    res.json({ skills: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/profile
exports.getMyProfile = async (req, res) => {
  try {
    const { id, role } = req.user;
    const [users] = await pool.query(
      'SELECT id, name, email, role FROM users WHERE id = ?', [id]
    );
    if (!users.length) return res.status(404).json({ message: 'User not found' });

    let profile = {};
    let skills = [];

    if (role === 'freelancer') {
      const [p] = await pool.query('SELECT * FROM freelancer_profiles WHERE user_id = ?', [id]);
      profile = p[0] || {};
      const [s] = await pool.query(
        `SELECT s.id, s.name FROM freelancer_skills fs
         JOIN skills s ON s.id = fs.skill_id
         WHERE fs.freelancer_id = ?`, [id]
      );
      skills = s;
    } else if (role === 'client') {
      const [p] = await pool.query('SELECT * FROM client_profiles WHERE user_id = ?', [id]);
      profile = p[0] || {};
    }

    res.json({ user: users[0], profile, skills });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/profile
exports.updateMyProfile = async (req, res) => {
  try {
    const { id, role } = req.user;
    const { name } = req.body;

    if (name) {
      await pool.query('UPDATE users SET name = ? WHERE id = ?', [name, id]);
    }

    if (role === 'freelancer') {
      const { title, bio, experience_years, hourly_rate } = req.body;
      await pool.query(
        `UPDATE freelancer_profiles
         SET title = ?, bio = ?, experience_years = ?, hourly_rate = ?
         WHERE user_id = ?`,
        [title || null, bio || null, Number(experience_years) || 0, hourly_rate || null, id]
      );
    } else if (role === 'client') {
      const { company_name, about } = req.body;
      await pool.query(
        'UPDATE client_profiles SET company_name = ?, about = ? WHERE user_id = ?',
        [company_name || null, about || null, id]
      );
    }

    res.json({ message: 'Profile updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/profile/skills   body: { skillIds: [1, 2, 3] }
exports.updateMySkills = async (req, res) => {
  const { skillIds } = req.body;
  if (!Array.isArray(skillIds)) {
    return res.status(400).json({ message: 'skillIds must be an array' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query('DELETE FROM freelancer_skills WHERE freelancer_id = ?', [req.user.id]);
    for (const skillId of skillIds) {
      await conn.query(
        'INSERT INTO freelancer_skills (freelancer_id, skill_id) VALUES (?, ?)',
        [req.user.id, skillId]
      );
    }
    await conn.commit();
    res.json({ message: 'Skills updated' });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    conn.release();
  }
};

// GET /api/freelancers/:id
exports.getFreelancer = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.name, fp.title, fp.bio, fp.experience_years,
              fp.hourly_rate, fp.avg_rating, fp.completed_projects
       FROM users u
       JOIN freelancer_profiles fp ON fp.user_id = u.id
       WHERE u.id = ? AND u.is_active = 1`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Freelancer not found' });

    const [skills] = await pool.query(
      `SELECT s.id, s.name FROM freelancer_skills fs
       JOIN skills s ON s.id = fs.skill_id
       WHERE fs.freelancer_id = ?`, [req.params.id]
    );
    res.json({ freelancer: rows[0], skills });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};