CREATE DATABASE IF NOT EXISTS medialabs_dev;

use medialabs_dev;

CREATE TABLE veterinary (
    veterinary_owner_ci INT(8) NOT NULL PRIMARY KEY,
    veterinary_nam VARCHAR(50) NOT NULL,
    veterinary_password VARCHAR(16) NOT NULL,
    veterinary_email VARCHAR(50) NOT NULL,
    veterinary_owner_name VARCHAR(25) NOT NULL
);

CREATE TABLE patients (
    patient_id SERIAL NOT NULL PRIMARY KEY,
    patient_owner_ci INT(8) NOT NULL,
    patient_nam VARCHAR(25) NOT NULL,
    patient_breed VARCHAR(25) DEFAULT NULL,
    patient_weight int(5) DEFAULT NULL,
    patient_type VARCHAR(15) NOT NULL,
    patient_gender VARCHAR(20) NOT NULL,
    patient_age INT(2) DEFAULT NULL,
    patient_previous VARCHAR(250) DEFAULT NULL
);

CREATE TABLE clients (
    client_ci INT(8) NOT NULL PRIMARY KEY,
    client_name VARCHAR(50) NOT NULL,
    client_phone INT(15) NOT NULL,
    client_address VARCHAR(150) DEFAULT NULL,
    client_email VARCHAR(50) NOT NULL
);

CREATE TABLE client_patient (
    patient_id SERIAL NOT NULL,
    client_ci INT(8) NOT NULL,
    PRIMARY KEY(patient_id, client_ci),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (client_ci) REFERENCES clients(client_ci)
);

CREATE TABLE veterinary_worker (
    worker_ci INT(8) NOT NULL PRIMARY KEY,
    worker_phone INT(15) NOT NULL,
    worker_name VARCHAR(50) NOT NULL,
    worker_email VARCHAR(50) NOT NULL
);

CREATE TABLE appointment (
    appointment_id INT(36) NOT NULL PRIMARY KEY,
    appointment_timestamp TIMESTAMP NOT NULL,
    appointment_report VARCHAR(500) DEFAULT NULL,
    worker_ci INT(8) NOT NULL,
    patient_id SERIAL NOT NULL,
    FOREIGN KEY (worker_ci) REFERENCES veterinary_worker(worker_ci),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
);