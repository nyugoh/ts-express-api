create database if not exists api_template;

CREATE TABLE IF NOT EXISTS auth (
	id INT(11) NOT NULL AUTO_INCREMENT,
    username VARCHAR(56) NOT NULL UNIQUE,
    first_name VARCHAR(256),
    last_name VARCHAR(256),
    full_name VARCHAR(256),
    email VARCHAR(256) NOT NULL UNIQUE,
    password VARCHAR(256) NOT NULL,
    profile_avatar VARCHAR(256) DEFAULT 'images/blank-profile-picture-640.png',
    last_login DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_admin ENUM('0','1') DEFAULT '0', -- not admin
    is_active ENUM('0','1') DEFAULT '1', -- account is active by default,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);
