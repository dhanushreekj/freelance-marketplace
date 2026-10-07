
CREATE DATABASE IF NOT EXISTS freelance_db;
USE freelance_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('client','freelancer','admin') NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE freelancer_profiles (
  user_id INT PRIMARY KEY,
  title VARCHAR(150),
  bio TEXT,
  experience_years INT DEFAULT 0,
  hourly_rate DECIMAL(10,2),
  resume_path VARCHAR(255),
  avg_rating DECIMAL(3,2) DEFAULT 0,
  completed_projects INT DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE client_profiles (
  user_id INT PRIMARY KEY,
  company_name VARCHAR(150),
  about TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) UNIQUE NOT NULL
);

CREATE TABLE freelancer_skills (
  freelancer_id INT,
  skill_id INT,
  PRIMARY KEY (freelancer_id, skill_id),
  FOREIGN KEY (freelancer_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(id)
);

CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  budget DECIMAL(10,2),
  deadline DATE,
  status ENUM('open','assigned','in_progress','completed','cancelled') DEFAULT 'open',
  progress INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES users(id)
);

CREATE TABLE project_skills (
  project_id INT,
  skill_id INT,
  PRIMARY KEY (project_id, skill_id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(id)
);

CREATE TABLE bids (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT,
  freelancer_id INT,
  amount DECIMAL(10,2),
  delivery_days INT,
  proposal TEXT,
  status ENUM('pending','accepted','rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (project_id, freelancer_id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (freelancer_id) REFERENCES users(id)
);

CREATE TABLE assigned_projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT UNIQUE,
  freelancer_id INT,
  bid_id INT,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (freelancer_id) REFERENCES users(id),
  FOREIGN KEY (bid_id) REFERENCES bids(id)
);

CREATE TABLE milestones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT,
  title VARCHAR(150),
  description TEXT,
  due_date DATE,
  status ENUM('pending','in_progress','done') DEFAULT 'pending',
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT,
  receiver_id INT,
  project_id INT NULL,
  content TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id)
);

CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  message VARCHAR(255),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT,
  reviewer_id INT,
  reviewee_id INT,
  rating TINYINT,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (project_id, reviewer_id),
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (reviewer_id) REFERENCES users(id),
  FOREIGN KEY (reviewee_id) REFERENCES users(id)
);

CREATE TABLE portfolios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  freelancer_id INT,
  title VARCHAR(150),
  description TEXT,
  file_path VARCHAR(255),
  FOREIGN KEY (freelancer_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reporter_id INT,
  reported_user_id INT NULL,
  project_id INT NULL,
  reason TEXT,
  status ENUM('open','resolved') DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reporter_id) REFERENCES users(id)
);

INSERT INTO skills (name) VALUES
('React'), ('Node.js'), ('Python'), ('Java'), ('MySQL'),
('UI/UX Design'), ('Graphic Design'), ('Content Writing'),
('Data Analysis'), ('Machine Learning'), ('Android'), ('SEO');