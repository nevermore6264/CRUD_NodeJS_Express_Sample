INSERT INTO users (username, email, password, role, createdAt, updatedAt)
VALUES 
('admin', 'admin@example.com', '$2a$12$YqxzvOnR86FrakOtBr3NgOmt.GG7OBP5.AU6Og8eoJ9zE0P1Afoqa', 'admin', NOW(), NOW()), -- Mật khẩu: "admin123"
('user1', 'user1@example.com', '$2a$12$IpDwCaUFyGDpF7kGuFXRSus/Aifs5l0KngTrXF/1EcDxSGVxWzTn2', 'user', NOW(), NOW()),  -- Mật khẩu: "user123"
('user2', 'user2@example.com', '$2a$12$IpDwCaUFyGDpF7kGuFXRSus/Aifs5l0KngTrXF/1EcDxSGVxWzTn2', 'user', NOW(), NOW()),  -- Mật khẩu: "user123"
('user3', 'user3@example.com', '$2a$12$IpDwCaUFyGDpF7kGuFXRSus/Aifs5l0KngTrXF/1EcDxSGVxWzTn2', 'user', NOW(), NOW());  -- Mật khẩu: "user123"
